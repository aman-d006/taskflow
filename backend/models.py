from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    tasks = relationship("Task", back_populates="owner")
    milestones = relationship("Milestone", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    created_date = Column(Date, default=datetime.date.today)
    due_date = Column(Date)
    priority = Column(String, default="medium")
    completed = Column(Boolean, default=False)
    completed_date = Column(Date, nullable=True)
    progress = Column(Float, default=0.0)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="tasks")
    daily_progress = relationship("DailyProgress", back_populates="task")

class Milestone(Base):
    __tablename__ = "milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    target_date = Column(Date)
    achieved = Column(Boolean, default=False)
    achieved_date = Column(Date, nullable=True)
    progress = Column(Float, default=0.0)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="milestones")

class DailyProgress(Base):
    __tablename__ = "daily_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=datetime.date.today)
    completed = Column(Boolean, default=False)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    task = relationship("Task", back_populates="daily_progress")