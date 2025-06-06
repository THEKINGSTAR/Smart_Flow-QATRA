"use client"

import { useState } from "react"
import { useReports } from "@/hooks/use-reports"
import { useAuth } from "@/hooks/use-auth"
import { OfflineStorageProvider } from "@/hooks/use-offline-storage"
import { ReportsProvider } from "@/hooks/use-reports"
import Header from "@/components/layout/Header"
import MobileNavigation from "@/components/layout/MobileNavigation"
import ReportModal from "@/components/reports/ReportModal"
import type { InsertReport, Report } from "@shared/schema"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Map } from "lucide-react"

function ReportCard({ report }: { report: Report }) {
  // Format date
  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get severity badge variant
  const getSeverityBadge = () => {
    switch (report.severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "moderate":
        return (
          <Badge variant="default" className="bg-warning-500 text-white">
            Moderate
          </Badge>
        )
      case "minor":
        return <Badge variant="default">Minor</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (report.status) {
      case "resolved":
        return (
          <Badge variant="outline" className="bg-success-500 text-white">
            Resolved
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-secondary-500 text-white">
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-neutral-500 text-white">
            Pending
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-heading">{report.title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <i className="ri-map-pin-line mr-1"></i>
          <span>{report.address}</span>
        </div>

        <p className="text-sm mb-3">{report.description}</p>

        {report.photos && report.photos.length > 0 && (
          <div className="flex -mx-1 overflow-x-auto pb-2 mb-2">
            {report.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Report photo ${index + 1}`}
                className="h-16 w-16 object-cover rounded mx-1"
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {getSeverityBadge()}
          <Badge variant="outline" className="text-neutral-600">
            <i className="ri-time-line mr-1"></i>
            {formatDate(report.createdAt)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="gap-1">
          <i className="ri-map-pin-line"></i>
          <span>View on Map</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

function MyReportsContent() {
  const { user } = useAuth()
  const { userReports, submitReportMutation } = useReports()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  // Filter reports by status
  const pendingReports = userReports.filter((r) => r.status === "pending")
  const inProgressReports = userReports.filter((r) => r.status === "in-progress")
  const resolvedReports = userReports.filter((r) => r.status === "resolved")

  const handleAddReport = () => {
    setIsReportModalOpen(true)
  }

  const handleSubmitReport = (data: InsertReport) => {
    submitReportMutation.mutate(data, {
      onSuccess: () => {
        setIsReportModalOpen(false)
      },
    })
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-heading text-neutral-900">My Reports</h1>
          <Button onClick={handleAddReport}>
            <i className="ri-add-line mr-2"></i>
            New Report
          </Button>
        </div>

        {userReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex justify-center mb-4">
              <Map className="h-16 w-16 text-neutral-300" />
            </div>
            <h2 className="text-xl font-medium font-heading mb-2">No Reports Yet</h2>
            <p className="text-neutral-600 mb-6">
              You haven't submitted any water leak reports yet. Help your community by reporting leaks when you find
              them.
            </p>
            <Button onClick={handleAddReport}>
              <i className="ri-add-line mr-2"></i>
              Report a Leak
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({userReports.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({inProgressReports.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedReports.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {userReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              {pendingReports.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">No pending reports</p>
              ) : (
                pendingReports.map((report) => <ReportCard key={report.id} report={report} />)
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="mt-0">
              {inProgressReports.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">No in-progress reports</p>
              ) : (
                inProgressReports.map((report) => <ReportCard key={report.id} report={report} />)
              )}
            </TabsContent>

            <TabsContent value="resolved" className="mt-0">
              {resolvedReports.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">No resolved reports</p>
              ) : (
                resolvedReports.map((report) => <ReportCard key={report.id} report={report} />)
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>

      <MobileNavigation onAddReport={handleAddReport} />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        loading={submitReportMutation.isPending}
      />
    </div>
  )
}

export default function MyReportsPage() {
  return (
    <OfflineStorageProvider>
      <ReportsProvider>
        <MyReportsContent />
      </ReportsProvider>
    </OfflineStorageProvider>
  )
}
