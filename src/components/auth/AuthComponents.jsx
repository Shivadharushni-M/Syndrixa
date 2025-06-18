import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../../utils/auth'
import './AuthComponents.css'

// Login Page Component
export const LoginPage = ({ onLoginSuccess }) => {
  const [step, setStep] = useState('credentials')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Attempting to login with email:', formData.email)
    console.log('API URL:', '/api/users/login')

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      console.log('Login response status:', response.status)
      console.log('Login response headers:', response.headers)

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        if (response.status === 404) {
          throw new Error('Cannot connect to server. Please check if both frontend and backend servers are running.')
        } else {
          throw new Error(`Server error (${response.status}). Please try again.`)
        }
      }

      console.log('Login response data:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.data.requiresOTP) {
        setStep('otp')
      } else {
        setAuthToken(data.data.token)
        console.log('Token stored:', data.data.token ? data.data.token.substring(0, 20) + '...' : 'No token')
        onLoginSuccess(data.data.user, data.data.user.role)
        navigate('/')
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check if the server is running.')
      } else if (error.message.includes('Failed to fetch')) {
        setError('Connection failed: Please check your internet connection and try again.')
      } else {
        setError(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('Submitting OTP:', formData.otp)
    console.log('OTP length:', formData.otp.length)
    console.log('OTP type:', typeof formData.otp)

    try {
      const response = await fetch('/api/users/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      })

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        if (response.status === 404) {
          throw new Error('Cannot connect to server. Please check if both frontend and backend servers are running.')
        } else {
          throw new Error(`Server error (${response.status}). Please try again.`)
        }
      }

      console.log('OTP verification response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed')
      }

      setAuthToken(data.data.token)
      console.log('Token stored:', data.data.token ? data.data.token.substring(0, 20) + '...' : 'No token')
      onLoginSuccess(data.data.user, data.data.user.role)

      // Redirect based on role
      switch (data.data.user.role) {
        case 'student':
          navigate('/student-homepage')
          break
        case 'president':
          navigate('/president-homepage')
          break
        case 'management':
          navigate('/management-homepage')
          break
        default:
          navigate('/')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Syndrixa</h2>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="auth-divider">
              <span>or</span>
            </div>
            
            <button 
              type="button" 
              className="signup-button" 
              onClick={() => navigate('/signup')}
              disabled={loading}
            >
              Create New Account
            </button>
            
            <div className="auth-footer">
              <p>Don't have an account? <button type="button" className="link-button" onClick={() => navigate('/signup')}>Sign up here</button></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="auth-form">
            <div className="otp-info">
              <p>We've sent a 6-digit OTP to your email</p>
              <p className="email-display">{formData.email}</p>
            </div>
            <div className="form-group">
              <label>Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="form-input otp-input"
                autoComplete="one-time-code"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              className="back-button" 
              onClick={() => setStep('credentials')}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// Signup Page Component
export const SignupPage = ({ onLoginSuccess }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'student',
    otp: ''
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    console.log('Attempting to send OTP to:', formData.email)
    console.log('API URL:', '/api/users/send-otp')

    try {
      const response = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        if (response.status === 404) {
          throw new Error('Cannot connect to server. Please check if both frontend and backend servers are running.')
        } else {
          throw new Error(`Server error (${response.status}). Please try again.`)
        }
      }

      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      setMessage('OTP sent to your email')
      setStep(2)
    } catch (error) {
      console.error('Send OTP error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error: Unable to connect to server. Please check if the server is running.')
      } else if (error.message.includes('Failed to fetch')) {
        setError('Connection failed: Please check your internet connection and try again.')
      } else {
        setError(error.message || 'Failed to send OTP. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate all required fields
    if (!formData.name.trim()) {
      setError('Please enter your full name')
      setLoading(false)
      return
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      setLoading(false)
      return
    }

    console.log('Submitting registration OTP:', formData.otp)
    console.log('Registration OTP length:', formData.otp.length)
    console.log('Full form data:', formData)

    try {
      const response = await fetch('/api/users/verify-otp-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Registration response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setAuthToken(data.data.token)
      console.log('Token stored:', data.data.token ? data.data.token.substring(0, 20) + '...' : 'No token')
      onLoginSuccess(data.data.user, data.data.user.role)

      // Show success message
      alert(`Welcome to Eventra, ${data.data.user.name}! Your account has been created successfully.`)

      // Redirect based on role
      switch (data.data.user.role) {
        case 'student':
          navigate('/student-homepage')
          break
        case 'president':
          navigate('/president-homepage')
          break
        case 'management':
          navigate('/management-homepage')
          break
        default:
          navigate('/')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Syndrixa</h2>
          <p>Join Syndrixa today</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="auth-form">
            <div className="otp-info">
              <p>We've sent a 6-digit OTP to your email</p>
              <p className="email-display">{formData.email}</p>
            </div>
            
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                required
                minLength={6}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required className="form-input">
                <option value="student">Student</option>
                <option value="president">President</option>
                <option value="management">Management</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="form-input otp-input"
                autoComplete="one-time-code"
              />
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <button 
              type="button" 
              className="back-button" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back to Email
            </button>
          </form>
        )}
        
        <div className="auth-footer">
          <p>Already have an account? <button type="button" className="link-button" onClick={() => navigate('/')}>Sign in here</button></p>
        </div>
      </div>
    </div>
  )
} 