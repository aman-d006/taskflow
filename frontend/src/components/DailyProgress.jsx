import { useState, useEffect } from 'react'
import { tasksAPI, progressAPI } from '../api'
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import './DailyProgress.css'

export default function DailyProgress() {
  const [tasks, setTasks] = useState([])
  const [weekDates, setWeekDates] = useState([])
  const [progressData, setProgressData] = useState({})
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date().toISOString().split('T')[0]
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    const dates = []
    const base = new Date()
    base.setDate(base.getDate() + weekOffset * 7)
    const start = new Date(base)
    start.setDate(base.getDate() - base.getDay())
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      dates.push(d.toISOString().split('T')[0])
    }
    setWeekDates(dates)
  }, [weekOffset])

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await tasksAPI.getAll()
      setTasks(res.data.filter(t => !t.completed))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!tasks.length) return
    const load = async () => {
      const all = {}
      for (const t of tasks) {
        try {
          const res = await progressAPI.getDaily(t.id)
          all[t.id] = {}
          res.data.forEach(p => { all[t.id][p.date] = p.completed })
        } catch (err) {}
      }
      setProgressData(all)
    }
    load()
  }, [tasks])

  const toggle = async (taskId, date) => {
    const isDone = progressData[taskId]?.[date]
    try {
      await progressAPI.markProgress({ task_id: taskId, date, completed: !isDone })
      setProgressData(prev => ({
        ...prev,
        [taskId]: { ...prev[taskId], [date]: !isDone }
      }))
      if (!isDone) {
        const task = tasks.find(t => t.id === taskId)
        await tasksAPI.update(taskId, { progress: Math.min((task.progress || 0) + 10, 100) })
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, progress: Math.min((t.progress || 0) + 10, 100) } : t))
      }
    } catch (err) {}
  }

  const weeklyPct = tasks.length ? Math.round(
    weekDates.filter(d => tasks.some(t => progressData[t.id]?.[d])).length / (weekDates.length * tasks.length) * 100
  ) : 0

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="progress-page">
      <div className="pg-header">
        <div>
          <h1>Daily Progress</h1>
          <p>Track achievements</p>
        </div>
        <div className="pg-streak">
          <Zap size={16} />
          <span>{weeklyPct}% this week</span>
        </div>
      </div>

      <div className="pg-today">
        <div className="pg-today-head">
          <h2>Today</h2>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        {tasks.length === 0 ? (
          <div className="pg-empty">No active tasks</div>
        ) : (
          <div className="pg-today-list">
            {tasks.map(task => {
              const done = progressData[task.id]?.[today]
              return (
                <div key={task.id} className={`pg-today-item ${done ? 'done' : ''}`} onClick={() => toggle(task.id, today)}>
                  {done ? <CheckCircle size={22} color="#10b981" /> : <Circle size={22} color="#d1d5db" />}
                  <span>{task.title}</span>
                  <span className="pg-today-count">
                    {weekDates.filter(d => progressData[task.id]?.[d]).length}/7
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="pg-week">
        <div className="pg-week-head">
          <h2>Weekly View</h2>
          <div className="pg-week-nav">
            <button onClick={() => setWeekOffset(o => o - 1)}><ChevronLeft size={18} /></button>
            <span>{new Date(weekDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(weekDates[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <button onClick={() => setWeekOffset(o => o + 1)} disabled={weekOffset === 0}><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="pg-table-wrap">
          <table className="pg-table">
            <thead>
              <tr>
                <th>Task</th>
                {weekDates.map(d => (
                  <th key={d} className={d === today ? 'pg-today-col' : ''}>
                    <div>{dayNames[new Date(d).getDay()]}</div>
                    <div className="pg-day-num">{new Date(d).getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="pg-task-name">{task.title}</td>
                  {weekDates.map(d => {
                    const done = progressData[task.id]?.[d]
                    return (
                      <td key={d} className={`pg-cell ${d === today ? 'pg-cell-today' : ''}`} onClick={() => toggle(task.id, d)}>
                        <div className={`pg-dot ${done ? 'pg-dot-done' : ''}`}>
                          {done && <CheckCircle size={14} />}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}