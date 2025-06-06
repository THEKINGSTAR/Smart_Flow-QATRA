"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw,
  Lightbulb,
  Droplet,
  MapPin,
  Brain,
  LineChart,
  PieChart,
  Zap,
  Clock,
  Settings,
} from "lucide-react"

export default function AdminAiInsights() {
  const [period, setPeriod] = useState("month")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
          <p className="text-muted-foreground">AI-powered analytics and predictions for water leak management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Insights
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="strategic">Strategic</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select defaultValue="month" onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value="predictions" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-blue-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                Leak Prediction Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">+3% from previous period</p>
              <div className="mt-3 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: "92%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-amber-600">
                <AlertTriangle className="mr-1 h-4 w-4" />
                Predicted Critical Leaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
              <div className="mt-3 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: "70%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-green-600">
                <Zap className="mr-1 h-4 w-4" />
                Preventive Action Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">Reduction in emergency repairs</p>
              <div className="mt-3 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full" style={{ width: "68%" }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-blue-600" />
              Predictive Leak Analysis
            </CardTitle>
            <CardDescription>AI-powered predictions of potential leak locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-red-600" />
                      <span className="font-medium">Downtown District</span>
                    </div>
                    <Badge variant="destructive">High Risk</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction confidence:</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Aging infrastructure and high pressure detected. Recommended inspection within 7 days.
                    </p>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                      <span className="font-medium">North Residential Area</span>
                    </div>
                    <Badge className="bg-amber-500">Medium Risk</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction confidence:</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Seasonal pressure fluctuations detected. Schedule routine inspection within 14 days.
                    </p>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-amber-600" />
                      <span className="font-medium">Industrial Zone</span>
                    </div>
                    <Badge className="bg-amber-500">Medium Risk</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction confidence:</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Unusual flow patterns detected during off-hours. Recommend night-time inspection.
                    </p>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      <span className="font-medium">West Park Area</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Low Risk
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prediction confidence:</span>
                      <span className="font-medium">56%</span>
                    </div>
                    <Progress value={56} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Minor pressure anomalies detected. Include in next monthly inspection cycle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="outline">View All Predictions</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5 text-blue-600" />
              Leak Occurrence Forecast
            </CardTitle>
            <CardDescription>Projected leak incidents over the next 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Forecast chart showing projected leak incidents</p>
                <p className="text-sm text-muted-foreground">Data visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="anomalies" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-red-600">
                <AlertTriangle className="mr-1 h-4 w-4" />
                Detected Anomalies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">3 critical, 4 moderate</p>
              <div className="mt-3 h-1 w-full bg-red-100 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full" style={{ width: "70%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-green-600">
                <Clock className="mr-1 h-4 w-4" />
                Early Detection Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">+12% from previous period</p>
              <div className="mt-3 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full" style={{ width: "89%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-blue-600">
                <Droplet className="mr-1 h-4 w-4" />
                Water Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124K</div>
              <p className="text-xs text-muted-foreground">Gallons this month</p>
              <div className="mt-3 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: "80%" }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-amber-600" />
              Current Anomaly Detections
            </CardTitle>
            <CardDescription>Unusual patterns identified by AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-red-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    <span className="font-medium">Critical Pressure Drop</span>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  Sudden 40% pressure drop detected in East District main line. Pattern suggests major leak developing.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600">Detected 2 hours ago</span>
                  <Button size="sm" variant="destructive">
                    Investigate Now
                  </Button>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-amber-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                    <span className="font-medium">Unusual Flow Pattern</span>
                  </div>
                  <Badge className="bg-amber-500">Moderate</Badge>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  Consistent nighttime flow increase detected in Commercial District. Pattern suggests potential
                  undetected leak or unauthorized usage.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600">Detected 8 hours ago</span>
                  <Button size="sm" variant="outline">
                    Schedule Inspection
                  </Button>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Seasonal Usage Deviation</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Low
                  </Badge>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  North Residential area showing 22% higher usage than expected for season. May indicate multiple small
                  leaks or changed consumption patterns.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-neutral-600">Detected 3 days ago</span>
                  <Button size="sm" variant="outline">
                    Analyze Further
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-blue-600" />
              Anomaly Distribution
            </CardTitle>
            <CardDescription>Types and locations of detected anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Distribution chart showing anomaly types and locations</p>
                <p className="text-sm text-muted-foreground">Data visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="optimization" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-green-600">
                <Zap className="mr-1 h-4 w-4" />
                Resource Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+24%</div>
              <p className="text-xs text-muted-foreground">Improvement in team utilization</p>
              <div className="mt-3 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full" style={{ width: "84%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-blue-600">
                <Clock className="mr-1 h-4 w-4" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-36%</div>
              <p className="text-xs text-muted-foreground">Reduction in average response time</p>
              <div className="mt-3 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: "76%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-amber-600">
                <Settings className="mr-1 h-4 w-4" />
                Maintenance Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42%</div>
              <p className="text-xs text-muted-foreground">Preventive vs. reactive maintenance</p>
              <div className="mt-3 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: "42%" }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-amber-600" />
              Resource Allocation Recommendations
            </CardTitle>
            <CardDescription>AI-optimized team and resource deployment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Downtown District</span>
                  </div>
                  <Badge className="bg-green-500">High Priority</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-700">
                    <strong>Recommendation:</strong> Increase Team Alpha allocation to 3 days/week for preventive
                    maintenance. Focus on aging infrastructure in blocks 12-18.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Projected impact:</span>
                    <span className="font-medium text-green-600">32% reduction in emergency repairs</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">North Residential Area</span>
                  </div>
                  <Badge className="bg-amber-500">Medium Priority</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-700">
                    <strong>Recommendation:</strong> Deploy Team Bravo for targeted inspection of pressure regulation
                    valves. Schedule during off-peak hours to minimize disruption.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Projected impact:</span>
                    <span className="font-medium text-green-600">18% reduction in water loss</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Industrial Zone</span>
                  </div>
                  <Badge className="bg-amber-500">Medium Priority</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-neutral-700">
                    <strong>Recommendation:</strong> Implement night-time monitoring schedule with Team Charlie. Focus
                    on flow anomalies during manufacturing off-hours.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Projected impact:</span>
                    <span className="font-medium text-green-600">25% improvement in detection rate</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-blue-600" />
              Maintenance Schedule Optimization
            </CardTitle>
            <CardDescription>AI-generated optimal maintenance schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Optimized maintenance schedule visualization</p>
                <p className="text-sm text-muted-foreground">Calendar view will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="strategic" className="mt-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-blue-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                Infrastructure Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">+8% from previous assessment</p>
              <div className="mt-3 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: "76%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-green-600">
                <Droplet className="mr-1 h-4 w-4" />
                Annual Water Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.4M</div>
              <p className="text-xs text-muted-foreground">Gallons projected</p>
              <div className="mt-3 h-1 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full" style={{ width: "82%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-amber-600">
                <Zap className="mr-1 h-4 w-4" />
                ROI on AI Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342%</div>
              <p className="text-xs text-muted-foreground">5-year projected return</p>
              <div className="mt-3 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full" style={{ width: "90%" }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-indigo-600" />
              Strategic Infrastructure Insights
            </CardTitle>
            <CardDescription>Long-term planning recommendations based on AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-3">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                  <span className="font-medium">Infrastructure Replacement Priority</span>
                </div>
                <p className="text-sm text-neutral-700 mb-3">
                  AI analysis indicates that replacing the aging cast iron pipes in the Downtown District should be
                  prioritized over the previously planned South District upgrades. Projected to prevent 28 major leaks
                  over the next 5 years.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Confidence score:</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-1.5 mt-1" />
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center mb-3">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                  <span className="font-medium">Pressure Management Strategy</span>
                </div>
                <p className="text-sm text-neutral-700 mb-3">
                  Implementing dynamic pressure management in North and East districts could reduce leak frequency by
                  34% while maintaining service levels. Recommended investment in smart pressure regulation valves with
                  18-month ROI.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Confidence score:</span>
                  <span className="font-medium">87%</span>
                </div>
                <Progress value={87} className="h-1.5 mt-1" />
              </div>

              <div className="border rounded-md p-4">
                <div className="flex items-center mb-3">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                  <span className="font-medium">Sensor Network Expansion</span>
                </div>
                <p className="text-sm text-neutral-700 mb-3">
                  Strategic placement of 24 additional flow sensors in identified high-risk areas would increase early
                  detection capabilities by 46%. Analysis shows optimal locations for maximum coverage with minimal
                  investment.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Confidence score:</span>
                  <span className="font-medium">94%</span>
                </div>
                <Progress value={94} className="h-1.5 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              5-Year Infrastructure Health Projection
            </CardTitle>
            <CardDescription>Projected system health with and without AI-recommended interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Projection chart showing infrastructure health trends</p>
                <p className="text-sm text-muted-foreground">Data visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </AdminLayout>
  )
}
