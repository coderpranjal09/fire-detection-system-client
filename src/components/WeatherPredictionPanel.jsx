// src/components/WeatherPredictionPanel.jsx
import { useState, useEffect } from 'react'

const WeatherPredictionPanel = ({ selectedAlert }) => {
  const [weatherData, setWeatherData] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (selectedAlert) {
      fetchWeatherAndPrediction()
    }
  }, [selectedAlert])

  const fetchWeatherAndPrediction = async () => {
    if (!selectedAlert) return
    
    setLoading(true)
    setError(null)
    
    try {
      // First fetch weather data
      const weatherResponse = await fetch(
        ``
      )
      
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }
      
      const weatherData = await weatherResponse.json()
      setWeatherData(weatherData)
      
      // Then send to Gemini AI for prediction
      const aiResponse = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': ' api key'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze fire spread risk based on these conditions:
              Location: Latitude ${selectedAlert.latitude}, Longitude ${selectedAlert.longitude}
              Temperature: ${weatherData.main.temp}°C
              Humidity: ${weatherData.main.humidity}%
              Wind Speed: ${weatherData.wind.speed} m/s
              Wind Direction: ${weatherData.wind.deg}°
              Conditions: ${weatherData.weather[0].description}
              
              Provide a JSON response with:
              {
                "riskLevel": "High/Medium/Low",
                "spreadRate": "km/h",
                "currentArea": "hectares",
                "timeToDouble": "hours",
                "predictedDirection": "compass direction",
                "affectedArea": "hectares",
                "recommendations": ["array of strings"]
              }`
            }]
          }]
        })
      })
      
      if (!aiResponse.ok) {
        throw new Error('Failed to get AI prediction')
      }
      
      const aiData = await aiResponse.json()
      // Parse the AI response (assuming it returns valid JSON)
      const predictionText = aiData.candidates[0].content.parts[0].text
      const jsonMatch = predictionText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const predictionData = JSON.parse(jsonMatch[0])
        setPrediction(predictionData)
      } else {
        throw new Error('Invalid AI response format')
      }
      
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      // Fallback to mock data for demonstration
      setPrediction(generateMockPrediction())
    } finally {
      setLoading(false)
    }
  }

  const generateMockPrediction = () => {
    const spreadRate = (Math.random() * 2 + 0.5).toFixed(2)
    const area = (Math.random() * 10 + 1).toFixed(2)
    const timeToDouble = (1 / spreadRate * (2 + Math.random() * 3)).toFixed(2)
    
    return {
      spreadRate,
      currentArea: area,
      timeToDouble,
      riskLevel: spreadRate > 1.5 ? 'High' : spreadRate > 1 ? 'Medium' : 'Low',
      predictedDirection: ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'][
        Math.floor(Math.random() * 8)
      ],
      affectedArea: (area * (1 + Math.random() * 2)).toFixed(2),
      recommendations: [
        'Evacuate areas within 2km radius',
        'Deploy water bombers to the northern sector',
        'Create fire breaks to the east',
        'Alert nearby communities'
      ]
    }
  }

  if (!selectedAlert) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select a fire alert to view weather data and predictions
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2">Analyzing weather conditions and fire spread patterns...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchWeatherAndPrediction}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Weather Data Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Current Weather Conditions</h3>
        {weatherData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800">Temperature</h4>
              <p className="text-2xl font-bold">{weatherData.main.temp}°C</p>
              <p>Feels like: {weatherData.main.feels_like}°C</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-800">Humidity</h4>
              <p className="text-2xl font-bold">{weatherData.main.humidity}%</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800">Wind</h4>
              <p className="text-2xl font-bold">{weatherData.wind.speed} m/s</p>
              <p>Direction: {weatherData.wind.deg}°</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-800">Conditions</h4>
              <p className="capitalize">{weatherData.weather[0].description}</p>
              <p>Pressure: {weatherData.main.pressure} hPa</p>
            </div>
          </div>
        ) : (
          <p>Weather data not available</p>
        )}
      </div>

      {/* Fire Prediction Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Fire Spread Analysis & Prediction</h3>
        {prediction ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${
                prediction.riskLevel === 'High' ? 'bg-red-100 border-l-4 border-red-500' :
                prediction.riskLevel === 'Medium' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
                'bg-green-100 border-l-4 border-green-500'
              }`}>
                <h4 className="font-medium">Risk Level</h4>
                <p className="text-2xl font-bold">{prediction.riskLevel}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800">Spread Rate</h4>
                <p className="text-2xl font-bold">{prediction.spreadRate} km/h</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800">Current Area</h4>
                <p className="text-2xl font-bold">{prediction.currentArea} hectares</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800">Time to Double</h4>
                <p className="text-2xl font-bold">{prediction.timeToDouble} hours</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium">Predicted Direction & Area</h4>
              <p className="text-xl">Direction: {prediction.predictedDirection}</p>
              <p className="text-xl mt-2">Potential Affected Area: {prediction.affectedArea} hectares</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-800">Recommendations</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {prediction.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Prediction data not available</p>
        )}
      </div>
    </div>
  )
}

export default WeatherPredictionPanel