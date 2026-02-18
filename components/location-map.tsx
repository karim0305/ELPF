interface LocationMapProps {
  location: { latitude: number; longitude: number };
  height?: string;
}

export function LocationMap({ location, height = "h-64" }: LocationMapProps) {
  const { latitude, longitude } = location;

  return (
    <div className={`${height} w-full rounded-lg overflow-hidden border border-gray-300`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}&layer=mapnik&marker=${latitude},${longitude}`}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
