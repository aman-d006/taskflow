import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckSquare, Target, TrendingUp, Zap, ArrowRight, 
  Calendar, Play, ChevronRight, Sparkles,
  LayoutDashboard, BarChart3, Shield
} from 'lucide-react'
import './Landing.css'

function Landing() {
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    {
      icon: <CheckSquare size={24} />,
      title: "Smart Task Management",
      description: "Organize tasks with intelligent prioritization, deadline tracking, and seamless categorization",
      color: "#4f46e5",
      gradient: "linear-gradient(135deg, #4f46e5, #6366f1)"
    },
    {
      icon: <Target size={24} />,
      title: "Goal Achievement",
      description: "Set ambitious milestones, track progress visually, and celebrate every achievement",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #34d399)"
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Productivity Analytics",
      description: "Gain deep insights into your workflow patterns and optimize your daily performance",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)"
    },
    {
      icon: <Zap size={24} />,
      title: "Daily Momentum",
      description: "Build unstoppable habits with daily check-ins and streak tracking that motivates",
      color: "#ef4444",
      gradient: "linear-gradient(135deg, #ef4444, #f87171)"
    }
  ]

  const workflow = [
    { step: "01", title: "Create Tasks", desc: "Capture everything you need to accomplish" },
    { step: "02", title: "Track Daily", desc: "Mark progress and maintain momentum" },
    { step: "03", title: "Hit Milestones", desc: "Achieve goals and celebrate wins" }
  ]

  return (
    <div className="landing">
      <div className="gradient-bg"></div>
      <div className="mouse-glow" style={{
        left: mousePosition.x - 150,
        top: mousePosition.y - 150
      }}></div>

      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-icon">
              <CheckSquare size={20} />
            </div>
            <span className="brand-text">TaskFlow</span>
          </div>
          <div className="nav-actions">
            <button onClick={() => navigate('/login')} className="nav-btn-text">
              Sign in
            </button>
            <button onClick={() => navigate('/register')} className="nav-btn-primary">
              Get started free
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      <section className={`hero ${isVisible ? 'visible' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge" onClick={() => navigate('/register')}>
            <Sparkles size={14} />
            <span>Start your productivity journey</span>
            <ChevronRight size={14} />
          </div>
          
          <h1 className="hero-title">
            Manage tasks.
            <br />
            <span className="gradient-text">Achieve more.</span>
          </h1>
          
          <p className="hero-description">
            A beautifully designed task manager that helps you stay organized, 
            track progress, and accomplish your goals with clarity and purpose.
          </p>
          
          <div className="hero-actions">
            <button onClick={() => navigate('/register')} className="hero-primary-btn">
              Start for free
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="hero-secondary-btn"
            >
              View live demo
              <Play size={16} />
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-avatars">
              <div className="trust-avatar" style={{ background: '#4f46e5' }}>J</div>
              <div className="trust-avatar" style={{ background: '#10b981' }}>M</div>
              <div className="trust-avatar" style={{ background: '#f59e0b' }}>S</div>
              <div className="trust-avatar" style={{ background: '#ef4444' }}>A</div>
              <div className="trust-more">+</div>
            </div>
            <p className="trust-text">
              <span className="trust-highlight">Join thousands</span> of productive teams and individuals
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="preview-title">Daily Overview</div>
            </div>
            <div className="preview-content">
              <div className="preview-stat">
                <div className="preview-stat-icon" style={{ background: '#4f46e520', color: '#4f46e5' }}>
                  <CheckSquare size={18} />
                </div>
                <div className="preview-stat-info">
                  <span className="preview-stat-value">12</span>
                  <span className="preview-stat-label">Active Tasks</span>
                </div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-icon" style={{ background: '#10b98120', color: '#10b981' }}>
                  <Target size={18} />
                </div>
                <div className="preview-stat-info">
                  <span className="preview-stat-value">85%</span>
                  <span className="preview-stat-label">Completion</span>
                </div>
              </div>
              <div className="preview-stat">
                <div className="preview-stat-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                  <Zap size={18} />
                </div>
                <div className="preview-stat-info">
                  <span className="preview-stat-value">7</span>
                  <span className="preview-stat-label">Day Streak</span>
                </div>
              </div>
            </div>
            <div className="preview-tasks">
              <div className="preview-task done">
                <div className="task-check checked"></div>
                <span>Design system updates</span>
              </div>
              <div className="preview-task">
                <div className="task-check"></div>
                <span>Sprint planning</span>
              </div>
              <div className="preview-task">
                <div className="task-check"></div>
                <span>Code review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-section">
        <div className="workflow-container">
          <h2 className="section-label">HOW IT WORKS</h2>
          <h3 className="section-title">Three steps to productivity mastery</h3>
          <div className="workflow-steps">
            {workflow.map((step, index) => (
              <div key={index} className="workflow-step">
                <div className="step-number">{step.step}</div>
                <div className="step-line"></div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <h2 className="section-label">FEATURES</h2>
          <h3 className="section-title">Everything you need, nothing you don't</h3>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="feature-icon-wrapper" style={{ background: feature.gradient }}>
                  {feature.icon}
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
                <button 
                  className="feature-action"
                  onClick={() => navigate('/register')}
                >
                  Try it now
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial-section">
        <div className="testimonial-container">
          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="quote-text">
              TaskFlow transformed how our team manages projects. The daily progress tracking 
              keeps everyone accountable and motivated.
            </p>
            <div className="quote-author">
              <div className="author-avatar" style={{ background: '#4f46e5' }}>AK</div>
              <div className="author-info">
                <span className="author-name">Alex Kim</span>
                <span className="author-role">Product Manager</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bottom-cta">
        <div className="bottom-cta-container">
          <div className="cta-card">
            <h2>Ready to transform your workflow?</h2>
            <p>Start managing tasks with clarity and purpose. No credit card required.</p>
            <div className="cta-card-actions">
              <button onClick={() => navigate('/register')} className="cta-card-primary">
                Create free account
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login')} className="cta-card-secondary">
                Sign in to existing account
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <CheckSquare size={18} />
            <span>TaskFlow</span>
          </div>
          <p className="footer-copyright">
            Built with purpose. © 2024 TaskFlow.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing