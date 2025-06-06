"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import MobileNavigation from "@/components/layout/MobileNavigation"
import LeakageMap from "@/components/map/LeakageMap"
import ReportModal from "@/components/reports/ReportModal"
import EducationalTip from "@/components/tips/EducationalTip"
import type { InsertReport } from "@shared/schema"
import { ReportsProvider, useReports } from "@/hooks/use-reports"
import { OfflineStorageProvider } from "@/hooks/use-offline-storage"

function MapPageContent() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const { reports, activeReport, setActiveReport, submitReportMutation } = useReports()

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow relative">
        <LeakageMap
          reports={reports}
          activeReport={activeReport}
          setActiveReport={setActiveReport}
          onAddReport={handleAddReport}
        />
      </main>

      <MobileNavigation onAddReport={handleAddReport} />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        loading={submitReportMutation.isPending}
      />

      <EducationalTip />
    </div>
  )
}

export default function MapPage() {
  return (
    <OfflineStorageProvider>
      <ReportsProvider>
        <MapPageContent />
      </ReportsProvider>
    </OfflineStorageProvider>
  )
}
