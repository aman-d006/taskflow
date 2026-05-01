from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        from_attributes = True

class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: date
    priority: str = "medium"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None
    progress: Optional[float] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    created_date: date
    due_date: date
    priority: str
    completed: bool
    completed_date: Optional[date]
    progress: float
    user_id: int
    
    class Config:
        from_attributes = True

class MilestoneCreate(BaseModel):
    title: str
    description: str
    target_date: date

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[date] = None
    achieved: Optional[bool] = None
    progress: Optional[float] = None

class MilestoneResponse(BaseModel):
    id: int
    title: str
    description: str
    target_date: date
    achieved: bool
    achieved_date: Optional[date]
    progress: float
    user_id: int
    
    class Config:
        from_attributes = True

class DailyProgressCreate(BaseModel):
    task_id: int
    date: date
    completed: bool = True

class DailyProgressResponse(BaseModel):
    id: int
    date: date
    completed: bool
    task_id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str