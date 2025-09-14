// src/api/fireAlerts.js
const API_BASE_URL = 'https://fire-detection-system-neon.vercel.app/api/fire-alerts'

// ✅ Fetch all alerts (GET)
export const getFireAlerts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/getAlert`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('API Response:', data)

    // Adjust based on your backend response format
    if (data.success && Array.isArray(data.devices)) {
      return data.devices.map(alert => ({
        id: alert._id,
        deviceId: alert.deviceId,
        latitude: alert.latitude,
        longitude: alert.longitude,
        humidity: alert.humidity,
        temp: alert.temp,
        smoke: alert.smoke,
        isFire: alert.isfire,
        timestamp: alert.lastUpdate,
      }))
    }

    console.warn('Unexpected API response format:', data)
    return []
  } catch (error) {
    console.error('Error fetching fire alerts:', error)
    throw error
  }
}

// ✅ Create / update device alert (POST)
export const createFireAlert = async (alertData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/createAlert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData),
    })

    if (!response.ok) {
      throw new Error(`Failed to create alert: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating fire alert:', error)
    throw error
  }
}
