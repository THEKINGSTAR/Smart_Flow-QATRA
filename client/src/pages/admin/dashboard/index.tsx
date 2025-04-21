import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropletIcon, 
  MapPinIcon, 
  UsersIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  ClockIcon,
  BarChart3Icon,
  TrendingUpIcon,
  SettingsIcon
} from "lucide-react";

interface DashboardData {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  criticalReports: number;
  totalZones: number;
  totalTeams: number;
  recentReports: any[];
  stats: any;
}

export default function AdminDashboard() {
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/admin/dashboard"],
  });

  // Calculate percentages for stats cards
  const resolvedPercentage = data 
    ? Math.round((data.resolvedReports / (data.totalReports || 1)) * 100) 
    : 0;
  
  const pendingPercentage = data
    ? Math.round((data.pendingReports / (data.totalReports || 1)) * 100)
    : 0;
  
  const criticalPercentage = data
    ? Math.round((data.criticalReports / (data.totalReports || 1)) * 100)
    : 0;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your water leak management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-9">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm" className="h-9">
            <TrendingUpIcon className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Leak Reports
            </CardTitle>
            <DropletIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data?.recentReports?.length || 0} new reports in the last 24 hours
            </p>
            <div className="mt-3 h-1 w-full bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full" 
                style={{ width: "100%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Reports
            </CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.resolvedReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {resolvedPercentage}% of total reports
            </p>
            <div className="mt-3 h-1 w-full bg-green-100 rounded-full overflow-hidden">
              <div 
                className="bg-green-600 h-full" 
                style={{ width: `${resolvedPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <ClockIcon className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.pendingReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPercentage}% of total reports
            </p>
            <div className="mt-3 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full" 
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Leaks
            </CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.criticalReports || 0}</div>
            <p className="text-xs text-muted-foreground">
              {criticalPercentage}% of total reports
            </p>
            <div className="mt-3 h-1 w-full bg-red-100 rounded-full overflow-hidden">
              <div 
                className="bg-red-600 h-full" 
                style={{ width: `${criticalPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources and Activity Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Leak Reports</CardTitle>
            <CardDescription>
              Overview of the latest water leak reports submitted by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : data?.recentReports && data.recentReports.length > 0 ? (
              <div className="space-y-4">
                {data.recentReports.map((report) => (
                  <div key={report.id} className="flex items-start space-x-4 p-3 border rounded-md">
                    <div className={`p-2 rounded-full ${
                      report.severity === 'critical' ? 'bg-red-100' : 
                      report.severity === 'high' ? 'bg-orange-100' : 
                      report.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <DropletIcon className={`h-5 w-5 ${
                        report.severity === 'critical' ? 'text-red-600' : 
                        report.severity === 'high' ? 'text-orange-600' : 
                        report.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {report.title || `Leak Report #${report.id}`}
                        </p>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                          report.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {report.status || 'pending'}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-md">
                        {report.description || 'No description provided'}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        <span>{report.location || 'Unknown location'}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    View All Reports
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No reports available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Resources</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Overview of your managed resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">Zones</span>
                </div>
                <div className="text-sm font-bold">{data?.totalZones || 0}</div>
              </div>
              <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full" 
                  style={{ width: `${Math.min((data?.totalZones || 0) * 10, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 mr-2 text-indigo-600" />
                  <span className="text-sm font-medium">Teams</span>
                </div>
                <div className="text-sm font-bold">{data?.totalTeams || 0}</div>
              </div>
              <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full" 
                  style={{ width: `${Math.min((data?.totalTeams || 0) * 20, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full text-xs h-9" size="sm">
                  <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                  Manage Zones
                </Button>
                <Button variant="outline" className="w-full text-xs h-9" size="sm">
                  <UsersIcon className="h-3.5 w-3.5 mr-1" />
                  Manage Teams
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Distribution */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Report Distribution by Zone</CardTitle>
            <CardDescription>
              Reports grouped by geographic zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <BarChart3Icon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Zone distribution chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
            <CardDescription>
              Leak report status changes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <div className="text-center text-muted-foreground">
                <TrendingUpIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p>Status timeline chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}