import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Management Homepage Component
export function ManagementHomepage({ 
  onLogout, 
  events, 
  eventsLoading,
  onUpdateEvent, 
  onDeleteEvent, 
  onRefreshEvents 
}) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Function to render different sections based on activeSection state
  const renderSection = () => {
    switch (activeSection) {
      case 'reviewSOPs':
        return <ReviewSOPsSection />
      case 'approveBudgets':
        return <ApproveBudgetsSection />
      case 'monitorStatus':
        return <MonitorStatusSection 
          events={events}
          eventsLoading={eventsLoading}
          onUpdateEvent={onUpdateEvent}
          onRefreshEvents={onRefreshEvents}
        />
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
        <h1>Management Dashboard</h1>
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
  // Calculate real statistics from events data
  const pendingEvents = events.filter(event => event.status === 'pending').length
  const approvedEvents = events.filter(event => event.status === 'approved').length
  const liveEvents = events.filter(event => event.status === 'live').length
  const totalEvents = events.length
  
  return (
    <>
      <section className="welcome-section">
        <h2>Welcome, Management Staff!</h2>
        <p>Here you can oversee all campus events, clubs, and activities.</p>
      </section>
      
      <section className="quick-actions">
        <h3>Management Functions</h3>
        <div className="action-buttons">
          <button 
            onClick={() => setActiveSection('reviewSOPs')} 
            className="action-button"
          >
            Review Pending SOPs
          </button>
          <button 
            onClick={() => setActiveSection('approveBudgets')} 
            className="action-button"
          >
            Approve/Reject Budgets
          </button>
          <button 
            onClick={() => setActiveSection('monitorStatus')} 
            className="action-button"
          >
            Monitor Event Status
          </button>
        </div>
      </section>
      
      <section className="management-summary">
        <h3>Management Summary</h3>
        
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Pending Approvals</h4>
            <div className="summary-stat">{eventsLoading ? '...' : pendingEvents}</div>
            <p>Events waiting for approval</p>
          </div>
          
          <div className="summary-card">
            <h4>Approved Events</h4>
            <div className="summary-stat">{eventsLoading ? '...' : approvedEvents}</div>
            <p>Events approved by management</p>
          </div>
          
          <div className="summary-card">
            <h4>Live Events</h4>
            <div className="summary-stat">{eventsLoading ? '...' : liveEvents}</div>
            <p>Currently active events</p>
          </div>
          
          <div className="summary-card">
            <h4>Total Events</h4>
            <div className="summary-stat">{eventsLoading ? '...' : totalEvents}</div>
            <p>All events in the system</p>
          </div>
        </div>
      </section>
    </>
  )
}

// Review SOPs Section
function ReviewSOPsSection() {
  return (
    <div className="section-container">
      <h2>Review Standard Operating Procedures</h2>
      
      <div className="filter-bar">
        <select className="input filter-select">
          <option value="all">All SOPs</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input type="text" className="input search-input" placeholder="Search by event or club..." />
      </div>
      
      <div className="sop-list">
        <div className="sop-item pending">
          <div className="sop-details">
            <h3>Music Festival</h3>
            <div className="sop-meta">
              <span className="sop-club">Music Society</span>
              <span className="sop-date">Submitted: May 15, 2025</span>
            </div>
            <div className="sop-description">
              <p>SOP for annual campus-wide music festival featuring student performances.</p>
            </div>
            <div className="sop-file">
              <span className="file-icon">📄</span>
              <span className="file-name">MusicFestival_SOP.pdf</span>
              <button className="action-button small">View Document</button>
            </div>
          </div>
          <div className="sop-actions">
            <div className="sop-status pending">Pending Review</div>
            <div className="action-buttons">
              <button className="submit-button">Approve</button>
              <button className="cancel-button">Reject</button>
            </div>
            <div className="form-group">
              <label>Notes to President:</label>
              <textarea className="input textarea" placeholder="Add notes for the club president..."></textarea>
            </div>
          </div>
        </div>
        
        <div className="sop-item pending">
          <div className="sop-details">
            <h3>Hackathon 2025</h3>
            <div className="sop-meta">
              <span className="sop-club">Coding Club</span>
              <span className="sop-date">Submitted: May 14, 2025</span>
            </div>
            <div className="sop-description">
              <p>24-hour coding competition for students to showcase their development skills.</p>
            </div>
            <div className="sop-file">
              <span className="file-icon">📄</span>
              <span className="file-name">Hackathon_SOP.pdf</span>
              <button className="action-button small">View Document</button>
            </div>
          </div>
          <div className="sop-actions">
            <div className="sop-status pending">Pending Review</div>
            <div className="action-buttons">
              <button className="submit-button">Approve</button>
              <button className="cancel-button">Reject</button>
            </div>
            <div className="form-group">
              <label>Notes to President:</label>
              <textarea className="input textarea" placeholder="Add notes for the club president..."></textarea>
            </div>
          </div>
        </div>
        
        <div className="sop-item approved">
          <div className="sop-details">
            <h3>Tech Workshop</h3>
            <div className="sop-meta">
              <span className="sop-club">CS Club</span>
              <span className="sop-date">Submitted: May 10, 2025</span>
            </div>
            <div className="sop-description">
              <p>Workshop on web development technologies and tools.</p>
            </div>
            <div className="sop-file">
              <span className="file-icon">📄</span>
              <span className="file-name">TechWorkshop_SOP.pdf</span>
              <button className="action-button small">View Document</button>
            </div>
          </div>
          <div className="sop-actions">
            <div className="sop-status approved">Approved on May 12, 2025</div>
            <div className="approval-notes">
              <strong>Approval Notes:</strong>
              <p>SOP meets all requirements. Approved for implementation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Approve Budgets Section
function ApproveBudgetsSection() {
  return (
    <div className="section-container">
      <h2>Review and Approve Event Budgets</h2>
      
      <div className="filter-bar">
        <select className="input filter-select">
          <option value="all">All Budgets</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input type="text" className="input search-input" placeholder="Search by event or club..." />
      </div>
      
      <div className="budget-list">
        <div className="budget-item pending">
          <div className="budget-header">
            <h3>Tech Workshop</h3>
            <div className="budget-meta">
              <span className="budget-club">CS Club</span>
              <span className="budget-date">Submitted: May 12, 2025</span>
            </div>
          </div>
          
          <div className="budget-details">
            <div className="budget-summary">
              <div className="budget-summary-item">
                <span className="summary-label">Total Requested:</span>
                <span className="summary-value">$1,500.00</span>
              </div>
              <div className="budget-summary-item">
                <span className="summary-label">Budget Status:</span>
                <span className="summary-value pending">Pending Review</span>
              </div>
            </div>
            
            <div className="budget-line-items">
              <h4>Budget Line Items</h4>
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Speaker Fees</td>
                    <td>$500.00</td>
                  </tr>
                  <tr>
                    <td>Equipment Rental</td>
                    <td>$600.00</td>
                  </tr>
                  <tr>
                    <td>Refreshments</td>
                    <td>$250.00</td>
                  </tr>
                  <tr>
                    <td>Marketing Materials</td>
                    <td>$150.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$1,500.00</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="budget-documents">
              <h4>Supporting Documents</h4>
              <div className="document-list">
                <div className="document-item">
                  <span className="file-icon">📄</span>
                  <span className="file-name">Equipment_Quote.pdf</span>
                  <button className="action-button small">View</button>
                </div>
                <div className="document-item">
                  <span className="file-icon">📄</span>
                  <span className="file-name">Speaker_Agreement.pdf</span>
                  <button className="action-button small">View</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="budget-actions">
            <div className="form-group">
              <label>Adjustment Notes:</label>
              <textarea className="input textarea" placeholder="Add notes about any budget adjustments..."></textarea>
            </div>
            <div className="action-buttons">
              <button className="submit-button">Approve Budget</button>
              <button className="action-button">Request Revisions</button>
              <button className="cancel-button">Reject Budget</button>
            </div>
          </div>
        </div>
        
        <div className="budget-item pending">
          <div className="budget-header">
            <h3>Music Festival</h3>
            <div className="budget-meta">
              <span className="budget-club">Music Society</span>
              <span className="budget-date">Submitted: May 16, 2025</span>
            </div>
          </div>
          
          <div className="budget-details">
            <div className="budget-summary">
              <div className="budget-summary-item">
                <span className="summary-label">Total Requested:</span>
                <span className="summary-value">$3,500.00</span>
              </div>
              <div className="budget-summary-item">
                <span className="summary-label">Budget Status:</span>
                <span className="summary-value pending">Pending Review</span>
              </div>
            </div>
            
            <div className="budget-line-items">
              <h4>Budget Line Items</h4>
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sound Equipment</td>
                    <td>$1,200.00</td>
                  </tr>
                  <tr>
                    <td>Stage Setup</td>
                    <td>$800.00</td>
                  </tr>
                  <tr>
                    <td>Lighting</td>
                    <td>$650.00</td>
                  </tr>
                  <tr>
                    <td>Marketing</td>
                    <td>$350.00</td>
                  </tr>
                  <tr>
                    <td>Miscellaneous</td>
                    <td>$500.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>$3,500.00</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="budget-actions">
            <div className="form-group">
              <label>Adjustment Notes:</label>
              <textarea className="input textarea" placeholder="Add notes about any budget adjustments..."></textarea>
            </div>
            <div className="action-buttons">
              <button className="submit-button">Approve Budget</button>
              <button className="action-button">Request Revisions</button>
              <button className="cancel-button">Reject Budget</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Monitor Status Section
function MonitorStatusSection({ events, eventsLoading, onUpdateEvent, onRefreshEvents }) {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter events based on status and search term
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.club.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Handle event approval
  const handleApproveEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        alert('Event approved successfully!')
        onRefreshEvents() // Refresh the events list
      } else {
        const data = await response.json()
        alert(`Failed to approve event: ${data.message}`)
      }
    } catch (error) {
      console.error('Error approving event:', error)
      alert('Error approving event. Please try again.')
    }
  }

  // Handle event rejection
  const handleRejectEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        alert('Event rejected successfully!')
        onRefreshEvents() // Refresh the events list
      } else {
        const data = await response.json()
        alert(`Failed to reject event: ${data.message}`)
      }
    } catch (error) {
      console.error('Error rejecting event:', error)
      alert('Error rejecting event. Please try again.')
    }
  }

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'approved': return 'approved'
      case 'live': return 'active'
      case 'completed': return 'completed'
      case 'cancelled': return 'rejected'
      default: return 'pending'
    }
  }

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending Approval'
      case 'approved': return 'Approved'
      case 'live': return 'Registration Open'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Rejected'
      default: return 'Unknown'
    }
  }

  return (
    <div className="section-container">
      <h2>Monitor Event Status</h2>
      
      <div className="filter-bar">
        <select 
          className="input filter-select" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Events</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="live">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Rejected</option>
        </select>
        <input 
          type="text" 
          className="input search-input" 
          placeholder="Search events..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {eventsLoading ? (
        <div className="loading-message">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="no-events-message">No events found matching your criteria.</div>
      ) : (
        <div className="event-status-grid">
          {filteredEvents.map(event => (
            <div key={event._id} className={`event-status-card ${getStatusBadgeClass(event.status)}`}>
              <div className="event-status-header">
                <h3>{event.title}</h3>
                <div className="event-date">
                  {new Date(event.startDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="event-organizer">{event.club}</div>
              
              <div className="event-details">
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Capacity:</strong> {event.capacity} attendees</p>
                <p><strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}</p>
              </div>
              
              <div className="approval-progress">
                <div className="progress-item completed">
                  <div className="progress-icon">✓</div>
                  <div className="progress-label">Event Created</div>
                </div>
                <div className={`progress-item ${event.status !== 'idea' ? 'completed' : 'pending'}`}>
                  <div className="progress-icon">{event.status !== 'idea' ? '✓' : '○'}</div>
                  <div className="progress-label">Management Review</div>
                </div>
                <div className={`progress-item ${['approved', 'live', 'completed'].includes(event.status) ? 'completed' : 'pending'}`}>
                  <div className="progress-icon">{['approved', 'live', 'completed'].includes(event.status) ? '✓' : '○'}</div>
                  <div className="progress-label">Approval</div>
                </div>
                <div className={`progress-item ${event.status === 'live' ? 'completed' : 'pending'}`}>
                  <div className="progress-icon">{event.status === 'live' ? '✓' : '○'}</div>
                  <div className="progress-label">Live</div>
                </div>
              </div>
              
              {event.status === 'pending' && (
                <div className="event-approval-actions">
                  <button 
                    className="submit-button"
                    onClick={() => handleApproveEvent(event._id)}
                  >
                    Approve Event
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => handleRejectEvent(event._id)}
                  >
                    Reject Event
                  </button>
                </div>
              )}
              
              <div className="event-status-actions">
                <button className="action-button">View Details</button>
                <div className={`event-status-badge ${getStatusBadgeClass(event.status)}`}>
                  {getStatusText(event.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 