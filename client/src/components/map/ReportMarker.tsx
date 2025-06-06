"use client"

import { useMemo } from "react"
import { Marker, Tooltip } from "react-leaflet"
import L from "leaflet"
import type { Report } from "@shared/schema"

interface ReportMarkerProps {
  report: Report
  isActive: boolean
  onClick: () => void
}

export default function ReportMarker({ report, isActive, onClick }: ReportMarkerProps) {
  // Define marker color based on severity or status
  const getMarkerColor = () => {
    if (report.status === "resolved") return "#4CAF50" // success-500

    // If not resolved, color by severity
    switch (report.severity) {
      case "critical":
        return "#F44336" // error-500
      case "moderate":
        return "#FFC107" // warning-500
      case "minor":
        return "#2196F3" // primary-500
      default:
        return "#9E9E9E" // neutral-500
    }
  }

  // Create custom icon
  const customIcon = useMemo(() => {
    const color = getMarkerColor()
    const iconHtml = `
      <div class="rounded-full bg-[${color}] text-white flex items-center justify-center h-6 w-6 shadow-lg ${isActive ? "ring-2 ring-white" : ""} ${report.severity === "critical" ? "animate-pulse" : ""}">
        <i class="ri-droplet-fill text-sm"></i>
      </div>
    `

    return L.divIcon({
      html: iconHtml,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }, [report.severity, report.status, isActive])

  return (
    <Marker
      position={[Number.parseFloat(report.latitude), Number.parseFloat(report.longitude)]}
      icon={customIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
        {report.title}
      </Tooltip>
    </Marker>
  )
}
