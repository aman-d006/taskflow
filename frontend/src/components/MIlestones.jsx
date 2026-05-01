import { useState, useEffect } from 'react'
import { milestonesAPI } from '../api'
import { Plus, Trash2, Flag, X, Trophy } from 'lucide-react'
import './Milestones.css'

export default function Milestones() {
  const [milestones, setMilestones] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', target_date: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    try { const r = await milestonesAPI.getAll(); setMilestones(r.data) } catch (e) {} finally { setLoading(false) }
  }

  const create = async (e) => {
    e.preventDefault()
    await milestonesAPI.create(form)
    setForm({ title: '', description: '', target_date: '' })
    setShowModal(false)
    load()
  }

  const update = async (id, data) => { await milestonesAPI.update(id, data); load() }
  const del = async (id) => { await milestonesAPI.delete(id); load() }

  const achieved = milestones.filter(m => m.achieved).length

  if (loading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="ms-page">
      <div className="ms-header">
        <div>
          <h1>Milestones</h1>
          <p>{achieved}/{milestones.length} achieved</p>
        </div>
        <button className="ms-add-btn" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Goal
        </button>
      </div>

      {showModal && (
        <div className="ts-overlay" onClick={() => setShowModal(false)}>
          <div className="ts-modal" onClick={e => e.stopPropagation()}>
            <div className="ts-modal-head">
              <h2>New Milestone</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={create}>
              <input type="text" placeholder="Milestone title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus required />
              <textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
              <input type="date" value={form.target_date} onChange={e => setForm({ ...form, target_date: e.target.value })} required />
              <div className="ts-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" disabled={!form.title.trim() || !form.target_date}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ms-list">
        {milestones.length === 0 ? (
          <div className="ms-empty">No milestones yet. Set your first goal!</div>
        ) : milestones.map(m => (
          <div key={m.id} className={`ms-card ${m.achieved ? 'done' : ''}`}>
            <div className="ms-card-left">
              <div className={`ms-icon ${m.achieved ? 'achieved' : ''}`}>
                {m.achieved ? <Trophy size={20} /> : <Flag size={20} />}
              </div>
              <div className="ms-body">
                <h3>{m.title}</h3>
                {m.description && <p>{m.description}</p>}
                <span className="ms-date">
                  {m.achieved ? `Achieved: ${m.achieved_date}` : `Target: ${m.target_date}`}
                </span>
                {!m.achieved && (
                  <div className="ms-slider-wrap">
                    <input
                      type="range" min="0" max="100" value={m.progress}
                      onChange={e => update(m.id, { progress: parseInt(e.target.value), ...(parseInt(e.target.value) === 100 ? { achieved: true } : {}) })}
                      className="ms-slider"
                    />
                    <span className="ms-pct">{m.progress}%</span>
                  </div>
                )}
              </div>
            </div>
            <button className="ts-del" onClick={() => del(m.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  )
}