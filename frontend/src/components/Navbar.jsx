import { Link, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, CheckSquare, Activity, Flag } from 'lucide-react'
import './Navbar.css'

function Navbar({ user, setAuth, setUser }) {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuth(false)
    setUser(null)
  }

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { path: '/progress', icon: <Activity size={20} />, label: 'Progress' },
    { path: '/milestones', icon: <Flag size={20} />, label: 'Milestones' },
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <CheckSquare className="nav-logo" />
          <span>TaskFlow</span>
        </div>
        
        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="user-name">{user?.username}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar