"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Report } from "@shared/schema"
import ReportMarker from "./ReportMarker"
import ActiveReportPanel from "./ActiveReportPanel"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"

// Override Leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

interface LeakageMapProps {
  reports: Report[]
  activeReport: Report | null
  setActiveReport: (report: Report | null) => void
  onAddReport: () => void
}

// Component to recenter map to user's location
function RecenterAutomatically({ coords }: { coords: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (coords) {
      map.setView(coords, 15)
    }
  }, [coords, map])

  return null
}

export default function LeakageMap({ reports, activeReport, setActiveReport, onAddReport }: LeakageMapProps) {
  const { position, getPosition } = useGeolocation()
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]) // Default coordinates
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (position) {
      setMapCenter([position.latitude, position.longitude])
    }
  }, [position])

  const handleRecenter = () => {
    getPosition()
      .then((pos) => {
        if (mapRef.current) {
          mapRef.current.setView([pos.latitude, pos.longitude], 15)
        }
      })
      .catch((error) => {
        console.error("Failed to get position:", error)
      })
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1)
    }
  }

  return (
    <div className="h-[calc(100vh-13rem)] md:h-[calc(100vh-4rem)] bg-neutral-100 relative">
      <MapContainer
        center={mapCenter}
        zoom={15}
        className="h-full w-full"
        whenCreated={(map) => {
          mapRef.current = map
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {position && (
          <Marker position={[position.latitude, position.longitude]}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Report Markers */}
        {reports.map((report) => (
          <ReportMarker
            key={report.id}
            report={report}
            isActive={activeReport?.id === report.id}
            onClick={() => setActiveReport(report)}
          />
        ))}

        {/* Auto-recenter when position changes */}
        {position && <RecenterAutomatically coords={[position.latitude, position.longitude]} />}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="bg-white text-primary-700 hover:bg-neutral-50 rounded-full shadow-md"
          onClick={handleRecenter}
        >
          <i className="ri-map-pin-user-line text-xl"></i>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="bg-white text-neutral-700 hover:bg-neutral-50 rounded-full shadow-md"
          onClick={handleZoomIn}
        >
          <i className="ri-zoom-in-line text-xl"></i>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="bg-white text-neutral-700 hover:bg-neutral-50 rounded-full shadow-md"
          onClick={handleZoomOut}
        >
          <i className="ri-zoom-out-line text-xl"></i>
        </Button>

        <Button
          size="icon"
          variant="secondary"
          className="bg-white text-neutral-700 hover:bg-neutral-50 rounded-full shadow-md"
        >
          <i className="ri-filter-3-line text-xl"></i>
        </Button>
      </div>

      {/* Active Report Panel */}
      {activeReport && <ActiveReportPanel report={activeReport} onClose={() => setActiveReport(null)} />}

      {/* Add Report Button on Map */}
      <Button
        onClick={onAddReport}
        className="absolute bottom-6 md:hidden left-1/2 transform -translate-x-1/2 h-12 px-6 shadow-lg"
      >
        <i className="ri-add-line mr-2"></i>
        Report a Leak
      </Button>
    </div>
  )
}
