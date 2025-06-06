import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart4, TrendingUpIcon, MapIcon, CalendarIcon } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-muted-foreground">Metrics and insights on water leakage patterns</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Overview Metrics</CardTitle>
            <Select defaultValue="month">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Total Reports" value="156" change="+12%" trend="up" description="vs. previous period" />
            <MetricCard title="Resolution Rate" value="84%" change="+5%" trend="up" description="vs. previous period" />
            <MetricCard
              title="Avg. Response Time"
              value="6.2 hrs"
              change="-8%"
              trend="up"
              description="vs. previous period"
            />
            <MetricCard
              title="Water Saved (est.)"
              value="32,450 gal"
              change="+15%"
              trend="up"
              description="vs. previous period"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trends" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="trends">Report Trends</TabsTrigger>
          <TabsTrigger value="heatmap">Geographic Distribution</TabsTrigger>
          <TabsTrigger value="performance">Team Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUpIcon className="h-5 w-5 mr-2 text-blue-500" />
                Report Volume Trends
              </CardTitle>
              <CardDescription>Report submissions over time across severity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-gray-50 rounded-md border p-4 flex items-center justify-center">
                <div className="text-center">
                  <BarChart4 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Report trend chart visualization will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Showing report volumes by day/week/month with severity breakdown
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <MapIcon className="h-5 w-5 mr-2 text-teal-500" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Heat map of leak report concentration by area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-gray-50 rounded-md border p-4 flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Heat map visualization will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-1">Showing concentration of reports across geographic areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
                Team Performance Metrics
              </CardTitle>
              <CardDescription>Efficiency and resolution statistics by team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-gray-50 rounded-md border p-4 flex items-center justify-center">
                <div className="text-center">
                  <BarChart4 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Team performance chart will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-1">Comparing resolution times and efficiency across teams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Report Sources</CardTitle>
            <CardDescription>Breakdown of how reports are being submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                  <span>Mobile App</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-blue-500 h-full" style={{ width: "65%" }}></div>
                  </div>
                  <span className="text-sm">65%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-teal-500 mr-2"></div>
                  <span>Web Interface</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-teal-500 h-full" style={{ width: "25%" }}></div>
                  </div>
                  <span className="text-sm">25%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                  <span>Phone Call</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-purple-500 h-full" style={{ width: "10%" }}></div>
                  </div>
                  <span className="text-sm">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Report Categories</CardTitle>
            <CardDescription>Types of water leak issues reported</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                  <span>Broken Main</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-red-500 h-full" style={{ width: "28%" }}></div>
                  </div>
                  <span className="text-sm">28%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-amber-500 mr-2"></div>
                  <span>Street Flooding</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-amber-500 h-full" style={{ width: "35%" }}></div>
                  </div>
                  <span className="text-sm">35%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span>Meter Leak</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-green-500 h-full" style={{ width: "15%" }}></div>
                  </div>
                  <span className="text-sm">15%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-indigo-500 mr-2"></div>
                  <span>Other</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                    <div className="bg-indigo-500 h-full" style={{ width: "22%" }}></div>
                  </div>
                  <span className="text-sm">22%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
}

function MetricCard({ title, value, change, trend, description }: MetricCardProps) {
  return (
    <div className="bg-gray-50 rounded-md p-4 border">
      <div className="text-sm font-medium text-muted-foreground mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className={`flex items-center text-xs mt-1 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
        {change}
        {trend === "up" ? (
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 ml-1">
            <path
              d="M12 6V18M12 6L18 12M12 6L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 ml-1">
            <path
              d="M12 18V6M12 18L18 12M12 18L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span className="text-muted-foreground ml-1">{description}</span>
      </div>
    </div>
  )
}
