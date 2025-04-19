import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Notification } from "@shared/schema";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Get user notifications if logged in
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/user/notifications"],
    enabled: !!user,
  });
  
  // Filter for unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link href="/">
            <a className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-2">
                <i className="ri-droplet-fill text-xl"></i>
              </div>
              <h1 className="text-xl font-heading font-semibold text-primary-700">SmartFlow</h1>
            </a>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link href="/">
                <a className={`${location === "/" ? "text-primary-700 font-medium" : "text-neutral-600 hover:text-primary-700"}`}>
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link href="/map">
                <a className={`${location === "/map" ? "text-primary-700 font-medium" : "text-neutral-600 hover:text-primary-700"}`}>
                  Map
                </a>
              </Link>
            </li>
            <li>
              <Link href="/my-reports">
                <a className={`${location === "/my-reports" ? "text-primary-700 font-medium" : "text-neutral-600 hover:text-primary-700"}`}>
                  My Reports
                </a>
              </Link>
            </li>
            <li>
              <Link href="/learn">
                <a className={`${location === "/learn" ? "text-primary-700 font-medium" : "text-neutral-600 hover:text-primary-700"}`}>
                  Learn
                </a>
              </Link>
            </li>
            <li>
              <Link href="/achievements">
                <a className={`${location === "/achievements" ? "text-primary-700 font-medium" : "text-neutral-600 hover:text-primary-700"}`}>
                  Achievements
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* User Menu */}
        <div className="flex items-center">
          {user ? (
            <>
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative mr-4">
                        <i className="ri-notification-3-line text-xl text-neutral-600"></i>
                        {unreadNotifications.length > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary-500 text-white rounded-full">
                            {unreadNotifications.length}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="w-80">
                  {notifications.length === 0 ? (
                    <div className="py-3 px-2 text-neutral-500 text-center">
                      No notifications
                    </div>
                  ) : (
                    <>
                      {notifications.slice(0, 5).map((notification) => (
                        <DropdownMenuItem key={notification.id} className={`py-2 px-3 ${!notification.read ? 'bg-primary-50' : ''}`}>
                          <div className="flex flex-col">
                            <div className="text-sm">{notification.content}</div>
                            <div className="text-xs text-neutral-500 mt-1">
                              {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Unknown date'} 
                              {notification.createdAt ? ` at ${new Date(notification.createdAt).toLocaleTimeString()}` : ''}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      {notifications.length > 5 && (
                        <DropdownMenuItem className="text-center text-primary-600 hover:text-primary-700">
                          View all notifications
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/my-reports">
                      <a className="w-full">My Reports</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/achievements">
                      <a className="w-full">My Achievements</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth">
                <a>Sign In</a>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
