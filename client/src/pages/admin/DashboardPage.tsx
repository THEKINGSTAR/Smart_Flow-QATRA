import type React from "react"
import { Link } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  MapPinIcon,
  AlertCircleIcon,
  DropletIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  WrenchIcon,
  ActivityIcon,
  ShieldIcon,
  FolderIcon,
  ChevronRightIcon,
} from "lucide-react"

export function DashboardPage() {
  // Define the dashboard stats type
  interface DashboardStats {
    totalReports: number
    pendingReports: number
    resolvedReports: number
    criticalReports: number
  }

  // Fetch data from API
  const { data: dashboardStats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard"],
  })

  // Default stats when data is not available
  const stats = dashboardStats || {
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    criticalReports: 0,
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SmartFlow Dashboard</h1>
          <p className="text-muted-foreground">Water leak management system overview</p>
        </div>

        <div className="space-x-2">
          <Button variant="outline" className="bg-white">
            <ActivityIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <ShieldIcon className="h-4 w-4 mr-2" />
            Admin Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+16%</span> since last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-500 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-amber-500">+5</span> new today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-500 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+8</span> in the last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500 flex items-center">
              <AlertCircleIcon className="h-4 w-4 mr-1" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500">2</span> require immediate action
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Urgent Reports</CardTitle>
            <CardDescription>Critical issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-100 rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-red-900 flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-1" />
                      Main Pipeline Rupture
                    </h3>
                    <p className="text-sm text-red-700">Downtown District, 123 Main Street</p>
                  </div>
                  <Link href="/admin/reports/1">
                    <Button variant="destructive" size="sm">
                      View Report
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Response Priority</span>
                    <span className="font-medium text-red-700">Critical - 1 hour</span>
                  </div>
                  <Progress
                    value={85}
                    className="h-2 bg-red-100"
                    style={{ "--tw-progress-fill": "rgb(220 38 38)" } as React.CSSProperties}
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Reported: 43 minutes ago</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Assigned to Team C</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-orange-900 flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-1" />
                      Hydrant Damage
                    </h3>
                    <p className="text-sm text-orange-700">East Side, 456 Oak Avenue</p>
                  </div>
                  <Link href="/admin/reports/2">
                    <Button className="bg-orange-600 hover:bg-orange-700" size="sm">
                      View Report
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Response Priority</span>
                    <span className="font-medium text-orange-700">High - 4 hours</span>
                  </div>
                  <Progress
                    value={65}
                    className="h-2 bg-orange-100"
                    style={{ "--tw-progress-fill": "rgb(234 88 12)" } as React.CSSProperties}
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Reported: 1 hour ago</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Unassigned</span>
                  </div>
                </div>
              </div>

              <Link
                href="/admin/reports"
                className="flex items-center justify-center text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View All Reports
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Resource Allocation</CardTitle>
            <CardDescription>Team assignments and workload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm font-medium">Team A (North)</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Available</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">Workload: 65%</div>
                <Progress value={65} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1 text-indigo-500" />
                    <span className="text-sm font-medium">Team B (South)</span>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">On Route</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">Workload: 85%</div>
                <Progress value={85} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1 text-teal-500" />
                    <span className="text-sm font-medium">Team C (East)</span>
                  </div>
                  <span className="text-xs text-red-600 font-medium">Busy</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">Workload: 90%</div>
                <Progress value={90} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1 text-amber-500" />
                    <span className="text-sm font-medium">Team D (West)</span>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Available</span>
                </div>
                <div className="text-xs text-gray-500 mb-1.5">Workload: 30%</div>
                <Progress value={30} className="h-2" />
              </div>

              <Link
                href="/admin/teams"
                className="flex items-center justify-center text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
              >
                Manage Teams
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-teal-500" />
              Zones Overview
            </CardTitle>
            <CardDescription>Report distribution by zone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Downtown District</span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Critical</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>12 active reports</span>
                  <span>45% of total</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Residential North</span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">High</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>8 active reports</span>
                  <span>30% of total</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Industrial Zone</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Medium</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>5 active reports</span>
                  <span>15% of total</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">West Community</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Low</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>2 active reports</span>
                  <span>10% of total</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>

              <Link
                href="/admin/zones"
                className="flex items-center justify-center text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
              >
                Manage Zones
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-500" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Response times and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="text-sm font-medium text-teal-600">6.4 hrs</span>
                </div>
                <div className="text-xs text-gray-500">-12% from last month</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Resolution Rate</span>
                  <span className="text-sm font-medium text-teal-600">76%</span>
                </div>
                <div className="text-xs text-gray-500">+4% from last month</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Resource Utilization</span>
                  <span className="text-sm font-medium text-amber-600">82%</span>
                </div>
                <div className="text-xs text-gray-500">High efficiency detected</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Savings</span>
                  <span className="text-sm font-medium text-green-600">32,450 gal</span>
                </div>
                <div className="text-xs text-gray-500">Estimated from fixed leaks</div>
              </div>

              <Link
                href="/admin/analytics"
                className="flex items-center justify-center text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
              >
                View Analytics
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <DropletIcon className="h-5 w-5 mr-2 text-purple-500" />
              Water Conservation
            </CardTitle>
            <CardDescription>Impact metrics and savings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-md p-4 text-center">
                <div className="text-3xl font-bold text-purple-700">32,450</div>
                <div className="text-sm text-purple-600">Gallons Saved</div>
                <div className="text-xs text-gray-500 mt-1">Estimated from leak repairs</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-md p-3 text-center">
                  <div className="text-xl font-bold text-blue-700">$4,230</div>
                  <div className="text-xs text-blue-600">Cost Savings</div>
                </div>

                <div className="bg-teal-50 rounded-md p-3 text-center">
                  <div className="text-xl font-bold text-teal-700">43</div>
                  <div className="text-xs text-teal-600">Leaks Fixed</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-3">
                <div className="text-sm font-medium mb-2">Monthly Trend</div>
                <div className="h-16 flex items-end justify-between space-x-1">
                  <div className="w-1/6 bg-teal-100 rounded-t" style={{ height: "30%" }}></div>
                  <div className="w-1/6 bg-teal-200 rounded-t" style={{ height: "50%" }}></div>
                  <div className="w-1/6 bg-teal-300 rounded-t" style={{ height: "40%" }}></div>
                  <div className="w-1/6 bg-teal-400 rounded-t" style={{ height: "70%" }}></div>
                  <div className="w-1/6 bg-teal-500 rounded-t" style={{ height: "60%" }}></div>
                  <div className="w-1/6 bg-teal-600 rounded-t" style={{ height: "90%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <WrenchIcon className="h-5 w-5 mr-2 text-amber-500" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Report #45 resolved</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Team B fixed water main leak at 123 Oak Street</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UsersIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Team assignment</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Team C assigned to critical leak report #52</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 p-2 rounded-full">
                  <AlertCircleIcon className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">New leak report</span>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600">High severity leak reported at 456 Main Street</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-teal-100 p-2 rounded-full">
                  <MapPinIcon className="h-4 w-4 text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Zone priority updated</span>
                    <span className="text-xs text-gray-500">5 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600">Downtown District priority increased to Critical</p>
                </div>
              </div>

              <Link
                href="#"
                className="flex items-center justify-center text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
              >
                View All Activities
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center">
              <FolderIcon className="h-5 w-5 mr-2 text-orange-500" />
              Quick Access
            </CardTitle>
            <CardDescription>Frequently used tools and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircleIcon className="h-4 w-4 mr-2 text-red-500" />
                  Manage Reports
                </Button>
              </Link>

              <Link href="/admin/teams">
                <Button variant="outline" className="w-full justify-start">
                  <UsersIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Team Management
                </Button>
              </Link>

              <Link href="/admin/zones">
                <Button variant="outline" className="w-full justify-start">
                  <MapPinIcon className="h-4 w-4 mr-2 text-teal-500" />
                  Zone Settings
                </Button>
              </Link>

              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUpIcon className="h-4 w-4 mr-2 text-purple-500" />
                  Analytics Dashboard
                </Button>
              </Link>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium mb-2">System Status</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">API Services</span>
                    </div>
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Notification System</span>
                    </div>
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Database</span>
                    </div>
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
