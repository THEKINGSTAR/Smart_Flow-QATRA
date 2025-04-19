import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleNavigation = (path: string) => {
    setLoading(true);
    navigate(path);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to map page as the default starting point
  // This is just a redirect page, the main app functionality is on map-page
  if (!loading) {
    handleNavigation("/");
    return null;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
