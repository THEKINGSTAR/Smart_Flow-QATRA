"use client"
import { useState } from "react"
import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

// Inline type definitions instead of importing from @shared/schema
interface Notification {
  id: number
  message: string
  read: boolean
  createdAt: Date
}

export default function Header() {
  const [location] = useLocation()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location === path
  }

  // Get user notifications if logged in
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/user/notifications"],
    enabled: !!user,
  })

  // Filter for unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <i className="ri-droplet-fill text-2xl text-teal-600 mr-2"></i>
            <span className="font-bold text-xl">SmartFlow</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4 ml-10">
            <Link
              href="/map"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/map") ? "text-teal-600" : "text-foreground",
              )}
            >
              Map
            </Link>
            <Link
              href="/my-reports"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/my-reports") ? "text-teal-600" : "text-foreground",
              )}
            >
              My Reports
            </Link>
            <Link
              href="/ai-assistant"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/ai-assistant") ? "text-teal-600" : "text-foreground",
              )}
            >
              AI Assistant
            </Link>
            <Link
              href="/learn"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/learn") ? "text-teal-600" : "text-foreground",
              )}
            >
              Learn
            </Link>
            {user && (
              <Link
                href="/achievements"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-teal-600",
                  isActive("/achievements") ? "text-teal-600" : "text-foreground",
                )}
              >
                Achievements
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/my-reports" className="w-full">
                    My Reports
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/achievements" className="w-full">
                    Achievements
                  </Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem>
                    <Link href="/admin/dashboard" className="w-full">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          <Button className="hidden md:flex" asChild>
            <Link href="/map?report=new">Report Leak</Link>
          </Button>

          <button
            className="md:hidden text-gray-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`ri-${isMenuOpen ? "close" : "menu"}-line text-2xl`}></i>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/map"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/map") ? "text-teal-600" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Map
            </Link>
            <Link
              href="/my-reports"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/my-reports") ? "text-teal-600" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              My Reports
            </Link>
            <Link
              href="/ai-assistant"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/ai-assistant") ? "text-teal-600" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              AI Assistant
            </Link>
            <Link
              href="/learn"
              className={cn(
                "text-sm font-medium transition-colors hover:text-teal-600",
                isActive("/learn") ? "text-teal-600" : "text-foreground",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Learn
            </Link>
            {user && (
              <Link
                href="/achievements"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-teal-600",
                  isActive("/achievements") ? "text-teal-600" : "text-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Achievements
              </Link>
            )}
            <Link href="/map?report=new" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full">Report Leak</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
