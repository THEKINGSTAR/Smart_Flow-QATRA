import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropletIcon, 
  SearchIcon, 
  FilterIcon, 
  ChevronDownIcon,
  MapPinIcon, 
  CalendarIcon,
  EyeIcon, 
  CheckCircleIcon, 
  ClockIcon
} from "lucide-react";
import { Report } from "@shared/schema";

// Enhanced Report type to accommodate all the data we need
interface EnhancedReport extends Report {
  location?: string; // For display purposes, will be derived from address
}

export default function AdminReports() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch reports data
  const { data: rawReports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });
  
  // Process reports to add the location property
  const reports = rawReports?.map(report => ({
    ...report,
    location: report.address // Use address as location
  } as EnhancedReport));

  // Filter reports based on search query
  const filteredReports = reports?.filter((report) => 
    (report.title?.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (report.description?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (report.location?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Resolved</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Pending</Badge>;
    }
  };

  // Function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Low</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leak Reports</h1>
          <p className="text-muted-foreground">
            Manage and track water leak reports across your network
          </p>
        </div>
        <Button>
          <DropletIcon className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-600">
              <DropletIcon className="mr-1 h-4 w-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-amber-600">
              <ClockIcon className="mr-1 h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports?.filter(report => report.status === "pending").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-600">
              <ClockIcon className="mr-1 h-4 w-4" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports?.filter(report => report.status === "in-progress").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-600">
              <CheckCircleIcon className="mr-1 h-4 w-4" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports?.filter(report => report.status === "resolved").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Reports</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8">
                <FilterIcon className="mr-2 h-3.5 w-3.5" />
                Filter
                <ChevronDownIcon className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reported At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports && filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">#{report.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DropletIcon className="h-4 w-4 mr-2 text-blue-600" />
                            {report.title || `Leak Report #${report.id}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground">
                            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                            {report.location || "Unknown location"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(report.status)}
                        </TableCell>
                        <TableCell>
                          {getSeverityBadge(report.severity)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8">
                            <EyeIcon className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {filteredReports?.length === 0 ? (
                          "No matching reports found"
                        ) : (
                          "No reports available"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}