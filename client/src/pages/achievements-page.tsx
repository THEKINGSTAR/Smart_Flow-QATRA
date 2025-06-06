"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useQuery } from "@tanstack/react-query"
import type { Achievement } from "@shared/schema"
import Header from "@/components/layout/Header"
import MobileNavigation from "@/components/layout/MobileNavigation"
import ReportModal from "@/components/reports/ReportModal"
import { OfflineStorageProvider } from "@/hooks/use-offline-storage"
import { ReportsProvider, useReports } from "@/hooks/use-reports"
import type { InsertReport } from "@shared/schema"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface AchievementCardProps {
  achievement: Achievement
  earned: boolean
  progress: number
}

function AchievementCard({ achievement, earned, progress }: AchievementCardProps) {
  return (
    <Card className={earned ? "border-primary-500" : "opacity-70"}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-heading">{achievement.name}</CardTitle>
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${earned ? "bg-primary-100 text-primary-600" : "bg-neutral-100 text-neutral-400"}`}
          >
            <i className={`${achievement.icon} text-xl`}></i>
          </div>
        </div>
        <CardDescription>{achievement.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {progress} / {achievement.pointsRequired} points
            </span>
          </div>
          <Progress value={(progress / achievement.pointsRequired) * 100} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
          {earned ? (
            <span className="text-success-500 font-medium">
              <i className="ri-check-line mr-1"></i>
              Earned
            </span>
          ) : (
            <span className="text-neutral-500">
              <i className="ri-lock-line mr-1"></i>
              {achievement.pointsRequired - progress} points to unlock
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function AchievementsPageContent() {
  const { user } = useAuth()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const { submitReportMutation } = useReports()

  // Get achievements
  const { data: achievements = [], isLoading: isLoadingAchievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  })

  // Get user's earned achievements if logged in
  const { data: userAchievements = [], isLoading: isLoadingUserAchievements } = useQuery<Achievement[]>({
    queryKey: ["/api/user/achievements"],
    enabled: !!user,
  })

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

  const calculateProgress = (achievement: Achievement) => {
    if (!user) return 0

    // Check if user has earned this achievement
    const earned = userAchievements.some((a) => a.id === achievement.id)
    if (earned) return achievement.pointsRequired

    // Otherwise return their current points or 0
    return Math.min(user.points || 0, achievement.pointsRequired)
  }

  const isLoading = isLoadingAchievements || (user && isLoadingUserAchievements)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-neutral-900">Achievements</h1>
          <p className="text-neutral-600 mt-2">
            Track your progress and earn badges for your contribution to water conservation
          </p>
        </div>

        {/* User Stats Card */}
        {user && (
          <Card className="mb-8 bg-primary-50 border-primary-100">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold font-heading">
                      {user.username.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-heading">{user.username}</h2>
                    <p className="text-primary-700">
                      <i className="ri-medal-line mr-1"></i>
                      {userAchievements.length} achievements earned
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-primary-700">{user.points || 0}</span>
                    <span className="ml-1 text-neutral-600">points</span>
                  </div>
                  <p className="text-sm text-neutral-500">Keep reporting to earn more!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const earned = userAchievements.some((a) => a.id === achievement.id)
              const progress = calculateProgress(achievement)

              return (
                <AchievementCard key={achievement.id} achievement={achievement} earned={earned} progress={progress} />
              )
            })}
          </div>
        )}

        {!user && (
          <div className="mt-10 text-center">
            <p className="text-neutral-600 mb-4">Sign in to track your achievements and earn points</p>
            <a
              href="/auth"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign In
            </a>
          </div>
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

export default function AchievementsPage() {
  return (
    <OfflineStorageProvider>
      <ReportsProvider>
        <AchievementsPageContent />
      </ReportsProvider>
    </OfflineStorageProvider>
  )
}
