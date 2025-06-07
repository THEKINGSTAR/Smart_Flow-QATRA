"use client"

import { createContext, type ReactNode, useContext, useState, useEffect } from "react"
import { useQuery, useMutation, type UseMutationResult } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useOfflineStorage } from "@/hooks/use-offline-storage"
import { z } from "zod"

// Define types locally to avoid import issues
interface Report {
  id: number
  userId?: number
  title: string
  description: string
  address: string
  latitude: string
  longitude: string
  severity: string
  status: string
  photos: any[]
  voiceNote?: string
  anonymous: boolean
  createdAt: Date
  updatedAt: Date
}

interface InsertReport {
  userId?: number
  title: string
  description: string
  address: string
  latitude: string
  longitude: string
  severity: string
  status?: string
  photos?: any[]
  voiceNote?: string
  anonymous?: boolean
}

interface ReportsContextType {
  reports: Report[]
  userReports: Report[]
  isLoading: boolean
  activeReport: Report | null
  setActiveReport: (report: Report | null) => void
  submitReportMutation: UseMutationResult<Report, Error, InsertReport>
  updateReportStatusMutation: UseMutationResult<Report, Error, { id: number; status: string }>
}

const ReportsContext = createContext<ReportsContextType | null>(null)

// Define validation schema
export const reportFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.string(),
  longitude: z.string(),
  severity: z.enum(["minor", "moderate", "critical"]),
  photos: z.array(z.string()).optional(),
  voiceNote: z.string().optional(),
  anonymous: z.boolean().optional(),
})

async function apiRequest(method: string, url: string, data?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const { user } = useAuth()
  const { saveOfflineReport, syncOfflineReports } = useOfflineStorage()
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  // Get all reports
  const { data: reports = [], isLoading: isLoadingReports } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
    queryFn: () => apiRequest("GET", "/api/reports"),
    staleTime: 60000,
  })

  // Get user reports if authenticated
  const { data: userReports = [] } = useQuery<Report[]>({
    queryKey: ["/api/user/reports"],
    queryFn: () => apiRequest("GET", "/api/user/reports"),
    enabled: !!user,
    staleTime: 60000,
  })

  // Submit a new report
  const submitReportMutation = useMutation({
    mutationFn: async (reportData: InsertReport) => {
      if (navigator.onLine) {
        return await apiRequest("POST", "/api/reports", reportData)
      } else {
        await saveOfflineReport({ reportData })
        throw new Error("You're offline. Report saved and will be submitted when you're back online.")
      }
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for your report. It has been submitted successfully.",
      })
    },
    onError: (error: Error) => {
      if (error.message.includes("offline")) {
        toast({
          title: "Saved offline",
          description: "Your report has been saved and will be submitted when you're back online.",
        })
      } else {
        toast({
          title: "Failed to submit report",
          description: error.message,
          variant: "destructive",
        })
      }
    },
  })

  // Update report status
  const updateReportStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/reports/${id}/status`, { status })
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The report status has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  useEffect(() => {
    const handleOnline = () => {
      syncOfflineReports().catch((error) => {
        console.error("Failed to sync offline reports:", error)
      })
    }

    window.addEventListener("online", handleOnline)
    return () => window.removeEventListener("online", handleOnline)
  }, [syncOfflineReports])

  return (
    <ReportsContext.Provider
      value={{
        reports,
        userReports,
        isLoading: isLoadingReports,
        activeReport,
        setActiveReport,
        submitReportMutation,
        updateReportStatusMutation,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export const useReports = () => {
  const context = useContext(ReportsContext)
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider")
  }
  return context
}
