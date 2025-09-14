// src/components/StatsOverview.jsx
const StatsOverview = ({ devices }) => {
  // Make sure devices is always an array
  const safeDevices = Array.isArray(devices) ? devices : []

  // Active alerts = devices where fire is detected
  const activeAlerts = safeDevices.filter(device => device.isfire).length
  const totalDevices = safeDevices.length
  const devicesWithFire = activeAlerts
  const normalDevices = totalDevices - devicesWithFire

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Alerts */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Total Alerts</h3>
        <p className="text-3xl font-bold text-blue-600">{activeAlerts}</p>
        <p className="text-sm text-gray-500">Active fire alerts</p>
      </div>
      
      {/* Devices */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Devices</h3>
        <p className="text-3xl font-bold text-indigo-600">{totalDevices}</p>
        <p className="text-sm text-gray-500">Total devices</p>
      </div>
      
      {/* Fire Detected */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Fire Detected</h3>
        <p className="text-3xl font-bold text-red-600">{devicesWithFire}</p>
        <p className="text-sm text-gray-500">Devices detecting fire</p>
      </div>
      
      {/* Normal */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Normal</h3>
        <p className="text-3xl font-bold text-green-600">{normalDevices}</p>
        <p className="text-sm text-gray-500">Devices operating normally</p>
      </div>
    </div>
  )
}

export default StatsOverview
