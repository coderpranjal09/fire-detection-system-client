// src/components/Dashboard.jsx
import { useState, useEffect } from 'react'
import { getFireAlerts } from '../api/fireAlerts'
import Sidebar from './SideBar'
import FireMap from './FireMap'
import StatsOverview from './StatsOverview'
import PredictionPannel from './PredictionPanel'

const Dashboard = () => {
  const [alerts, setAlerts] = useState([])
  const [devices, setDevices] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [personnelLocation, setPersonnelLocation] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getFireAlerts()
      
      // Separate alerts and devices
      const fireAlerts = data.filter(item => item.isFire)
      const allDevices = data // All devices are returned from API
      
      setAlerts(fireAlerts)
      setDevices(allDevices)
      
      // Set initial personnel location (could be based on user's location)
      if (allDevices.length > 0 && !personnelLocation) {
        setPersonnelLocation({
          lat: allDevices[0].latitude + 0.01,
          lng: allDevices[0].longitude + 0.01
        })
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device)
    setSelectedAlert(null) // Deselect any alert when selecting a device
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fire monitoring data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        alerts={alerts}
        devices={devices}
        selectedAlert={selectedAlert}
        selectedDevice={selectedDevice}
        setSelectedAlert={setSelectedAlert}
        setSelectedDevice={setSelectedDevice}
        showSidebar={showSidebar}
        error={error}
        onRetry={fetchData}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Fire Monitoring Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={fetchData}
                className="p-2 text-gray-600 hover:text-blue-600"
                title="Refresh data"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <StatsOverview alerts={alerts} devices={devices} />
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <FireMap 
                alerts={alerts}
                devices={devices}
                selectedAlert={selectedAlert}
                selectedDevice={selectedDevice}
                personnelLocation={personnelLocation}
                onDeviceSelect={handleDeviceSelect}
              />
            </div>
            
            {(selectedAlert || selectedDevice) && (
              <div className="bg-white rounded-lg shadow-md">
                {selectedDevice ? (
                  <PredictionPannel selectedDevice={selectedDevice} />
                ) : (
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Fire Alert Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-medium text-red-800">Status</h4>
                        <p className="text-2xl font-bold">Active Fire</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-medium text-blue-800">Location</h4>
                        <p className="text-sm">
                          {selectedAlert.latitude?.toFixed(6)}, {selectedAlert.longitude?.toFixed(6)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 border-l-4 border-gray-500">
                        <h4 className="font-medium">Actions</h4>
                        <div className="mt-2 flex space-x-2">
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedAlert.latitude},${selectedAlert.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Get Directions
                          </a>
                          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                            Dispatch Team
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard