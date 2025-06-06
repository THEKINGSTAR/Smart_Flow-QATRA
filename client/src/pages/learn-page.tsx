"use client"

import Header from "@/components/layout/Header"
import MobileNavigation from "@/components/layout/MobileNavigation"
import { useQuery } from "@tanstack/react-query"
import type { Tip } from "@shared/schema"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import ReportModal from "@/components/reports/ReportModal"
import { OfflineStorageProvider } from "@/hooks/use-offline-storage"
import { ReportsProvider, useReports } from "@/hooks/use-reports"
import type { InsertReport } from "@shared/schema"

function WaterConservationTips() {
  const { data: tips = [], isLoading } = useQuery<Tip[]>({
    queryKey: ["/api/tips"],
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-heading">Water Conservation Tips</h2>
      <p className="text-neutral-600">Learn simple ways to save water and help prevent waste in your community.</p>

      <Accordion type="single" collapsible className="w-full">
        {tips.map((tip) => (
          <AccordionItem key={tip.id} value={`tip-${tip.id}`}>
            <AccordionTrigger className="font-medium">{tip.title}</AccordionTrigger>
            <AccordionContent>
              <p className="py-2">{tip.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function LeakIdentificationGuide() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-heading">How to Identify Water Leaks</h2>
      <p className="text-neutral-600">Learn to spot different types of water leaks and understand their severity.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Minor Leaks</CardTitle>
            <CardDescription>Low urgency, minimal water loss</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Dripping faucets or fixtures</li>
              <li>Small damp spots on walls or ceilings</li>
              <li>Slight moisture around pipe connections</li>
              <li>Small puddles that evaporate quickly</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Moderate Leaks</CardTitle>
            <CardDescription>Medium urgency, noticeable water loss</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Constantly running toilets</li>
              <li>Visible water on sidewalks or roads</li>
              <li>Water meter spinning when no water is in use</li>
              <li>Damp or soft spots in yards</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Critical Leaks</CardTitle>
            <CardDescription>High urgency, significant water loss</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Gushing water from pipes or fixtures</li>
              <li>Flooded areas or standing water</li>
              <li>Water flowing rapidly into storm drains</li>
              <li>Sudden drop in water pressure</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hidden Leaks</CardTitle>
            <CardDescription>Can be any severity, difficult to detect</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Unexplained increase in water bills</li>
              <li>Sound of running water when taps are off</li>
              <li>Mold or mildew growth in unusual places</li>
              <li>Warm spots on floors (for hot water pipes)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function WaterImpactSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold font-heading">Impact of Water Leaks</h2>
      <p className="text-neutral-600">Understanding the environmental and economic effects of water waste.</p>

      <div className="bg-primary-50 rounded-lg p-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-primary-700 text-3xl font-bold mb-2">10%</div>
            <p className="text-neutral-700 text-sm">Of homes have leaks that waste 90+ gallons per day</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-primary-700 text-3xl font-bold mb-2">10,000</div>
            <p className="text-neutral-700 text-sm">Gallons wasted annually by household leaks</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-primary-700 text-3xl font-bold mb-2">$500</div>
            <p className="text-neutral-700 text-sm">Average annual savings by fixing water leaks</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-primary-700 text-3xl font-bold mb-2">1 Trillion</div>
            <p className="text-neutral-700 text-sm">Gallons of water wasted in US annually from leaks</p>
          </div>
        </div>

        <div className="mt-6 text-sm text-neutral-600">
          <p>
            Water leaks not only waste a precious resource but also contribute to property damage, increased utility
            bills, and infrastructure strain. By reporting and fixing leaks promptly, you're helping conserve water for
            future generations.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" className="gap-2">
          <i className="ri-add-line"></i>
          <span>Report a Leak Now</span>
        </Button>
      </div>
    </div>
  )
}

function LearnPageContent() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const { submitReportMutation } = useReports()

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

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-neutral-900">
            Learn About Water Conservation
          </h1>
          <p className="text-neutral-600 mt-2">
            Discover how to identify leaks, their impact, and ways to help conserve water.
          </p>
        </div>

        <Tabs defaultValue="tips" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tips">Water Tips</TabsTrigger>
            <TabsTrigger value="identify">Identify Leaks</TabsTrigger>
            <TabsTrigger value="impact">Water Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="tips" className="mt-6">
            <WaterConservationTips />
          </TabsContent>

          <TabsContent value="identify" className="mt-6">
            <LeakIdentificationGuide />
          </TabsContent>

          <TabsContent value="impact" className="mt-6">
            <WaterImpactSection />
          </TabsContent>
        </Tabs>
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

export default function LearnPage() {
  return (
    <OfflineStorageProvider>
      <ReportsProvider>
        <LearnPageContent />
      </ReportsProvider>
    </OfflineStorageProvider>
  )
}
