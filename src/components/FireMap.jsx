// src/components/FireMap.jsx
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Utility: safe base64 for SVG (handles UTF-8)
const toBase64 = (str) => {
  try {
    return typeof window !== 'undefined'
      ? window.btoa(unescape(encodeURIComponent(str)))
      : Buffer.from(str).toString('base64')
  } catch (e) {
    return typeof window !== 'undefined' ? window.btoa(str) : Buffer.from(str).toString('base64')
  }
}

const createFireIcon = (selected) => {
  const svgString = selected ?
    `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z" fill="#ff0000"/><path d="M13.5 14.5C13.5 15.3284 12.8284 16 12 16C11.1716 16 10.5 15.3284 10.5 14.5C10.5 13.6716 11.1716 13 12 13C12.8284 13 13.5 13.6716 13.5 14.5Z" fill="white"/></svg>` :
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2Z" fill="#ff6b6b"/><path d="M13.5 14.5C13.5 15.3284 12.8284 16 12 16C11.1716 16 10.5 15.3284 10.5 14.5C10.5 13.6716 11.1716 13 12 13C12.8284 13 13.5 13.6716 13.5 14.5Z" fill="white"/></svg>`

  const dataUrl = `data:image/svg+xml;base64,${toBase64(svgString)}`

  return L.icon({
    iconUrl: dataUrl,
    iconSize: selected ? [30, 30] : [20, 20],
    iconAnchor: selected ? [15, 30] : [10, 20],
    popupAnchor: [0, -30]
  })
}

const createDeviceIcon = (selected, isFire) => {
  const color = isFire ? '#ff6b6b' : '#4a90e2'
  const size = selected ? 30 : 20
  
  const svgString = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="14" height="20" rx="2" stroke="${color}" stroke-width="2"/>
    <circle cx="12" cy="17" r="1" fill="${color}"/>
    <rect x="9" y="6" width="6" height="8" rx="1" fill="${color}" fill-opacity="0.3"/>
  </svg>`

  const dataUrl = `data:image/svg+xml;base64,${toBase64(svgString)}`

  return L.icon({
    iconUrl: dataUrl,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size]
  })
}

const createPersonIcon = () => {
  const svgString = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="#4a90e2"/><path d="M12 14C9.33 14 4 15.34 4 18V19C4 19.55 4.45 20 5 20H19C19.55 20 20 19.55 20 19V18C20 15.34 14.67 14 12 14Z" fill="#4a90e2"/></svg>`
  const dataUrl = `data:image/svg+xml;base64,${toBase64(svgString)}`
  return L.icon({
    iconUrl: dataUrl,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20]
  })
}

// Heuristic normalization for lat/lng to correct swapped values
const normalizeCoords = (alert) => {
  // Accept various property names
  let lat = Number(alert.latitude ?? alert.lat ?? alert.latitute ?? alert.Latitude ?? NaN)
  let lng = Number(alert.longitude ?? alert.lng ?? alert.long ?? alert.Longitude ?? NaN)

  // If they are not numbers try createdAt or coords (defensive)
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    // try parsing from an array or object
    if (alert.coords && Array.isArray(alert.coords)) {
      lat = Number(alert.coords[0])
      lng = Number(alert.coords[1])
    }
  }

  // If clearly out of range, swap
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    ;[lat, lng] = [lng, lat]
  } else {
    // Heuristic: if latitude is unusually large (>50) while longitude is relatively small (<50),
    // it's likely that the values are swapped for regions like India where latitudes < ~50.
    if (Math.abs(lat) > 50 && Math.abs(lng) < 50) {
      ;[lat, lng] = [lng, lat]
    }
  }

  return { lat, lng }
}

