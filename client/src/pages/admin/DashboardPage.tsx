import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  DropletIcon,
  WrenchIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  MapPinIcon
} from "lucide-react";

// Dashboard statistics type
interface DashboardStats {
  totalReports: number;
  reportsLast24h: number;
  reportsLast7d: number;
  resolvedReports: number;
  unresolvedReports: number;
  criticalReports: number;
  zones: {
    id: number;
    name: string;
    reportCount: number;
    unresolvedCount: number;
    criticalCount: number;
  }[];
}

export default function DashboardPage() {
  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  // Placeholders if data hasn't loaded yet
  const statsData = stats || {
    totalReports: 0,
    reportsLast24h: 0,
    reportsLast7d: 0,
    resolvedReports: 0,
    unresolvedReports: 0,
    criticalReports: 0,
    zones: []
  };

  // Calculate percentages for the stats cards
  const resolutionRate = statsData.totalReports > 0 
    ? Math.round((statsData.resolvedReports / statsData.totalReports) * 100) 
    : 0;
  
  const criticalRate = statsData.totalReports > 0 
    ? Math.round((statsData.criticalReports / statsData.totalReports) * 100) 
    : 0;

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of water leak reports and system performance.
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <DropletIcon className="h-4 w-4 mr-2 text-blue-500" />
              Total Reports
            </CardTitle>
            <CardDescription>All time reported leaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.totalReports}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">+{statsData.reportsLast24h}</span> in the last 24 hours
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <WrenchIcon className="h-4 w-4 mr-2 text-orange-500" />
              Resolution Rate
            </CardTitle>
            <CardDescription>Percentage of resolved reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{resolutionRate}%</div>
            <Progress value={resolutionRate} className="h-2 mt-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {statsData.resolvedReports} of {statsData.totalReports} reports resolved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <AlertCircleIcon className="h-4 w-4 mr-2 text-red-500" />
              Critical Issues
            </CardTitle>
            <CardDescription>High priority leak reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.criticalReports}</div>
            <Progress value={criticalRate} className="h-2 mt-2 bg-red-100" indicatorClassName="bg-red-500" />
            <div className="text-xs text-muted-foreground mt-1">
              {criticalRate}% of total reports are critical
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Zones Tabs */}
      <Tabs defaultValue="zones" className="mb-6">
        <TabsList>
          <TabsTrigger value="zones">Zones Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="zones" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Zone Statistics</CardTitle>
              <CardDescription>Reports distribution by zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsData.zones.length > 0 ? (
                  statsData.zones.map((zone) => (
                    <div key={zone.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2 text-teal-600" />
                          <span className="font-medium">{zone.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {zone.reportCount} reports
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1 flex items-center">
                            <AlertCircleIcon className="h-3 w-3 mr-1 text-red-500" />
                            Critical Issues
                          </div>
                          <Progress 
                            value={zone.reportCount > 0 ? (zone.criticalCount / zone.reportCount) * 100 : 0} 
                            className="h-2 bg-red-100" 
                            indicatorClassName="bg-red-500"
                          />
                          <div className="text-xs mt-1">{zone.criticalCount} critical</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1 flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1 text-yellow-500" />
                            Pending Resolution
                          </div>
                          <Progress 
                            value={zone.reportCount > 0 ? (zone.unresolvedCount / zone.reportCount) * 100 : 0} 
                            className="h-2" 
                          />
                          <div className="text-xs mt-1">{zone.unresolvedCount} pending</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No zone data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>Latest reports and resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would show actual activity data - showing placeholder for now */}
                <div className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mt-0.5">
                        <DropletIcon className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="ml-2">
                        <div className="font-medium">New leak report submitted</div>
                        <div className="text-sm text-muted-foreground">Downtown area, near central park</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Just now
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mt-0.5">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="ml-2">
                        <div className="font-medium">Report #7823 resolved</div>
                        <div className="text-sm text-muted-foreground">North residential zone</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                </div>
                
                <div className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="mt-0.5">
                        <WrenchIcon className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="ml-2">
                        <div className="font-medium">Team assigned to issue #7845</div>
                        <div className="text-sm text-muted-foreground">East commercial district</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      4 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}