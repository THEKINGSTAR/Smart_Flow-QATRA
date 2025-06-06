"use client"

import { useState, useEffect } from "react"

interface GeolocationPosition {
  latitude: number
  longitude: number
  accuracy: number
}

interface GeolocationHook {
  position: GeolocationPosition | null
  address: string | null
  error: string | null
  loading: boolean
  getPosition: () => Promise<GeolocationPosition>
}

export function useGeolocation(): GeolocationHook {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Function to get the current position
  const getPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      setLoading(true)
      setError(null)

      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser")
        setLoading(false)
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          setPosition(newPosition)

          // Try to get address from coordinates
          getAddressFromCoordinates(newPosition.latitude, newPosition.longitude)
            .then((address) => {
              setAddress(address)
              setLoading(false)
              resolve(newPosition)
            })
            .catch(() => {
              setLoading(false)
              resolve(newPosition)
            })
        },
        (error) => {
          let errorMessage
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied"
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable"
              break
            case error.TIMEOUT:
              errorMessage = "The request to get user location timed out"
              break
            default:
              errorMessage = "An unknown error occurred getting location"
          }
          setError(errorMessage)
          setLoading(false)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }

  // Function to get the address from coordinates
  async function getAddressFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      // This is using Nominatim which is free and doesn't require API key
      // For production, consider using a service with an API key like Google Maps Geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch address")
      }

      const data = await response.json()

      // Format the address
      const addressComponents = []

      if (data.address) {
        if (data.address.road) addressComponents.push(data.address.road)
        if (data.address.house_number) addressComponents.push(data.address.house_number)
        if (data.address.suburb) addressComponents.push(data.address.suburb)
        if (data.address.city || data.address.town) addressComponents.push(data.address.city || data.address.town)
      }

      return addressComponents.length ? addressComponents.join(", ") : "Unknown location"
    } catch (error) {
      console.error("Error getting address:", error)
      return "Location available, but address lookup failed"
    }
  }

  // Automatically get position when component mounts
  useEffect(() => {
    getPosition().catch((error) => {
      console.error("Initial position fetch failed:", error)
    })
  }, [])

  return { position, address, error, loading, getPosition }
}
