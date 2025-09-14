// src/App.jsx
import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import { getFireAlerts } from './api/fireAlerts'

function App() {
  const [alerts, setAlerts] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAlerts()
    // Set up polling for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      setError(null)
      console.log('Fetching alerts...') // Debug log
      const data = await getFireAlerts()
      console.log('Fetched alerts:', data) // Debug log
      setAlerts(data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      setError('Failed to load fire alerts. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fire alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          toggleSidebar={() => setShowSidebar(!showSidebar)}
          alertsCount={alerts.length}
        />
        
        <Dashboard 
          alerts={alerts}
          selectedAlert={selectedAlert}
        />
      </div>
    </div>
  )
}

export default App