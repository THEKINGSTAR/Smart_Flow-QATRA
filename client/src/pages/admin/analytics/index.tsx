import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3Icon, 
  TrendingUpIcon, 
  MapIcon, 
  CalendarIcon, 
  DownloadIcon,
  ChevronDownIcon,
  FilterIcon
} from "lucide-react";

export default function AdminAnalytics() {
  const [period, setPeriod] = useState("month");
  
  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Analyze water leakage data and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
            <ChevronDownIcon className="ml-1 h-4 w-4" />
          </Button>
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="zones">Zones</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUpIcon className="mr-2 h-5 w-5 text-blue-600" />
              Leakage Reports Trend
            </CardTitle>
            <CardDescription>
              Number of reports over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <TrendingUpIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Line chart showing report submission trends</p>
                <p className="text-sm text-muted-foreground">Data visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3Icon className="mr-2 h-5 w-5 text-indigo-600" />
              Severity Distribution
            </CardTitle>
            <CardDescription>
              Reports by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <BarChart3Icon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Bar chart showing report severity distribution</p>
                <p className="text-sm text-muted-foreground">Data visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapIcon className="mr-2 h-5 w-5 text-teal-600" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>
              Heat map of leakage reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <MapIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Map visualization showing report density by area</p>
                <p className="text-sm text-muted-foreground">Map visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-amber-600" />
              Resolution Time Analysis
            </CardTitle>
            <CardDescription>
              Average time to resolve leakage reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <BarChart3Icon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Bar chart showing resolution time by severity</p>
                <p className="text-sm text-muted-foreground">Data visualization will be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>
            Summary of important performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Average Response Time</div>
              <div className="text-2xl font-bold">2.3 hours</div>
              <div className="text-xs flex items-center text-green-600 mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                12% improvement
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Resolution Rate</div>
              <div className="text-2xl font-bold">87%</div>
              <div className="text-xs flex items-center text-green-600 mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                5% improvement
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">Team Efficiency</div>
              <div className="text-2xl font-bold">92%</div>
              <div className="text-xs flex items-center text-green-600 mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                8% improvement
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="text-sm text-muted-foreground mb-1">User Satisfaction</div>
              <div className="text-2xl font-bold">4.7/5</div>
              <div className="text-xs flex items-center text-green-600 mt-1">
                <TrendingUpIcon className="h-3 w-3 mr-1" />
                0.3 points improvement
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}