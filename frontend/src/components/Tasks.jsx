import { useState, useEffect } from 'react'
import { tasksAPI } from '../api'
import { Plus, Trash2, CheckCircle, Circle, Calendar, X } from 'lucide-react'
import './Tasks.css'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', due_date: new Date().toISOString().split('T')[0], priority: 'medium' })
  const [filter, setFilter] = useState('active')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadTasks() }, [])

  const loadTasks = async () => {
    try { const r = await tasksAPI.getAll(); setTasks(r.data) } catch (e) {} finally { setLoading(false) }
  }

  const create = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await tasksAPI.create(form)
    setForm({ title: '', description: '', due_date: new Date().toISOString().split('T')[0], priority: 'medium' })
    setShowModal(false)
    loadTasks()
  }

  const toggle = async (task) => {
    await tasksAPI.update(task.id, { completed: !task.completed, progress: task.completed ? task.progress : 100 })
    loadTasks()
  }

  const del = async (id) => { await tasksAPI.delete(id); loadTasks() }

  const filtered = tasks.filter(t => filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed)
  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' }

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="tasks-page">
      <div className="ts-header">
        <div>
          <h1>Tasks</h1>
          <p>{tasks.filter(t => !t.completed).length} active · {tasks.filter(t => t.completed).length} done</p>
        </div>
        <button className="ts-add-btn" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Task
        </button>
      </div>

      {showModal && (
        <div className="ts-overlay" onClick={() => setShowModal(false)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()}>
            <div className="ts-modal-head">
              <h2>New Task</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={create}>
              <input type="text" placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus required />
              <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
              <div className="ts-form-row">
                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
                <div className="ts-priority">
                  {['low', 'medium', 'high'].map(p => (
                    <button key={p} type="button" className={`ts-prio-btn ${form.priority === p ? 'active' : ''}`}
                      style={{ '--c': priorityColor[p] }} onClick={() => setForm({ ...form, priority: p })}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ts-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={!form.title.trim()}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ts-filters">
        {['all', 'active', 'completed'].map(f => (
          <button key={f} className={`ts-fbtn ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="ts-list">
        {filtered.length === 0 ? (
          <div className="ts-empty">No {filter} tasks</div>
        ) : filtered.map(task => (
          <div key={task.id} className={`ts-card ${task.completed ? 'done' : ''}`}>
            <button className="ts-check" onClick={() => toggle(task)}>
              {task.completed ? <CheckCircle size={22} color="#10b981" /> : <Circle size={22} color="#d1d5db" />}
            </button>
            <div className="ts-card-body">
              <div className="ts-card-top">
                <h3>{task.title}</h3>
                <span className="ts-tag" style={{ background: priorityColor[task.priority] + '15', color: priorityColor[task.priority] }}>
                  {task.priority}
                </span>
              </div>
              {task.description && <p className="ts-desc">{task.description}</p>}
              <div className="ts-meta">
                <span><Calendar size={13} /> {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <div className="ts-mini-bar"><div style={{ width: task.progress + '%' }} /></div>
                <span>{task.progress}%</span>
              </div>
            </div>
            <button className="ts-del" onClick={() => del(task.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}