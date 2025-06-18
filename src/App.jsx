import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/main.css'

// Import components from their respective files
import { LoginPage, SignupPage } from './components/auth/AuthComponents'
import { 
  StudentHomepage, 
  DiscoverEvents, 
  EventDetails, 
  RegisterEvent, 
  MyRegistrations,
  SubmitFeedback 
} from './components/student/StudentComponents'
import { PresidentHomepage } from './components/president/PresidentComponents'
import { ManagementHomepage } from './components/management/ManagementComponents'

// Main App Component with Routes
function App() {
  // Using state to track if user is logged in and their role
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('')
  // Added user state to store user information
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    email: '',
    registrations: []
  })
  
  // Store all events in the app state - now fetched from MongoDB
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)

  // Function to fetch events from MongoDB
  const fetchEvents = async () => {
    try {
      setEventsLoading(true)
      console.log('Fetching events from MongoDB...')
      console.log('Current user state:', { loggedIn, userRole, currentUser })
      
      const token = localStorage.getItem('auth_token')
      console.log('Token exists:', !!token)
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token')
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
        console.log('Added Authorization header')
      } else {
        console.log('No token available, making request without Authorization header')
      }
      
      console.log('Request headers:', headers)
      
      const response = await fetch('/api/events', {
        method: 'GET',
        headers: headers
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (response.ok) {
        let data
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError)
          throw new Error('Server returned invalid response format')
        }
        
        console.log('Fetched events:', data.data)
        
        // Transform MongoDB events to match frontend format
        const transformedEvents = data.data.map(event => ({
          id: event._id,
          title: event.title,
          date: new Date(event.startDate).toLocaleDateString(),
          time: `${new Date(event.startDate).toLocaleTimeString()} - ${new Date(event.endDate).toLocaleTimeString()}`,
          location: event.location,
          organizer: event.club,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          capacity: event.capacity,
          registrationDeadline: event.registrationDeadline,
          status: event.status,
          createdBy: event.createdBy,
          attendees: [],
          _id: event._id
        }))
        
        setEvents(transformedEvents)
        console.log('Events loaded successfully:', transformedEvents.length)
      } else {
        let errorText
        try {
          errorText = await response.text()
        } catch (e) {
          errorText = 'Unknown error'
        }
        console.error('Failed to fetch events:', response.status, errorText)
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  // Function to create a new event
  const createEvent = async (eventData) => {
    try {
      console.log('Creating new event:', eventData)
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Event created successfully:', data)
        
        // Refresh events list
        await fetchEvents()
        
        return data.data
      } else {
        console.error('Failed to create event:', response.status)
        throw new Error('Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  // Function to update an event
  const updateEvent = async (eventId, eventData) => {
    try {
      console.log('Updating event:', eventId, eventData)
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Event updated successfully:', data)
        
        // Refresh events list
        await fetchEvents()
        
        return data.data
      } else {
        console.error('Failed to update event:', response.status)
        throw new Error('Failed to update event')
      }
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  // Function to delete an event
  const deleteEvent = async (eventId) => {
    try {
      console.log('Deleting event:', eventId)
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        console.log('Event deleted successfully')
        
        // Refresh events list
        await fetchEvents()
        
        return true
      } else {
        console.error('Failed to delete event:', response.status)
        throw new Error('Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Verify token and restore user session
      verifyTokenAndRestoreSession(token)
    } else {
      // No token, just fetch events (will be filtered by backend)
      fetchEvents()
    }
  }, [])

  // Function to verify token and restore session
  const verifyTokenAndRestoreSession = async (token) => {
    try {
      console.log('Verifying token and restoring session...')
      console.log('Token exists:', !!token)
      
      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Profile response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Profile data:', data)
        const user = data.data.user
        
        setLoggedIn(true)
        setUserRole(user.role)
        
        const initialUser = {
          id: user._id,
          name: user.name,
          email: user.email,
          registrations: []
        }
        
        setCurrentUser(initialUser)
        
        // Fetch user registrations
        const registrations = await fetchUserRegistrations(user._id)
        setCurrentUser({
          ...initialUser,
          registrations: registrations
        })
        
        // Fetch events after user session is restored
        await fetchEvents()
        
        console.log('Session restored successfully')
      } else {
        console.log('Token verification failed, clearing token')
        // Token is invalid, clear it
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Error verifying token:', error)
      localStorage.removeItem('auth_token')
    }
  }

  // Function to refresh user registrations
  const refreshRegistrations = async () => {
    if (currentUser.id) {
      try {
        const registrations = await fetchUserRegistrations(currentUser.id)
        setCurrentUser({
          ...currentUser,
          registrations: registrations
        })
      } catch (error) {
        console.error('Error refreshing registrations:', error)
      }
    }
  }

  // Function to fetch user registrations from server
  const fetchUserRegistrations = async (userId) => {
    try {
      const response = await fetch('/api/registrations/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Fetched registrations from server:', data.registrations)
        
        // Transform registrations to match frontend format
        const registrationsWithEvents = data.registrations.map(reg => ({
          _id: reg._id,
          eventId: reg.eventId?._id || reg.eventId, // Handle both populated and unpopulated eventId
          registrationDate: reg.registrationDate,
          rollNumber: reg.rollNumber,
          course: reg.course,
          year: reg.year,
          phoneNumber: reg.phoneNumber,
          dietaryRequirements: reg.dietaryRequirements,
          specialRequests: reg.specialRequests,
          feedback: reg.feedback,
          status: reg.status
        }))
        
        return registrationsWithEvents || []
      } else {
        console.error('Failed to fetch registrations:', response.status)
        return []
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      return []
    }
  }

  // Login handler function - to be passed to LoginPage
  const handleSuccessfulLogin = async (user, role) => {
    console.log('Login successful, user:', user)
    console.log('User role:', role)
    
    setLoggedIn(true)
    setUserRole(role)
    
    // Set initial user data
    const initialUser = {
      id: user._id || Date.now().toString(),
      name: user.name || 'User',
      email: user.email,
      registrations: []
    }
    
    console.log('Setting initial user:', initialUser)
    setCurrentUser(initialUser)
    
    // Fetch user registrations from server
    try {
      console.log('Fetching user registrations...')
      const registrations = await fetchUserRegistrations(user._id)
      console.log('Fetched registrations:', registrations)
      
      setCurrentUser({
        ...initialUser,
        registrations: registrations
      })
      
      // Fetch events after successful login
      await fetchEvents()
    } catch (error) {
      console.error('Error fetching registrations on login:', error)
    }
  }

  // Logout handler function
  const handleLogout = () => {
    setLoggedIn(false)
    setUserRole('')
    setCurrentUser({
      id: '',
      name: '',
      email: '',
      registrations: []
    })
    // Clear token from localStorage
    localStorage.removeItem('auth_token')
  }

  // Registration handler function
  const handleEventRegistration = async (eventId, registrationData) => {
    try {
      // Find the event to get its MongoDB _id
      const event = events.find(e => e.id === eventId || e._id === eventId)
      if (!event) {
        throw new Error('Event not found')
      }
      
      // Save registration to server
      const response = await fetch(`/api/registrations/events/${event._id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(registrationData)
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add the registration to user's list
        const updatedUser = {
          ...currentUser,
          registrations: [
            ...currentUser.registrations,
            { 
              eventId: event._id,
              ...registrationData,
              registrationDate: new Date().toISOString(),
              _id: data.registration._id
            }
          ]
        }
        setCurrentUser(updatedUser)
        
        // Add user to event's attendees list
        const updatedEvents = events.map(e => {
          if (e._id === event._id) {
            return {
              ...e,
              attendees: [
                ...e.attendees || [],
                {
                  userId: currentUser.id,
                  name: currentUser.name,
                  ...registrationData
                }
              ]
            }
          }
          return e
        })
        setEvents(updatedEvents)
        
        return updatedUser.registrations.find(reg => reg.eventId === event._id)
      } else {
        console.error('Failed to register for event:', response.status)
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      throw error
    }
  }

  // Handle event feedback submission
  const handleFeedbackSubmission = async (eventId, feedbackData) => {
    try {
      // Find the event to get its MongoDB _id
      const event = events.find(e => e.id === eventId || e._id === eventId)
      if (!event) {
        throw new Error('Event not found')
      }
      
      // Find the registration to get its ID
      const registration = currentUser.registrations.find(reg => reg.eventId === event._id)
      
      if (registration && registration._id) {
        // Submit feedback to server
        const response = await fetch(`/api/registrations/${registration._id}/feedback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify(feedbackData)
        })

        if (!response.ok) {
          console.error('Failed to submit feedback:', response.status)
          throw new Error('Failed to submit feedback')
        }
      }
      
      // Update the user's registration to include feedback
      const updatedRegistrations = currentUser.registrations.map(reg => {
        if (reg.eventId === event._id) {
          return {
            ...reg,
            feedback: feedbackData
          }
        }
        return reg
      })
      
      setCurrentUser({
        ...currentUser,
        registrations: updatedRegistrations
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      throw error
    }
  }

  // Handle event cancellation
  const handleCancelRegistration = async (eventId) => {
    try {
      // Find the event to get its MongoDB _id
      const event = events.find(e => e.id === eventId || e._id === eventId)
      if (!event) {
        throw new Error('Event not found')
      }
      
      // Find the registration to get its ID
      const registration = currentUser.registrations.find(reg => reg.eventId === event._id)
      
      if (registration && registration._id) {
        // Cancel registration on server
        const response = await fetch(`/api/registrations/${registration._id}/cancel`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        if (!response.ok) {
          console.error('Failed to cancel registration:', response.status)
          throw new Error('Failed to cancel registration')
        }
      }
      
      // Remove registration from user
      const updatedRegistrations = currentUser.registrations.filter(
        reg => reg.eventId !== event._id
      )
      
      setCurrentUser({
        ...currentUser,
        registrations: updatedRegistrations
      })
      
      // Remove user from event attendees
      const updatedEvents = events.map(e => {
        if (e._id === event._id) {
          return {
            ...e,
            attendees: e.attendees.filter(
              attendee => attendee.userId !== currentUser.id
            )
          }
        }
        return e
      })
      
      setEvents(updatedEvents)
    } catch (error) {
      console.error('Error cancelling registration:', error)
      throw error
    }
  }

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <LoginPage onLoginSuccess={handleSuccessfulLogin} />
          } />
          <Route path="/signup" element={<SignupPage onLoginSuccess={handleSuccessfulLogin} />} />
          <Route path="/student-homepage" element={
            loggedIn && userRole === 'student' ? 
              <StudentHomepage 
                currentUser={currentUser} 
                events={events.filter(event => 
                  currentUser.registrations.some(reg => reg.eventId === event.id)
                )} 
                onLogout={handleLogout}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/president-homepage" element={
            loggedIn && userRole === 'president' ? 
              <PresidentHomepage 
                onLogout={handleLogout}
                events={events}
                eventsLoading={eventsLoading}
                onCreateEvent={createEvent}
                onUpdateEvent={updateEvent}
                onDeleteEvent={deleteEvent}
                onRefreshEvents={fetchEvents}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/management-homepage" element={
            loggedIn && userRole === 'management' ? 
              <ManagementHomepage 
                onLogout={handleLogout}
                events={events}
                eventsLoading={eventsLoading}
                onUpdateEvent={updateEvent}
                onDeleteEvent={deleteEvent}
                onRefreshEvents={fetchEvents}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/discover-events" element={
            loggedIn ? 
              <DiscoverEvents 
                events={events} 
                eventsLoading={eventsLoading}
                userRegistrations={currentUser.registrations} 
                onLogout={handleLogout}
                onRefreshEvents={fetchEvents}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/event-details/:eventId" element={
            loggedIn ? 
              <EventDetails 
                events={events} 
                currentUser={currentUser}
                onRegister={handleEventRegistration} 
                onCancelRegistration={handleCancelRegistration}
              /> 
              : 
              <Navigate to="/" replace />
          } />
          <Route path="/register-event/:eventId" element={
            loggedIn ? 
              <RegisterEvent 
                events={events} 
                currentUser={currentUser}
                onRegister={handleEventRegistration} 
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/my-registrations" element={
            loggedIn ? 
              <MyRegistrations 
                registrations={currentUser.registrations} 
                events={events} 
                onCancelRegistration={handleCancelRegistration}
                onLogout={handleLogout}
              /> : 
              <Navigate to="/" replace />
          } />
          <Route path="/feedback/:eventId" element={
            loggedIn ? 
              <SubmitFeedback 
                events={events}
                currentUser={currentUser}
                registrations={currentUser.registrations}
                onSubmitFeedback={handleFeedbackSubmission}
              /> : 
              <Navigate to="/" replace />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App;