from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db, Base
from models import User, Task, Milestone, DailyProgress
from schemas import *
from auth import *
from datetime import date, timedelta
from typing import List

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = Task(**task.dict(), user_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.user_id == current_user.id).all()

@app.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    
    if task.completed and not db_task.completed_date:
        db_task.completed_date = date.today()
    elif not task.completed:
        db_task.completed_date = None
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted"}

@app.post("/daily-progress", response_model=DailyProgressResponse)
def mark_daily_progress(progress: DailyProgressCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == progress.task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    existing = db.query(DailyProgress).filter(
        DailyProgress.task_id == progress.task_id,
        DailyProgress.date == progress.date
    ).first()
    
    if existing:
        existing.completed = progress.completed
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_progress = DailyProgress(**progress.dict())
        db.add(db_progress)
        db.commit()
        db.refresh(db_progress)
        return db_progress

@app.get("/daily-progress/{task_id}", response_model=List[DailyProgressResponse])
def get_daily_progress(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(DailyProgress).filter(DailyProgress.task_id == task_id).all()

@app.post("/milestones", response_model=MilestoneResponse)
def create_milestone(milestone: MilestoneCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_milestone = Milestone(**milestone.dict(), user_id=current_user.id)
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@app.get("/milestones", response_model=List[MilestoneResponse])
def get_milestones(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Milestone).filter(Milestone.user_id == current_user.id).all()

@app.put("/milestones/{milestone_id}", response_model=MilestoneResponse)
def update_milestone(milestone_id: int, milestone: MilestoneUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_milestone = db.query(Milestone).filter(Milestone.id == milestone_id, Milestone.user_id == current_user.id).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    for key, value in milestone.dict(exclude_unset=True).items():
        setattr(db_milestone, key, value)
    
    if milestone.achieved and not db_milestone.achieved_date:
        db_milestone.achieved_date = date.today()
    
    db.commit()
    db.refresh(db_milestone)
    return db_milestone

@app.delete("/milestones/{milestone_id}")
def delete_milestone(milestone_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_milestone = db.query(Milestone).filter(Milestone.id == milestone_id, Milestone.user_id == current_user.id).first()
    if not db_milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    db.delete(db_milestone)
    db.commit()
    return {"message": "Milestone deleted"}

@app.get("/stats")
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    milestones = db.query(Milestone).filter(Milestone.user_id == current_user.id).all()
    
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.completed)
    total_milestones = len(milestones)
    achieved_milestones = sum(1 for m in milestones if m.achieved)
    
    today = date.today()
    today_progress = db.query(DailyProgress).join(Task).filter(
        Task.user_id == current_user.id,
        DailyProgress.date == today,
        DailyProgress.completed == True
    ).count()
    
    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "completion_rate": (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        "total_milestones": total_milestones,
        "achieved_milestones": achieved_milestones,
        "today_progress": today_progress
    }