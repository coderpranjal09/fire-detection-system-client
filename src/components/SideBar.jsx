// src/components/Sidebar.jsx
import AlertList from './AlertList'

const Sidebar = ({ 
  alerts = [],          
  devices = [],         
  selectedAlert, 
  selectedDevice, 
  setSelectedAlert, 
  setSelectedDevice,
  showSidebar = true,   
  error = null, 
  onRetry = () => {}   
}) => {
  return (
    <div
      className={`bg-white w-64 md:w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${
        showSidebar ? 'translate-x-0' : '-translate-x-full absolute md:relative z-10 h-full'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold">Fire Monitoring System</h2>
        <p className="text-sm text-gray-500">
          {alerts.length} fire alerts, {devices.length} devices
        </p>
      </div>

      {/* Error State */}
      {error ? (
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={onRetry}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Active Fire Alerts */}
          <AlertList 
            alerts={alerts.filter(alert => alert.isFire)} 
            selectedAlert={selectedAlert}
            setSelectedAlert={setSelectedAlert}
            title="Active Fire Alerts"
          />

          {/* Devices */}
          <AlertList 
            alerts={devices} 
            selectedAlert={selectedDevice}
            setSelectedAlert={setSelectedDevice}
            title="Devices"
          />
        </>
      )}
    </div>
  )   
}

export default Sidebar
