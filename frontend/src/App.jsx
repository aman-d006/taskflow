import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import DailyProgress from './components/DailyProgress'
import Milestones from './components/Milestones'
import Navbar from './components/Navbar'
import { authAPI } from './api'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getMe()
        .then(response => {
          setUser(response.data)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="app">
      {isAuthenticated && <Navbar user={user} setAuth={setIsAuthenticated} setUser={setUser} />}
      <main className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Dashboard /> : <Landing />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} setUser={setUser} />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <Register setAuth={setIsAuthenticated} setUser={setUser} />} 
          />
          {isAuthenticated && (
            <>
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/progress" element={<DailyProgress />} />
              <Route path="/milestones" element={<Milestones />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

export default App