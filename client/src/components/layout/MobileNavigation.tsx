"use client"

import { useLocation, Link } from "wouter"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

export default function MobileNavigation() {
  const [location] = useLocation()
  const { user } = useAuth()

  const isActive = (path: string) => {
    return location === path
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/map"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/map") ? "text-teal-600" : "text-gray-500",
            )}
          >
            <i className={cn("ri-map-pin-line text-xl", isActive("/map") ? "text-teal-600" : "text-gray-500")}></i>
            <span>Map</span>
          </Link>

          <Link
            href="/my-reports"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/my-reports") ? "text-teal-600" : "text-gray-500",
            )}
          >
            <i
              className={cn(
                "ri-file-list-3-line text-xl",
                isActive("/my-reports") ? "text-teal-600" : "text-gray-500",
              )}
            ></i>
            <span>My Reports</span>
          </Link>

          <Link
            href="/ai-assistant"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/ai-assistant") ? "text-teal-600" : "text-gray-500",
            )}
          >
            <i
              className={cn(
                "ri-robot-line text-xl",
                isActive("/ai-assistant") ? "text-teal-600" : "text-gray-500",
              )}
            ></i>
            <span>AI Assistant</span>
          </Link>

          <Link
            href="/learn"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs",
              isActive("/learn") ? "text-teal-600" : "text-gray-500",
            )}
          >
            <i className={cn("ri-book-open-line text-xl", isActive("/learn") ? "text-teal-600" : "text-gray-500")}></i>
            <span>Learn</span>
          </Link>

          {user ? (
            <Link
              href="/achievements"
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive("/achievements") ? "text-teal-600" : "text-gray-500",
              )}
            >
              <i
                className={cn(
                  "ri-award-line text-xl",
                  isActive("/achievements") ? "text-teal-600" : "text-gray-500",
                )}
              ></i>
              <span>Rewards</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs",
                isActive("/auth") ? "text-teal-600" : "text-gray-500",
              )}
            >
              <i className={cn("ri-user-line text-xl", isActive("/auth") ? "text-teal-600" : "text-gray-500")}></i>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
