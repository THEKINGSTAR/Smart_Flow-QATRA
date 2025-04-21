import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Map,
  Users,
  ClipboardList,
  AlertTriangle,
  BarChart4,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logoutMutation } = useAuth();
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true
    },
    {
      title: "Zone Map",
      href: "/admin/zones",
      icon: Map
    },
    {
      title: "Teams",
      href: "/admin/teams",
      icon: Users
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: ClipboardList
    },
    {
      title: "High Priority",
      href: "/admin/priority",
      icon: AlertTriangle
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart4
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-30">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <a className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-gray-900">SmartFlow</span>
                <span className="text-sm text-gray-500 ml-2 mt-1">Admin</span>
              </a>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
            collapsed ? "w-16" : "w-64"
          )}
        >
          <div className="p-4 flex flex-col h-full">
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? location === item.href 
                  : location.startsWith(item.href);
                
                return (
                  <TooltipProvider key={item.href} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>
                          <a
                            className={cn(
                              "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
                              isActive
                                ? "bg-teal-50 text-teal-700 font-medium"
                                : "text-gray-600 hover:text-teal-700 hover:bg-gray-50"
                            )}
                          >
                            <item.icon className={cn(
                              "h-5 w-5",
                              collapsed ? "mx-auto" : "mr-2"
                            )} />
                            {!collapsed && <span>{item.title}</span>}
                          </a>
                        </Link>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 hover:text-teal-700 hover:bg-gray-50"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <div className="flex items-center">
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    <span>Collapse</span>
                  </div>
                )}
              </Button>
              
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start",
                      )}
                      onClick={() => {
                        logoutMutation.mutate();
                        window.location.href = "/";
                      }}
                    >
                      <LogOut className={cn(
                        "h-5 w-5",
                        collapsed ? "mx-auto" : "mr-2"
                      )} />
                      {!collapsed && <span>Log out</span>}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      Log out
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}