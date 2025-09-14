// src/components/AlertList.jsx
const AlertList = ({ alerts, selectedAlert, setSelectedAlert, title = "Fire Alerts" }) => {
  // Make sure alerts is always an array
  const safeAlerts = Array.isArray(alerts) ? alerts : []
  
  return (
    <div className="divide-y divide-gray-200">
      <div className="p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-800">{title} ({safeAlerts.length})</h3>
      </div>
      
      {safeAlerts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No active alerts
        </div>
      ) : (
        safeAlerts.map(alert => (
          <div 
            key={alert.id || alert._id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedAlert && (selectedAlert.id === alert.id || selectedAlert._id === alert._id)
                ? 'bg-blue-50 border-l-4 border-blue-600' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedAlert(alert)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{alert.deviceId ? `Device: ${alert.deviceId}` : `Fire Alert #${(alert.id || alert._id).slice(-4)}`}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                alert.isFire || alert.isfire
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {alert.isFire || alert.isfire ? 'Active Fire' : 'Monitoring'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(alert.timestamp || alert.lastUpdate).toLocaleString()}
            </p>
            <p className="text-sm mt-2">
              Lat: {alert.latitude?.toFixed(4)}, Lng: {alert.longitude?.toFixed(4)}
            </p>
            {alert.temp && (
              <p className="text-sm mt-1">
                Temp: {alert.temp}°C, Humidity: {alert.humidity}%
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default AlertList