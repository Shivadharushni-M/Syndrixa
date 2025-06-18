import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// President Homepage Component
export function PresidentHomepage({ 
  onLogout, 
  events, 
  eventsLoading,
  onCreateEvent, 
  onUpdateEvent, 
  onDeleteEvent, 
  onRefreshEvents 
}) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Function to render different sections based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'createEvent':
        return <CreateEventSection 
          onCreateEvent={onCreateEvent}
          onRefreshEvents={onRefreshEvents}
        />
      case 'uploadSOP':
        return <UploadSOPSection />
      case 'assignRoles':
        return <AssignRolesSection />
      case 'submitBudget':
        return <SubmitBudgetSection />
      case 'trackApproval':
        return <TrackApprovalSection events={events} eventsLoading={eventsLoading} />
      case 'publishEvent':
        return <PublishEventSection />
      case 'monitorAttendance':
        return <MonitorAttendanceSection />
      default:
        return <DashboardSection 
          setActiveSection={setActiveSection} 
          events={events}
          eventsLoading={eventsLoading}
        />
    }
  }
  
  return (
    <div className="homepage-container">
      <header className="header">
        <h1>President Dashboard</h1>
        <nav className="nav">
          <button 
            onClick={() => setActiveSection('dashboard')} 
            className={`nav-button ${activeSection === 'dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </button>
          <button onClick={onLogout} className="nav-button logout">
            Logout
          </button>
        </nav>
      </header>
      
      <main className="main-content">
        {renderSection()}
      </main>
      
      <footer className="footer">
        <p>© 2025 Eventra - Your Campus Event Management System</p>
      </footer>
    </div>
  )
}

// Dashboard Section Component
function DashboardSection({ setActiveSection, events, eventsLoading }) {
  // Filter events created by the current president (assuming they're all created by the current user)
  const presidentEvents = events.filter(event => event.status === 'idea' || event.status === 'pending' || event.status === 'approved')
  
  return (
    <>
      <section className="welcome-section">
        <h2>Welcome, Club President!</h2>
        <p>Here you can manage your club's events and track participation.</p>
      </section>
      
      <section className="quick-actions">
        <h3>President Functions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => setActiveSection('createEvent')} 
            className="action-button"
          >
            Create Event
          </button>
          <button 
            onClick={() => setActiveSection('uploadSOP')} 
            className="action-button"
          >
            Upload SOP
          </button>
          <button 
            onClick={() => setActiveSection('assignRoles')} 
            className="action-button"
          >
            Assign Roles
          </button>
          <button 
            onClick={() => setActiveSection('submitBudget')} 
            className="action-button"
          >
            Submit Budget
          </button>
          <button 
            onClick={() => setActiveSection('trackApproval')} 
            className="action-button"
          >
            Track Approval
          </button>
          <button 
            onClick={() => setActiveSection('publishEvent')} 
            className="action-button"
          >
            Publish Event
          </button>
          <button 
            onClick={() => setActiveSection('monitorAttendance')} 
            className="action-button"
          >
            Monitor Attendance
          </button>
        </div>
      </section>
      
      <section className="upcoming-events">
        <h3>Your Club's Events</h3>
        <div className="events-list">
          {eventsLoading ? (
            <div className="loading-message">
              <p>Loading events...</p>
            </div>
          ) : presidentEvents.length > 0 ? (
            <div className="events-grid">
              {presidentEvents.map(event => (
                <div key={event.id || event._id} className="event-card">
                  <h3>{event.title}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${event.status}`}>{event.status}</span></p>
                  <div className="event-actions">
                    <button className="event-button">View Details</button>
                    <button className="event-button secondary">Edit Event</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No events created yet. Click "Create Event" to get started!</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

// Create Event Section
function CreateEventSection({ onCreateEvent, onRefreshEvents }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    club: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: '',
    registrationDeadline: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      })
    }
  }
  
  const validateForm = () => {
    const errors = {}
    if (!formData.title) errors.title = 'Title is required'
    if (!formData.description) errors.description = 'Description is required'
    if (!formData.club) errors.club = 'Club is required'
    if (!formData.startDate) errors.startDate = 'Start date is required'
    if (!formData.endDate) errors.endDate = 'End date is required'
    if (!formData.location) errors.location = 'Location is required'
    if (!formData.capacity) errors.capacity = 'Capacity is required'
    if (!formData.registrationDeadline) errors.registrationDeadline = 'Registration deadline is required'
    
    // Validate dates
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = 'End date must be after start date'
    }
    
    if (formData.registrationDeadline && formData.startDate && new Date(formData.registrationDeadline) >= new Date(formData.startDate)) {
      errors.registrationDeadline = 'Registration deadline must be before event start date'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onCreateEvent({
        ...formData,
        capacity: parseInt(formData.capacity)
      })
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        club: '',
        startDate: '',
        endDate: '',
        location: '',
        capacity: '',
        registrationDeadline: ''
      })
      setFormErrors({})
      
      // Refresh events list
      await onRefreshEvents()
      
      alert('Event created successfully!')
    } catch (error) {
      alert('Failed to create event: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="section-container">
      <h2>Create New Event</h2>
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input 
                type="text" 
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`input ${formErrors.title ? 'error' : ''}`}
                placeholder="Enter event title" 
                required 
              />
              {formErrors.title && <span className="error-message">{formErrors.title}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="club">Club/Organization *</label>
              <input 
                type="text" 
                id="club"
                name="club"
                value={formData.club}
                onChange={handleInputChange}
                className={`input ${formErrors.club ? 'error' : ''}`}
                placeholder="Enter club name" 
                required 
              />
              {formErrors.club && <span className="error-message">{formErrors.club}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Event Description *</label>
            <textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`input textarea ${formErrors.description ? 'error' : ''}`}
              placeholder="Describe your event..." 
              rows="4" 
              required 
            ></textarea>
            {formErrors.description && <span className="error-message">{formErrors.description}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date & Time *</label>
              <input 
                type="datetime-local" 
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`input ${formErrors.startDate ? 'error' : ''}`}
                required 
              />
              {formErrors.startDate && <span className="error-message">{formErrors.startDate}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date & Time *</label>
              <input 
                type="datetime-local" 
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`input ${formErrors.endDate ? 'error' : ''}`}
                required 
              />
              {formErrors.endDate && <span className="error-message">{formErrors.endDate}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Event Location *</label>
              <input 
                type="text" 
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`input ${formErrors.location ? 'error' : ''}`}
                placeholder="Enter event location" 
                required 
              />
              {formErrors.location && <span className="error-message">{formErrors.location}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="capacity">Event Capacity *</label>
              <input 
                type="number" 
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`input ${formErrors.capacity ? 'error' : ''}`}
                placeholder="Enter capacity" 
                min="1"
                required 
              />
              {formErrors.capacity && <span className="error-message">{formErrors.capacity}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="registrationDeadline">Registration Deadline *</label>
            <input 
              type="datetime-local" 
              id="registrationDeadline"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
              className={`input ${formErrors.registrationDeadline ? 'error' : ''}`}
              required 
            />
            {formErrors.registrationDeadline && <span className="error-message">{formErrors.registrationDeadline}</span>}
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Upload SOP Section
function UploadSOPSection() {
  return (
    <div className="section-container">
      <h2>Upload Standard Operating Procedure</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="eventSelect">Select Event</label>
            <select id="eventSelect" className="input" required>
              <option value="">Select an event</option>
              <option value="1">Tech Workshop</option>
              <option value="2">Music Festival</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="sopFile">SOP Document</label>
            <input 
              type="file" 
              id="sopFile" 
              className="input" 
              required 
            />
            <small>Upload a PDF or DOC file with your event's SOP</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="sopNotes">Additional Notes</label>
            <textarea 
              id="sopNotes" 
              className="input textarea" 
              placeholder="Any additional information or notes..." 
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Upload SOP</button>
        </form>
      </div>
    </div>
  )
}

// Assign Roles Section
function AssignRolesSection() {
  return (
    <div className="section-container">
      <h2>Assign Roles for Event</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="roleEventSelect">Select Event</label>
            <select id="roleEventSelect" className="input" required>
              <option value="">Select an event</option>
              <option value="1">Tech Workshop</option>
              <option value="2">Music Festival</option>
            </select>
          </div>
          
          <div className="role-assignment-container">
            <h3>Team Members</h3>
            
            <div className="role-item">
              <div className="role-name">Event Coordinator</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
            
            <div className="role-item">
              <div className="role-name">Registration Manager</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
            
            <div className="role-item">
              <div className="role-name">Technical Support</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
            
            <div className="role-item">
              <div className="role-name">Marketing</div>
              <select className="input role-select">
                <option value="">Assign a member</option>
                <option value="member1">John Smith</option>
                <option value="member2">Sarah Johnson</option>
                <option value="member3">Michael Chen</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="submit-button">Save Role Assignments</button>
        </form>
      </div>
    </div>
  )
}

// Submit Budget Section
function SubmitBudgetSection() {
  return (
    <div className="section-container">
      <h2>Submit Event Budget</h2>
      <div className="form-wrapper">
        <form className="form">
          <div className="form-group">
            <label htmlFor="budgetEventSelect">Select Event</label>
            <select id="budgetEventSelect" className="input" required>
              <option value="">Select an event</option>
              <option value="1">Tech Workshop</option>
              <option value="2">Music Festival</option>
            </select>
          </div>
          
          <div className="budget-items-container">
            <h3>Budget Items</h3>
            
            <div className="budget-item">
              <input type="text" className="input" placeholder="Item name" />
              <input type="number" className="input" placeholder="Amount" min="0" step="0.01" />
            </div>
            
            <div className="budget-item">
              <input type="text" className="input" placeholder="Item name" />
              <input type="number" className="input" placeholder="Amount" min="0" step="0.01" />
            </div>
            
            <div className="budget-item">
              <input type="text" className="input" placeholder="Item name" />
              <input type="number" className="input" placeholder="Amount" min="0" step="0.01" />
            </div>
            
            <button type="button" className="action-button">+ Add More Items</button>
          </div>
          
          <div className="form-group">
            <label htmlFor="budgetFile">Supporting Documents</label>
            <input 
              type="file" 
              id="budgetFile" 
              className="input" 
            />
            <small>Upload any supporting documents or quotes (optional)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="budgetNotes">Additional Notes</label>
            <textarea 
              id="budgetNotes" 
              className="input textarea" 
              placeholder="Any additional notes about the budget..." 
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-button">Submit Budget for Approval</button>
        </form>
      </div>
    </div>
  )
}

// Track Approval Section
function TrackApprovalSection({ events, eventsLoading }) {
  // Filter events that are pending or approved (events created by president)
  const presidentEvents = events.filter(event => 
    ['pending', 'approved', 'cancelled'].includes(event.status)
  )

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Approval'
      case 'approved': return 'Approved'
      case 'cancelled': return 'Rejected'
      default: return 'Unknown'
    }
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'approved': return 'approved'
      case 'cancelled': return 'rejected'
      default: return 'pending'
    }
  }

  return (
    <div className="section-container">
      <h2>Track Event Approvals</h2>
      
      {eventsLoading ? (
        <div className="loading-message">
          <p>Loading events...</p>
        </div>
      ) : presidentEvents.length === 0 ? (
        <div className="no-events-message">
          <p>No events submitted for approval yet.</p>
        </div>
      ) : (
        <div className="approval-status-container">
          {presidentEvents.map(event => (
            <div key={event._id} className="approval-card">
              <h3>{event.title}</h3>
              <div className="approval-info">
                <div className="approval-item">
                  <span className="approval-label">Event Status:</span>
                  <span className={`approval-status ${getStatusBadgeClass(event.status)}`}>
                    {getStatusText(event.status)}
                  </span>
                </div>
                <div className="approval-item">
                  <span className="approval-label">Club:</span>
                  <span className="approval-value">{event.club}</span>
                </div>
                <div className="approval-item">
                  <span className="approval-label">Date:</span>
                  <span className="approval-value">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="approval-item">
                  <span className="approval-label">Location:</span>
                  <span className="approval-value">{event.location}</span>
                </div>
                <div className="approval-item">
                  <span className="approval-label">Capacity:</span>
                  <span className="approval-value">{event.capacity} attendees</span>
                </div>
                <div className="approval-item">
                  <span className="approval-label">Submitted:</span>
                  <span className="approval-date">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {event.status === 'cancelled' && (
                <div className="approval-notes">
                  <strong>Management Notes:</strong>
                  <p>Event was rejected by management. Please review and resubmit with necessary changes.</p>
                </div>
              )}
              
              {event.status === 'approved' && (
                <div className="approval-notes">
                  <strong>Management Notes:</strong>
                  <p>Event has been approved! You can now publish it for student registration.</p>
                </div>
              )}
              
              {event.status === 'pending' && (
                <div className="approval-notes">
                  <strong>Management Notes:</strong>
                  <p>Event is currently under review by management. You will be notified once a decision is made.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Publish Event Section
function PublishEventSection() {
  return (
    <div className="section-container">
      <h2>Publish Events</h2>
      
      <div className="publishable-events-container">
        <div className="publishable-event">
          <h3>Tech Workshop</h3>
          <div className="event-status">
            <span className="status-label">Approval Status:</span>
            <span className="status-value pending">Pending Approval</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">SOP:</span>
            <span className="status-value completed">Completed</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Roles:</span>
            <span className="status-value completed">Assigned</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Budget:</span>
            <span className="status-value pending">Pending</span>
          </div>
          <button className="action-button" disabled>Publish (Awaiting Approval)</button>
        </div>
        
        <div className="publishable-event">
          <h3>Music Festival</h3>
          <div className="event-status">
            <span className="status-label">Approval Status:</span>
            <span className="status-value approved">Approved</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">SOP:</span>
            <span className="status-value completed">Completed</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Roles:</span>
            <span className="status-value completed">Assigned</span>
          </div>
          <div className="event-ready-status">
            <span className="status-label">Budget:</span>
            <span className="status-value completed">Approved</span>
          </div>
          <button className="submit-button">Publish Event</button>
        </div>
      </div>
    </div>
  )
}

// Monitor Attendance Section
function MonitorAttendanceSection() {
  return (
    <div className="section-container">
      <h2>Monitor Event Attendance</h2>
      
      <div className="event-selection">
        <label htmlFor="attendanceEventSelect">Select Event:</label>
        <select id="attendanceEventSelect" className="input">
          <option value="1">Tech Workshop</option>
          <option value="2">Music Festival</option>
        </select>
      </div>
      
      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-title">Registered</div>
          <div className="stat-value">45</div>
          <div className="stat-description">Total registrations</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Check-ins</div>
          <div className="stat-value">38</div>
          <div className="stat-description">Attendees who checked in</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">No-shows</div>
          <div className="stat-value">7</div>
          <div className="stat-description">Registered but didn't attend</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Attendance Rate</div>
          <div className="stat-value">84%</div>
          <div className="stat-description">Percentage who attended</div>
        </div>
      </div>
      
      <div className="attendance-list">
        <h3>Attendee List</h3>
        <div className="list-controls">
          <input type="text" className="input search-input" placeholder="Search attendees..." />
          <select className="input filter-select">
            <option value="all">All</option>
            <option value="checked-in">Checked In</option>
            <option value="not-checked-in">Not Checked In</option>
          </select>
        </div>
        
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Course</th>
              <th>Check-in Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Smith</td>
              <td>R12345</td>
              <td>Computer Science</td>
              <td>2:15 PM</td>
              <td><span className="status-badge checked-in">Checked In</span></td>
            </tr>
            <tr>
              <td>Emma Wilson</td>
              <td>R67890</td>
              <td>Electrical Engineering</td>
              <td>2:05 PM</td>
              <td><span className="status-badge checked-in">Checked In</span></td>
            </tr>
            <tr>
              <td>Michael Chen</td>
              <td>R24680</td>
              <td>Business Administration</td>
              <td>-</td>
              <td><span className="status-badge not-checked-in">Not Checked In</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
} 