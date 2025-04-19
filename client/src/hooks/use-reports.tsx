import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { 
  useQuery, 
  useMutation, 
  UseMutationResult
} from "@tanstack/react-query";
import { Report, InsertReport, insertReportSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { z } from "zod";

interface ReportsContextType {
  reports: Report[];
  userReports: Report[];
  isLoading: boolean;
  activeReport: Report | null;
  setActiveReport: (report: Report | null) => void;
  submitReportMutation: UseMutationResult<Report, Error, InsertReport>;
  updateReportStatusMutation: UseMutationResult<
    Report,
    Error,
    { id: number; status: string }
  >;
}

const ReportsContext = createContext<ReportsContextType | null>(null);

// Define a validation schema for reports
export const reportFormSchema = insertReportSchema.extend({
  photos: z.array(z.string()).optional(),
});

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveOfflineReport, syncOfflineReports } = useOfflineStorage();
  const [activeReport, setActiveReport] = useState<Report | null>(null);

  // Get all reports
  const { data: reports = [], isLoading: isLoadingReports } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
    staleTime: 60000, // 1 minute
  });

  // Get user reports if authenticated
  const { data: userReports = [] } = useQuery<Report[]>({
    queryKey: ["/api/user/reports"],
    enabled: !!user,
    staleTime: 60000, // 1 minute
  });

  // Submit a new report
  const submitReportMutation = useMutation({
    mutationFn: async (reportData: InsertReport) => {
      // Check if online
      if (navigator.onLine) {
        const res = await apiRequest("POST", "/api/reports", reportData);
        return await res.json();
      } else {
        // Save for offline submission
        await saveOfflineReport({ reportData });
        throw new Error("You're offline. Report saved and will be submitted when you're back online.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["/api/user/reports"] });
      }
      toast({
        title: "Report submitted",
        description: "Thank you for your report. It has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      if (error.message.includes("offline")) {
        toast({
          title: "Saved offline",
          description: "Your report has been saved and will be submitted when you're back online.",
        });
      } else {
        toast({
          title: "Failed to submit report",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  // Update report status
  const updateReportStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/reports/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["/api/user/reports"] });
      }
      toast({
        title: "Status updated",
        description: "The report status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Effect to sync offline reports when coming back online
  useEffect(() => {
    const handleOnline = () => {
      syncOfflineReports().catch(error => {
        console.error("Failed to sync offline reports:", error);
      });
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [syncOfflineReports]);

  return (
    <ReportsContext.Provider
      value={{
        reports,
        userReports,
        isLoading: isLoadingReports,
        activeReport,
        setActiveReport,
        submitReportMutation,
        updateReportStatusMutation,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
};
