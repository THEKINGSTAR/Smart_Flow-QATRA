"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, SearchIcon, UsersIcon, PhoneIcon, ClipboardListIcon, EditIcon, TrashIcon } from "lucide-react"
import type { Team } from "@shared/schema"

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch teams data
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/admin/teams"],
  })

  // Filter teams based on search query
  const filteredTeams = teams?.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (team.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage inspection and repair teams</p>
        </div>
        <Button className="flex items-center">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <UsersIcon className="h-5 w-5 inline-block mr-2 text-teal-600" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50 p-3 rounded-md">
                <div className="text-sm text-teal-600 font-medium">Total Teams</div>
                <div className="text-2xl font-bold">{teams?.length || 0}</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-blue-600 font-medium">Staff Members</div>
                <div className="text-2xl font-bold">
                  {teams?.reduce((sum, team) => sum + (team.memberCount || 0), 0) || 0}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Staff Distribution</h3>
              <div className="h-8 bg-gray-100 rounded-md overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: "45%" }}></div>
                <div className="bg-teal-500 h-full" style={{ width: "30%" }}></div>
                <div className="bg-amber-500 h-full" style={{ width: "25%" }}></div>
              </div>
              <div className="flex text-xs text-muted-foreground mt-2 justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  <span>Plumbers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mr-1"></div>
                  <span>Inspectors</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                  <span>Managers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <ClipboardListIcon className="h-5 w-5 inline-block mr-2 text-amber-600" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Active Assignments</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Completed Today</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Pending Inspection</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t">
                <span className="text-sm font-medium">Average Resolution Time</span>
                <span className="text-sm font-medium text-teal-600">6h 24m</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">
              <PhoneIcon className="h-5 w-5 inline-block mr-2 text-indigo-600" />
              Quick Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium">Emergency Response</div>
                <div className="text-sm">(555) 123-4567</div>
              </div>
              <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium">Dispatch Center</div>
                <div className="text-sm">(555) 987-6543</div>
              </div>
              <div className="flex flex-col p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium">Water Department</div>
                <div className="text-sm">(555) 456-7890</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Teams List</CardTitle>
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Assignment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams && filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">
                          <div>{team.name}</div>
                          {team.description && <div className="text-xs text-muted-foreground">{team.description}</div>}
                        </TableCell>
                        <TableCell>{team.memberCount || 0}</TableCell>
                        <TableCell>{team.contact || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Available
                          </Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
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
                      <TableCell colSpan={6} className="h-24 text-center">
                        {filteredTeams?.length === 0 ? "No matching teams found" : "No teams available"}
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
