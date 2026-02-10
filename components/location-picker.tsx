"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface LocationPickerProps {
  onLocationSelected: (latitude: string, longitude: string) => void
  initialLatitude?: string
  initialLongitude?: string
}

export function LocationPicker({ onLocationSelected, initialLatitude, initialLongitude }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLat, setSelectedLat] = useState(initialLatitude || "28.7041")
  const [selectedLng, setSelectedLng] = useState(initialLongitude || "77.1025")
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const searchTimeout = useRef<NodeJS.Timeout | null>(null)

  // Load Leaflet dynamically
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.async = true
    script.onload = () => {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
      setMapLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapContainer.current) return

    // Initialize map
    const L = (window as any).L
    if (map.current) map.current.remove()

    map.current = L.map(mapContainer.current).setView(
      [Number.parseFloat(selectedLat), Number.parseFloat(selectedLng)],
      13,
    )

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current)

    // Add marker
    const marker = L.marker([Number.parseFloat(selectedLat), Number.parseFloat(selectedLng)])
      .addTo(map.current)
      .bindPopup(`Lat: ${selectedLat}<br>Lng: ${selectedLng}`)
      .openPopup()

    // Handle map click
    map.current.on("click", (e: any) => {
      const { lat, lng } = e.latlng
      setSelectedLat(lat.toFixed(4))
      setSelectedLng(lng.toFixed(4))
      marker.setLatLng([lat, lng])
      marker.setPopupContent(`Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`)
      marker.openPopup()
      onLocationSelected(lat.toFixed(4), lng.toFixed(4))
    })
  }, [mapLoaded, selectedLat, selectedLng])

  useEffect(() => {
    if (!searchQuery.trim()) return

    // Clear previous timeout
    if (searchTimeout.current) clearTimeout(searchTimeout.current)

    // Set new timeout for debounced search
    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
        )
        const results = await response.json()

        if (results.length > 0) {
          const { lat, lon } = results[0]
          setSelectedLat(Number.parseFloat(lat).toFixed(4))
          setSelectedLng(Number.parseFloat(lon).toFixed(4))
          map.current?.setView([Number.parseFloat(lat), Number.parseFloat(lon)], 13)
          onLocationSelected(lat, lon)
        }
      } catch (error) {
        console.error("Search error:", error)
      }
    }, 500) // 500ms debounce

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
  }, [searchQuery])

  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder="Search location (e.g., Delhi, India)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-muted border-border/50"
      />

      {mapLoaded && (
        <div>
          <div ref={mapContainer} className="h-72 rounded-lg border border-border/50" />
          <div className="mt-2 p-2 bg-muted rounded text-sm">
            <p className="text-foreground">
              <strong>Latitude:</strong> {selectedLat}
            </p>
            <p className="text-foreground">
              <strong>Longitude:</strong> {selectedLng}
            </p>
            <p className="text-muted-foreground text-xs mt-1">Click on the map to select a location</p>
          </div>
        </div>
      )}
    </div>
  )
}
