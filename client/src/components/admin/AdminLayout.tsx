"use client"

import type React from "react"

import type { ReactNode } from "react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { LayoutDashboard, FileText, Users, Map, BarChart, LogOut, Settings, Bell, Brain } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return location === path
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link href="/admin/dashboard" className="flex items-center">
            <i className="ri-droplet-fill text-2xl text-teal-600 mr-2"></i>
            <span className="font-bold text-xl">SmartFlow</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1">
          <Link href="/admin/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/admin/dashboard") && "bg-gray-100 text-teal-600 hover:bg-gray-200",
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>

          <Link href="/admin/reports">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/admin/reports") && "bg-gray-100 text-teal-600 hover:bg-gray-200",
              )}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </Link>

          <Link href="/admin/teams">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/admin/teams") && "bg-gray-100 text-teal-600 hover:bg-gray-200",
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Teams
            </Button>
          </Link>

          <Link href="/admin/zones">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/admin/zones") && "bg-gray-100 text-teal-600 hover:bg-gray-200",
              )}
            >
              <Map className="h-4 w-4 mr-2" />
              Zones
            </Button>
          </Link>

          <Link href="/admin/analytics">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/admin/analytics") && "bg-gray-100 text-teal-600 hover:bg-gray-200",
              )}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>

          <Link href="/admin/ai-insights">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isActive("/admin/ai-insights") && "bg-gray-100 text-teal-600 hover:bg-gray-200",
              )}
            >
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
          </Link>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center">
            <i className="ri-droplet-fill text-2xl text-teal-600 mr-2"></i>
            <span className="font-bold text-xl">SmartFlow</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t">
        <div className="flex justify-around items-center h-16">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="flex flex-col items-center h-full py-1">
              <LayoutDashboard className="h-5 w-5" />
              <span className="text-xs mt-1">Dashboard</span>
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button variant="ghost" size="icon" className="flex flex-col items-center h-full py-1">
              <FileText className="h-5 w-5" />
              <span className="text-xs mt-1">Reports</span>
            </Button>
          </Link>
          <Link href="/admin/teams">
            <Button variant="ghost" size="icon" className="flex flex-col items-center h-full py-1">
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Teams</span>
            </Button>
          </Link>
          <Link href="/admin/ai-insights">
            <Button variant="ghost" size="icon" className="flex flex-col items-center h-full py-1">
              <Brain className="h-5 w-5" />
              <span className="text-xs mt-1">AI</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 pb-20 md:pb-8 overflow-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
