import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, SearchIcon, MapIcon, EditIcon, TrashIcon } from "lucide-react";
import { Zone } from "@shared/schema";

export default function ZonesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch zones data
  const { data: zones, isLoading } = useQuery<Zone[]>({
    queryKey: ["/api/admin/zones"],
  });

  // Filter zones based on search query
  const filteredZones = zones?.filter((zone) => 
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zone Management</h1>
          <p className="text-muted-foreground">
            Create and manage service zones for leak reports
          </p>
        </div>
        <Button className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Zone Map</CardTitle>
            <CardDescription>Geographic view of all maintenance zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center border">
              <div className="text-center">
                <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-400 mt-1">
                  Shows zone boundaries and leak report concentrations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Zone Statistics</CardTitle>
            <CardDescription>Quick overview of zone activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="text-sm text-blue-500 font-medium">Total Zones</div>
                  <div className="text-2xl font-bold">{zones?.length || 0}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="text-sm text-green-500 font-medium">Active Teams</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 p-3 rounded-md">
                  <div className="text-sm text-yellow-500 font-medium">Pending Reports</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
                <div className="bg-red-50 p-3 rounded-md">
                  <div className="text-sm text-red-500 font-medium">Critical Issues</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-2">Priority Distribution</h3>
                <div className="flex space-x-1 h-6">
                  <div className="bg-red-500 w-2/6 rounded-l-sm"></div>
                  <div className="bg-orange-400 w-1/6"></div>
                  <div className="bg-yellow-400 w-2/6"></div>
                  <div className="bg-green-400 w-1/6 rounded-r-sm"></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Critical</span>
                  <span>High</span>
                  <span>Medium</span>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Zone List</CardTitle>
          <div className="flex items-center mt-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search zones..."
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones && filteredZones.length > 0 ? (
                    filteredZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>
                          {zone.priority === 1 ? (
                            <Badge variant="destructive">Critical</Badge>
                          ) : zone.priority === 2 ? (
                            <Badge variant="default" className="bg-orange-500">High</Badge>
                          ) : zone.priority === 3 ? (
                            <Badge variant="default" className="bg-yellow-500">Medium</Badge>
                          ) : (
                            <Badge variant="outline">Low</Badge>
                          )}
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
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
                      <TableCell colSpan={5} className="h-24 text-center">
                        {filteredZones?.length === 0 ? (
                          "No matching zones found"
                        ) : (
                          "No zones available"
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