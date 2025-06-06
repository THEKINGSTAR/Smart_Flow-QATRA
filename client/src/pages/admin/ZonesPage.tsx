"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  PlusIcon,
  SearchIcon,
  MapPinIcon,
  AlertCircleIcon,
  BarChart4Icon,
  ArrowUpDown,
  EyeIcon,
  EditIcon,
  TrashIcon,
  ChevronRightIcon,
} from "lucide-react"
import type { Zone } from "@shared/schema"

// Extended Zone type to accommodate all the data we need
interface EnhancedZone extends Zone {
  status?: string
  reportCount?: number
}

export default function ZonesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch zones data
  const { data: zones, isLoading } = useQuery<EnhancedZone[]>({
    queryKey: ["/api/admin/zones"],
  })

  // Filter zones based on search query
  const filteredZones = zones?.filter(
    (zone) =>
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (zone.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Function to get priority badge
  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) {
      return <Badge variant="destructive">Critical</Badge>
    } else if (priority >= 6) {
      return <Badge className="bg-orange-500">High</Badge>
    } else if (priority >= 4) {
      return <Badge className="bg-yellow-500">Medium</Badge>
    } else {
      return <Badge variant="outline">Low</Badge>
    }
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Inactive
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Maintenance
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Unknown
          </Badge>
        )
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zone Management</h1>
          <p className="text-muted-foreground">Manage geographic areas and leak hotspots</p>
        </div>
        <Button className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <MapPinIcon className="h-5 w-5 inline-block mr-2 text-teal-600" />
              Zone Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50 p-3 rounded-md">
                <div className="text-sm text-teal-600 font-medium">Total Zones</div>
                <div className="text-2xl font-bold">{zones?.length || 0}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-md">
                <div className="text-sm text-red-600 font-medium">Critical Zones</div>
                <div className="text-2xl font-bold">
                  {zones?.filter((zone) => (zone.priority || 0) >= 8).length || 0}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Zone Status Distribution</h3>
              <div className="h-8 bg-gray-100 rounded-md overflow-hidden flex">
                <div className="bg-green-500 h-full" style={{ width: "65%" }}></div>
                <div className="bg-blue-500 h-full" style={{ width: "20%" }}></div>
                <div className="bg-gray-400 h-full" style={{ width: "15%" }}></div>
              </div>
              <div className="flex text-xs text-muted-foreground mt-2 justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  <span>Maintenance</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                  <span>Inactive</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <AlertCircleIcon className="h-5 w-5 inline-block mr-2 text-amber-600" />
              Zone Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-red-50 rounded-md">
                <div className="mr-2 mt-0.5">
                  <AlertCircleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-red-900">Downtown District</div>
                  <div className="text-xs text-red-700">12 active reports - Critical priority</div>
                </div>
              </div>

              <div className="flex items-start p-3 bg-orange-50 rounded-md">
                <div className="mr-2 mt-0.5">
                  <AlertCircleIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-900">Residential North</div>
                  <div className="text-xs text-orange-700">8 active reports - High priority</div>
                </div>
              </div>

              <div className="flex items-start p-3 bg-yellow-50 rounded-md">
                <div className="mr-2 mt-0.5">
                  <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-yellow-900">Industrial Zone</div>
                  <div className="text-xs text-yellow-700">5 active reports - Medium priority</div>
                </div>
              </div>

              <div className="flex justify-center mt-2">
                <Button variant="ghost" size="sm" className="text-xs text-teal-600 hover:text-teal-700">
                  View All Alerts
                  <ChevronRightIcon className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <BarChart4Icon className="h-5 w-5 inline-block mr-2 text-indigo-600" />
              Zone Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Report Density</span>
                <span className="text-sm text-muted-foreground">By zone</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>Downtown District</span>
                  <span className="font-medium">12 reports</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: "80%" }}></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>Residential North</span>
                  <span className="font-medium">8 reports</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: "60%" }}></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>Industrial Zone</span>
                  <span className="font-medium">5 reports</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: "40%" }}></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>West Community</span>
                  <span className="font-medium">2 reports</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Zones List</CardTitle>
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
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">
                      <div className="flex items-center">
                        Priority
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones && filteredZones.length > 0 ? (
                    filteredZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2 text-teal-600" />
                            {zone.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[300px] truncate">
                          {zone.description || "-"}
                        </TableCell>
                        <TableCell>{getStatusBadge(zone.status || "active")}</TableCell>
                        <TableCell>{getPriorityBadge(zone.priority || 0)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{zone.reportCount || 0}</span>
                            <span className="text-xs text-muted-foreground">reports</span>
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        {filteredZones?.length === 0 ? "No matching zones found" : "No zones available"}
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
  )
}
