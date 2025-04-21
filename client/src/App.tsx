import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MapPage from "@/pages/map-page";
import MyReportsPage from "@/pages/my-reports-page";
import AuthPage from "@/pages/auth-page";
import LearnPage from "@/pages/learn-page";
import AchievementsPage from "@/pages/achievements-page";
import LandingPage from "@/pages/landing-page";
import AdminPlaceholderPage from "@/pages/admin-placeholder-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Admin Dashboard imports
import AdminDashboard from "@/pages/admin/dashboard";
import AdminReports from "@/pages/admin/reports";
import AdminTeams from "@/pages/admin/teams";
import ZonesPage from "@/pages/admin/zones";
import AdminAnalytics from "@/pages/admin/analytics";

function Router() {
  return (
    <Switch>
      {/* Main application routes */}
      <Route path="/" component={LandingPage} />
      <Route path="/map" component={MapPage} />
      <ProtectedRoute path="/my-reports" component={MyReportsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/learn" component={LearnPage} />
      <ProtectedRoute path="/achievements" component={AchievementsPage} />
      
      {/* Admin routes */}
      <Route path="/admin" component={AdminPlaceholderPage} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/reports" component={AdminReports} />
      <Route path="/admin/teams" component={AdminTeams} />
      <Route path="/admin/zones" component={ZonesPage} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      
      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
