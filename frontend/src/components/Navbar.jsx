import { Link, useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📝 BlogHub
        </Link>

        <div className="navbar-menu">
          <div className="left-group">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/" className="nav-link">Explore</Link>
          </div>

          <div className="right-group">
            <ThemeToggle />

            {token ? (
              <>
                <Link to="/create" className="nav-link btn-create">
                  ✍️ Create
                </Link>

                <div className="user-menu">
                  <span className="user-name">👤 {user.username}</span>
                  <button onClick={handleLogout} className="nav-link btn-logout">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link btn-register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
