import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { statsAPI, tasksAPI, milestonesAPI } from '../api'
import { CheckSquare, Target, TrendingUp, CalendarCheck, ArrowRight, Plus, Flag } from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [recentMilestones, setRecentMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [statsRes, tasksRes, milestonesRes] = await Promise.all([
        statsAPI.get(),
        tasksAPI.getAll(),
        milestonesAPI.getAll()
      ])
      setStats(statsRes.data)
      setRecentTasks(tasksRes.data.filter(t => !t.completed).slice(0, 5))
      setRecentMilestones(milestonesRes.data.filter(m => !m.achieved).slice(0, 3))
    } catch (err) {
      console.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    )
  }

  const statCards = [
    { 
      label: 'Total Tasks', 
      value: stats?.total_tasks || 0, 
      icon: <CheckSquare size={22} />,
      color: '#4f46e5',
      bgColor: '#eef2ff'
    },
    { 
      label: 'Completed', 
      value: stats?.completed_tasks || 0, 
      icon: <CalendarCheck size={22} />,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    { 
      label: 'Completion Rate', 
      value: `${stats?.completion_rate?.toFixed(0) || 0}%`, 
      icon: <TrendingUp size={22} />,
      color: '#f59e0b',
      bgColor: '#fffbeb'
    },
    { 
      label: "Today's Progress", 
      value: stats?.today_progress || 0, 
      icon: <Target size={22} />,
      color: '#ef4444',
      bgColor: '#fef2f2'
    },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="welcome-text">Welcome back! Here's your overview.</p>
        </div>
        <button className="quick-action-btn" onClick={() => navigate('/tasks')}>
          <Plus size={18} />
          Quick Add Task
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: stat.bgColor, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Active Tasks</h2>
            <button className="card-action" onClick={() => navigate('/tasks')}>
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          {recentTasks.length === 0 ? (
            <div className="card-empty">
              <CheckSquare size={40} strokeWidth={1} />
              <p>No active tasks</p>
              <button onClick={() => navigate('/tasks')}>Create your first task</button>
            </div>
          ) : (
            <div className="task-list">
              {recentTasks.map(task => (
                <div key={task.id} className="task-row">
                  <div className="task-row-info">
                    <span className="task-row-priority" style={{
                      background: task.priority === 'high' ? '#ef4444' : 
                                 task.priority === 'medium' ? '#f59e0b' : '#10b981'
                    }}></span>
                    <div>
                      <p className="task-row-title">{task.title}</p>
                      <span className="task-row-date">
                        Due {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="task-row-progress">
                    <div className="mini-progress-bar">
                      <div className="mini-progress-fill" style={{ width: `${task.progress || 0}%` }}></div>
                    </div>
                    <span>{task.progress || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Milestones</h2>
            <button className="card-action" onClick={() => navigate('/milestones')}>
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          {recentMilestones.length === 0 ? (
            <div className="card-empty">
              <Flag size={40} strokeWidth={1} />
              <p>No milestones yet</p>
              <button onClick={() => navigate('/milestones')}>Set your first goal</button>
            </div>
          ) : (
            <div className="milestone-list">
              {recentMilestones.map(milestone => (
                <div key={milestone.id} className="milestone-row">
                  <div className="milestone-icon">
                    <Flag size={18} />
                  </div>
                  <div className="milestone-info">
                    <p className="milestone-title">{milestone.title}</p>
                    <span className="milestone-date">
                      Target: {new Date(milestone.target_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="milestone-progress-row">
                      <div className="mini-progress-bar">
                        <div className="mini-progress-fill" style={{ width: `${milestone.progress || 0}%` }}></div>
                      </div>
                      <span>{milestone.progress || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-card full-width">
        <div className="card-header">
          <h2>Task Completion Overview</h2>
        </div>
        <div className="completion-overview">
          <div className="completion-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle 
                cx="60" cy="60" r="54" 
                fill="none" 
                stroke="url(#gradient)" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(stats?.completion_rate || 0) * 3.39} 339`}
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="completion-text">
              <span className="completion-value">{stats?.completion_rate?.toFixed(0) || 0}%</span>
              <span className="completion-label">Complete</span>
            </div>
          </div>
          <div className="completion-details">
            <div className="detail-item">
              <span className="detail-dot" style={{ background: '#4f46e5' }}></span>
              <span className="detail-label">Completed</span>
              <span className="detail-value">{stats?.completed_tasks || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-dot" style={{ background: '#e5e7eb' }}></span>
              <span className="detail-label">Remaining</span>
              <span className="detail-value">{(stats?.total_tasks || 0) - (stats?.completed_tasks || 0)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-dot" style={{ background: '#f59e0b' }}></span>
              <span className="detail-label">Milestones</span>
              <span className="detail-value">{stats?.achieved_milestones || 0}/{stats?.total_milestones || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard