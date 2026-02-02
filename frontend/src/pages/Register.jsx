import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'
import '../styles/Register.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/auth/register', formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      navigate('/')
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => {
                handleChange(e)
                if (validationErrors.username) {
                  setValidationErrors({ ...validationErrors, username: '' })
                }
              }}
              className={validationErrors.username ? 'error-input' : ''}
              minLength={3}
              required
            />
            {validationErrors.username && <span className="field-error">{validationErrors.username}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => {
                handleChange(e)
                if (validationErrors.email) {
                  setValidationErrors({ ...validationErrors, email: '' })
                }
              }}
              className={validationErrors.email ? 'error-input' : ''}
              required
            />
            {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleChange(e)
                if (validationErrors.password) {
                  setValidationErrors({ ...validationErrors, password: '' })
                }
                if (validationErrors.confirmPassword && formData.confirmPassword) {
                  setValidationErrors({ ...validationErrors, confirmPassword: '' })
                }
              }}
              className={validationErrors.password ? 'error-input' : ''}
              minLength={6}
              required
            />
            {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => {
                handleChange(e)
                if (validationErrors.confirmPassword) {
                  setValidationErrors({ ...validationErrors, confirmPassword: '' })
                }
              }}
              className={validationErrors.confirmPassword ? 'error-input' : ''}
              required
            />
            {validationErrors.confirmPassword && <span className="field-error">{validationErrors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  )
}

export default Register
