"use client"

interface LocationMapProps {
  location: string
  height?: string
}

export function LocationMap({ location, height = "h-64" }: LocationMapProps) {
  // This displays an embedded map based on location coordinates

  // Sample coordinates for Indian cities
  const locationCoordinates: Record<string, { lat: number; lng: number }> = {
    "Pune, Maharashtra": { lat: 18.5204, lng: 73.8567 },
    "Nashik, Maharashtra": { lat: 19.9975, lng: 73.791 },
    "Kolhapur, Maharashtra": { lat: 16.705, lng: 74.2433 },
    "Mumbai, Maharashtra": { lat: 19.076, lng: 72.8777 },
    "Aurangabad, Maharashtra": { lat: 19.8762, lng: 75.3433 },
  }

  const coords = locationCoordinates[location] || { lat: 18.5204, lng: 73.8567 }

  return (
    <div className={`${height} w-full rounded-lg overflow-hidden border border-gray-300`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.05},${coords.lat - 0.05},${coords.lng + 0.05},${coords.lat + 0.05}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
