import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  BarChart4, 
  LayoutDashboard, 
  Map, 
  Users, 
  FileText, 
  Settings, 
  PinIcon,
  LogOut, 
  Menu, 
  X, 
  AlertTriangle,
  DropletIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Zones", href: "/admin/zones", icon: Map },
    { name: "Teams", href: "/admin/teams", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart4 },
    { name: "Priority Areas", href: "/admin/priority", icon: PinIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="border-b px-4 py-6 flex items-center">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="bg-teal-100 p-2 rounded-md">
                <DropletIcon className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <div className="font-bold text-lg">SmartFlow</div>
                <div className="text-xs text-gray-500">Admin Dashboard</div>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-5 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-teal-100 text-teal-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-teal-600" : "text-gray-500")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sidebar footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-teal-100 text-teal-700">AD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <Link href="/">
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4 lg:ml-auto">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <span className="hidden sm:inline mr-1">Return to</span> Main App
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Alert banner (optional) */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-amber-700 text-sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span>There are 2 critical reports that require immediate attention.</span>
            </div>
            <Button variant="link" size="sm" className="text-amber-700">
              View Details
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t py-4 px-6">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SmartFlow Water Management Platform. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}