const FireMap = ({ alerts = [], devices = [], selectedAlert, selectedDevice, personnelLocation, onDeviceSelect }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const layersRef = useRef([]) // store markers / polylines so we can remove them
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map only once
    const mapInstance = L.map(mapRef.current, { 
      preferCanvas: true,
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true
    }).setView([20, 78], 5)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstance)

    // Add zoom control to bottom right
    mapInstance.zoomControl.setPosition('bottomright')

    mapInstanceRef.current = mapInstance
    setMapReady(true)

    // Fix map rendering issues
    setTimeout(() => {
      mapInstance.invalidateSize()
    }, 100)

    return () => {
      // Clean up map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !mapReady) return

    // Remove previous layers
    layersRef.current.forEach(layer => {
      if (map.hasLayer(layer)) map.removeLayer(layer)
    })
    layersRef.current = []

    // Add fire markers (only for alerts with isFire = true)
    alerts.filter(alert => alert.isFire).forEach(alert => {
      const { lat, lng } = normalizeCoords(alert)

      if (Number.isNaN(lat) || Number.isNaN(lng)) return

      const isSelected = selectedAlert && (selectedAlert.id === alert.id || selectedAlert._id === alert._id)
      const icon = createFireIcon(isSelected)

      const marker = L.marker([lat, lng], { icon }).addTo(map)
      const timestamp = new Date(alert.timestamp ?? alert.createdAt ?? alert.lastUpdate ?? Date.now()).toLocaleString()
      
      // Display humidity data if available
      const humidityDisplay = alert.humidity ? `<div><strong>Humidity:</strong> ${alert.humidity}%</div>` : ''

      marker.bindPopup(`
        <div style="padding:8px; min-width:200px">
          <h3 style="margin:0 0 8px 0;font-weight:700;color:#d93025">Fire Alert</h3>
          <div><strong>Detected:</strong> ${timestamp}</div>
          <div><strong>Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
          ${humidityDisplay}
          <div><strong>Status:</strong> ${alert.isFire ? 'Active Fire' : 'Potential Fire'}</div>
          <div style="margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
               target="_blank" 
               style="background: #4285f4; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; display: inline-block;">
              Get Directions
            </a>
          </div>
        </div>
      `)

      layersRef.current.push(marker)

      if (isSelected) {
        // Center and open popup for selected alert
        map.setView([lat, lng], 12, { animate: true })
        setTimeout(() => marker.openPopup(), 300)
      }
    })

    // Add device markers
    devices.forEach(device => {
      const { lat, lng } = normalizeCoords(device)

      if (Number.isNaN(lat) || Number.isNaN(lng)) return

      const isSelected = selectedDevice && (selectedDevice.deviceId === device.deviceId || selectedDevice._id === device._id)
      const icon = createDeviceIcon(isSelected, device.isfire)

      const marker = L.marker([lat, lng], { icon }).addTo(map)
      const timestamp = new Date(device.lastUpdate ?? device.timestamp ?? Date.now()).toLocaleString()
      
      marker.bindPopup(`
        <div style="padding:8px; min-width:220px">
          <h3 style="margin:0 0 8px 0;font-weight:700;">Device: ${device.deviceId}</h3>
          <div><strong>Last Update:</strong> ${timestamp}</div>
          <div><strong>Location:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
          <div><strong>Temperature:</strong> ${device.temp}°C</div>
          <div><strong>Humidity:</strong> ${device.humidity}%</div>
          <div><strong>Smoke:</strong> ${device.smoke} ppm</div>
          <div><strong>Fire Detected:</strong> ${device.isfire ? 'Yes' : 'No'}</div>
          <div style="margin-top: 8px; display: flex; gap: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
               target="_blank" 
               style="background: #4285f4; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; display: inline-block;">
              Get Directions
            </a>
            <button onclick="window.selectDevice('${device.deviceId}')" 
               style="background: #34a853; color: white; padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>
      `)

      // Add click event to select device
      marker.on('click', () => {
        if (onDeviceSelect) {
          onDeviceSelect(device)
        }
      })

      layersRef.current.push(marker)

      if (isSelected) {
        // Center and open popup for selected device
        map.setView([lat, lng], 12, { animate: true })
        setTimeout(() => marker.openPopup(), 300)
      }
    })

    // Add personnel location marker and line to selected alert/device
    if (personnelLocation && personnelLocation.lat != null && personnelLocation.lng != null) {
      const pIcon = createPersonIcon()
      const pMarker = L.marker([personnelLocation.lat, personnelLocation.lng], { icon: pIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding:8px">
            <h3 style="margin:0 0 6px 0;font-weight:700">Response Team</h3>
            <div>Location: ${personnelLocation.lat.toFixed(6)}, ${personnelLocation.lng.toFixed(6)}</div>
          </div>
        `)
      layersRef.current.push(pMarker)

      // Draw line to selected alert or device
      let targetLat, targetLng
      if (selectedAlert) {
        const { lat: sLat, lng: sLng } = normalizeCoords(selectedAlert)
        if (!Number.isNaN(sLat) && !Number.isNaN(sLng)) {
          targetLat = sLat
          targetLng = sLng
        }
      } else if (selectedDevice) {
        const { lat: sLat, lng: sLng } = normalizeCoords(selectedDevice)
        if (!Number.isNaN(sLat) && !Number.isNaN(sLng)) {
          targetLat = sLat
          targetLng = sLng
        }
      }

      if (targetLat !== undefined && targetLng !== undefined) {
        const line = L.polyline(
          [[personnelLocation.lat, personnelLocation.lng], [targetLat, targetLng]], 
          { color: '#4285f4', weight: 3, dashArray: '5, 10' }
        ).addTo(map)
        layersRef.current.push(line)

        const distance = calculateDistance(personnelLocation.lat, personnelLocation.lng, targetLat, targetLng)
        const midLat = (personnelLocation.lat + targetLat) / 2
        const midLng = (personnelLocation.lng + targetLng) / 2

        const distPopup = L.popup({ 
          closeButton: false, 
          autoClose: false,
          className: 'distance-popup'
        })
          .setLatLng([midLat, midLng])
          .setContent(`<div style="padding:4px;font-weight:bold">Distance: ${distance.toFixed(2)} km</div>`)
          .openOn(map)

        layersRef.current.push(distPopup)
      }
    }

    // Ensure map is properly rendered
    setTimeout(() => {
      map.invalidateSize()
    }, 50)

  }, [alerts, devices, selectedAlert, selectedDevice, personnelLocation, mapReady, onDeviceSelect])

  // Haversine distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const toRad = (deg) => deg * Math.PI / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  return (
    <div className="h-96 md:h-112 w-full rounded-md overflow-hidden relative">
      <div 
        ref={mapRef} 
        className="h-full w-full leaflet-container"
        style={{ cursor: 'grab' }}
      ></div>
    </div>
  )
}

export default FireMap