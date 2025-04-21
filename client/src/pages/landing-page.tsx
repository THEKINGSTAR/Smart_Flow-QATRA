import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center mb-4">
            <Droplet className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 text-transparent bg-clip-text">
              SmartFlow
            </h1>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">
            Water Leak Reporting and Management Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Our integrated platform helps communities identify, report, and manage water leaks efficiently. Choose your path below:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Reporting Application Card */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Leak Reporting Application</CardTitle>
              <CardDescription>
                For community members to report water leaks and track repair progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  <h3 className="font-medium">Features:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-1 text-muted-foreground">
                    <li>Submit leak reports with photos and location</li>
                    <li>Track the status of your reports</li>
                    <li>View reports on an interactive map</li>
                    <li>Learn about water conservation</li>
                    <li>Earn achievements for active participation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/map">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Access Reporting Application
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Admin Dashboard Card */}
          <Card className="border-2 border-teal-200 dark:border-teal-800 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-teal-700 dark:text-teal-300">Administration Dashboard</CardTitle>
              <CardDescription>
                For water utility staff to manage leaks, teams, and resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="bg-teal-50 dark:bg-teal-900 p-3 rounded-lg">
                  <h3 className="font-medium">Features:</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-1 text-muted-foreground">
                    <li>View leak reports and dashboard statistics</li>
                    <li>Assign reports to zones and teams</li>
                    <li>Manage inspection teams and priorities</li>
                    <li>Track repair progress in real-time</li>
                    <li>Generate analytics and performance reports</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <a href="/admin/index.html" className="w-full">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  Access Administration Dashboard
                </Button>
              </a>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SmartFlow Water Management Platform. All rights reserved.</p>
          <p className="mt-1">Helping communities conserve water through efficient leak management.</p>
        </div>
      </div>
    </div>
  );
}