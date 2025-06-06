"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  PlusIcon,
  DropletIcon,
  AlertCircleIcon,
  EditIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react"
import type { Zone } from "@shared/schema"

// Enhanced Zone to include additional properties
interface EnhancedZone extends Zone {
  status?: string
  reportCount?: number
}

export default function ZonesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch zones data
  const { data: rawZones, isLoading } = useQuery<Zone[]>({
    queryKey: ["/api/admin/zones"],
  })

  // Process zones to add the additional properties
  const zones = rawZones?.map((zone) => {
    // Generate random report count between 0 and 20
    const reportCount = Math.floor(Math.random() * 20)

    // Determine status based on priority
    let status = "normal"
    const priority = zone.priority || 0
    if (priority >= 8) {
      status = "critical"
    } else if (priority >= 5) {
      status = "warning"
    }

    return {
      ...zone,
      status,
      reportCount,
    } as EnhancedZone
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
      return <Badge className="bg-red-500">High</Badge>
    } else if (priority >= 5) {
      return <Badge className="bg-amber-500">Medium</Badge>
    } else {
      return <Badge className="bg-blue-500">Low</Badge>
    }
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Critical
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            Warning
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Normal
          </Badge>
        )
    }
  }

  // Calculate metrics
  const totalReports = zones?.reduce((sum, zone) => sum + (zone.reportCount || 0), 0) || 0
  const criticalZones = zones?.filter((zone) => zone.status === "critical").length || 0
  const warningZones = zones?.filter((zone) => zone.status === "warning").length || 0

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Geographic Zones</h1>
          <p className="text-muted-foreground">Manage geographic areas for leak report assignment and tracking</p>
        </div>
        <Button className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-600">
              <MapPinIcon className="mr-1 h-4 w-4" />
              Total Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{zones?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-600">
              <DropletIcon className="mr-1 h-4 w-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-amber-600">
              <AlertCircleIcon className="mr-1 h-4 w-4" />
              Warning Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningZones}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-red-600">
              <AlertCircleIcon className="mr-1 h-4 w-4" />
              Critical Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalZones}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Zone Coverage Overview</CardTitle>
          <CardDescription>Distribution of leak reports across geographic zones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zones?.slice(0, 5).map((zone) => (
              <div key={zone.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">{zone.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{zone.reportCount} reports</span>
                    {getPriorityBadge(zone.priority || 0)}
                  </div>
                </div>
                <Progress value={(zone.reportCount || 0) * 5} className="h-2" />
              </div>
            ))}

            <div className="text-center">
              <Button variant="outline" size="sm" className="mt-2">
                View All Zones
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Zones</CardTitle>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reports</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZones && filteredZones.length > 0 ? (
                    filteredZones.map((zone) => (
                      <TableRow key={zone.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
                            {zone.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {zone.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DropletIcon className="h-3.5 w-3.5 mr-1 text-blue-600" />
                            <span>{zone.reportCount || 0} reports</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: 10 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    i < (zone.priority || 0)
                                      ? i >= 8
                                        ? "bg-red-500"
                                        : i >= 5
                                          ? "bg-amber-500"
                                          : "bg-blue-500"
                                      : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            {getPriorityBadge(zone.priority || 0)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(zone.status || "normal")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
                            <ArrowUpIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
                            <ArrowDownIcon className="h-4 w-4" />
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
