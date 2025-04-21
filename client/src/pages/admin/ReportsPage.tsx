import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SearchIcon, 
  AlertCircleIcon,
  CheckCircleIcon, 
  ClockIcon,
  ExternalLinkIcon, 
  EyeIcon,
  MapPinIcon
} from "lucide-react";
import { Report } from "@shared/schema";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch reports data
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  // Filter reports based on search query
  const filteredReports = reports?.filter((report) => 
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingReports = filteredReports?.filter((report) => report.status !== "resolved");
  const resolvedReports = filteredReports?.filter((report) => report.status === "resolved");
  const criticalReports = filteredReports?.filter((report) => report.severity === "critical");

  // Get the severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  // Get the status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>;
      case "assigned":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700">Assigned</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Pending</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Reports Management</h1>
        <p className="text-muted-foreground">
          View, assign and manage leak reports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm text-muted-foreground">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm text-amber-500 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm text-green-500 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedReports?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-sm text-red-500 flex items-center">
              <AlertCircleIcon className="h-4 w-4 mr-1" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalReports?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Reports List</CardTitle>
          <div className="flex items-center mt-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ReportsTable 
                reports={filteredReports} 
                isLoading={isLoading} 
                getSeverityBadge={getSeverityBadge}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <ReportsTable 
                reports={pendingReports} 
                isLoading={isLoading} 
                getSeverityBadge={getSeverityBadge}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            
            <TabsContent value="critical">
              <ReportsTable 
                reports={criticalReports} 
                isLoading={isLoading} 
                getSeverityBadge={getSeverityBadge}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            
            <TabsContent value="resolved">
              <ReportsTable 
                reports={resolvedReports} 
                isLoading={isLoading} 
                getSeverityBadge={getSeverityBadge}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

interface ReportsTableProps {
  reports?: Report[];
  isLoading: boolean;
  getSeverityBadge: (severity: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
}

function ReportsTable({ reports, isLoading, getSeverityBadge, getStatusBadge }: ReportsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Report Details</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">#{report.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{report.title || 'Untitled Report'}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{report.description}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-sm line-clamp-1">{report.address}</span>
                  </div>
                </TableCell>
                <TableCell>{getSeverityBadge(report.severity)}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-sm">
                  {report.createdAt 
                    ? new Date(report.createdAt).toLocaleDateString() 
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No reports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}