import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UsersIcon,
  SearchIcon, 
  PlusIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  EyeIcon, 
  EditIcon, 
  TrashIcon,
  CheckCircleIcon,
  ClockIcon
} from "lucide-react";
import { Team } from "@shared/schema";

// Enhanced Team type to accommodate all the data we need
interface EnhancedTeam extends Team {
  status?: string;
  leader?: string;
  phone?: string;
  email?: string;
  specialty?: string;
  location?: string;
}

export default function AdminTeams() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch teams data
  const { data: rawTeams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/admin/teams"],
  });
  
  // Process teams to add the additional properties
  const teams = rawTeams?.map(team => ({
    ...team,
    // Default values for the extended properties
    status: "available",
    leader: team.contact?.split(',')[0] || "Team Lead",
    phone: "555-" + Math.floor(1000 + Math.random() * 9000),
    email: `team${team.id}@smartflow.com`,
    specialty: "Water Maintenance",
    location: "District " + team.id
  } as EnhancedTeam));

  // Filter teams based on search query
  const filteredTeams = teams?.filter((team) => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (team.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get availability badge
  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Available</Badge>;
      case "on-duty":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">On Duty</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Unavailable</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Field Teams</h1>
          <p className="text-muted-foreground">
            Manage your maintenance and repair teams
          </p>
        </div>
        <Button className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Team
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-indigo-600">
              <UsersIcon className="mr-1 h-4 w-4" />
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-600">
              <CheckCircleIcon className="mr-1 h-4 w-4" />
              Available Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams?.filter(team => team.status === "available").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-600">
              <ClockIcon className="mr-1 h-4 w-4" />
              On Duty Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams?.filter(team => team.status === "on-duty").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Team Assignments</CardTitle>
          <CardDescription>
            Overview of current team assignments and workload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    <span className="font-medium">Team Alpha</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">On Duty</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assignment:</span>
                    <span className="font-medium">Downtown District</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reports:</span>
                    <span className="font-medium">3 active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-blue-700">In Progress</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    <span className="font-medium">Team Bravo</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">On Duty</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assignment:</span>
                    <span className="font-medium">Residential North</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reports:</span>
                    <span className="font-medium">2 active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-blue-700">In Progress</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    <span className="font-medium">Team Charlie</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Available</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assignment:</span>
                    <span className="font-medium">None</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Reports:</span>
                    <span className="font-medium">0 active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-green-700">Ready</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="sm" className="mt-2">
                View All Assignments
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Teams</CardTitle>
          </div>
          <div className="flex items-center mt-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search teams..."
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams && filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-2 text-indigo-600" />
                            {team.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <UserIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                            {team.leader || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <PhoneIcon className="h-3 w-3 mr-1" />
                              {team.phone || "-"}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MailIcon className="h-3 w-3 mr-1" />
                              {team.email || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{team.specialty || "-"}</TableCell>
                        <TableCell>
                          {getAvailabilityBadge(team.status || "available")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground">
                            <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                            {team.location || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        {filteredTeams?.length === 0 ? (
                          "No matching teams found"
                        ) : (
                          "No teams available"
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