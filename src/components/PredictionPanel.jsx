// src/components/DevicePanel.jsx
import { useState, useEffect } from 'react'

const PredictionPanel = ({ selectedDevice }) => {
  const [deviceData, setDeviceData] = useState(null)

  useEffect(() => {
    if (selectedDevice) {
      setDeviceData(selectedDevice)
      
      // In a real application, you might want to set up a WebSocket or polling
      // to get real-time updates for the selected device
    }
  }, [selectedDevice])

  if (!selectedDevice) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a device to view details
      </div>
    )
  }

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedDevice.latitude},${selectedDevice.longitude}`
    window.open(url, '_blank')
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Device: {selectedDevice.deviceId}</h3>
        <button 
          onClick={openGoogleMaps}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Get Directions
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${
          selectedDevice.isfire 
            ? 'bg-red-100 border-l-4 border-red-500' 
            : 'bg-green-100 border-l-4 border-green-500'
        }`}>
          <h4 className="font-medium">Status</h4>
          <p className="text-2xl font-bold">
            {selectedDevice.isfire ? 'Fire Detected' : 'Normal'}
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-medium text-blue-800">Temperature</h4>
          <p className="text-2xl font-bold">{selectedDevice.temp}°C</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
          <h4 className="font-medium text-purple-800">Humidity</h4>
          <p className="text-2xl font-bold">{selectedDevice.humidity}%</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h4 className="font-medium text-orange-800">Smoke Level</h4>
          <p className="text-2xl font-bold">{selectedDevice.smoke} ppm</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg md:col-span-2 border-l-4 border-gray-500">
          <h4 className="font-medium">Location</h4>
          <p className="text-sm">
            Lat: {selectedDevice.latitude?.toFixed(6)}, Lng: {selectedDevice.longitude?.toFixed(6)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: {new Date(selectedDevice.lastUpdate).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default PredictionPanel;