# TaskFlow - Task Manager Application

A full-stack task management application with FastAPI backend and React frontend. Track tasks, monitor daily progress, and achieve milestones with an intuitive dashboard.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, Vite, React Router
- **Authentication**: JWT tokens

## Features

- User registration and login
- Task management with priorities and due dates
- Daily progress tracking with weekly view
- Milestone/goal tracking with progress sliders
- Interactive dashboard with statistics
- Modern, responsive dark/light UI

## Project Structure
taskflow/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── database.py      # Database configuration
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   └── auth.py          # Authentication logic
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api.js       # API client
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── requirements.txt

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm

## Quick Start

### 1. Clone the repository
git clone https://github.com/aman-d006/taskflow.git
cd taskflow

### 2. Backend Setup (Terminal 1)
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cd backend
python -m uvicorn main:app --reload --port 8000

### 3. Frontend Setup (Terminal 2)

cd frontend
npm install
npm run dev

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/token` | Login and get token |
| GET | `/users/me` | Get current user |
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create task |
| PUT | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task |
| POST | `/daily-progress` | Mark daily progress |
| GET | `/daily-progress/{task_id}` | Get daily progress |
| GET | `/milestones` | Get milestones |
| POST | `/milestones` | Create milestone |
| PUT | `/milestones/{id}` | Update milestone |
| DELETE | `/milestones/{id}` | Delete milestone |
| GET | `/stats` | Get dashboard statistics |

## License

MIT
