import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { InsertOfflineReport, InsertReport } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface OfflineStorageContextType {
  isOffline: boolean;
  pendingReports: number;
  saveOfflineReport: (report: InsertOfflineReport) => Promise<void>;
  syncOfflineReports: () => Promise<void>;
}

const OfflineStorageContext = createContext<OfflineStorageContextType | null>(null);

// IndexedDB setup
const DB_NAME = "smartflowDB";
const DB_VERSION = 1;
const REPORTS_STORE = "offlineReports";

async function initDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(new Error("Failed to open IndexedDB"));
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(REPORTS_STORE)) {
        db.createObjectStore(REPORTS_STORE, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export function OfflineStorageProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingReports, setPendingReports] = useState(0);
  const { toast } = useToast();

  // Update online/offline status
  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
      toast({
        title: "You're back online",
        description: pendingReports > 0 
          ? `Syncing ${pendingReports} pending reports...`
          : "All data is up to date.",
      });
      
      syncOfflineReports().catch(console.error);
    }
    
    function handleOffline() {
      setIsOffline(true);
      toast({
        title: "You're offline",
        description: "Reports will be saved locally and synced when you reconnect.",
        variant: "destructive",
      });
    }
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [pendingReports, toast]);

  // Count pending reports on mount
  useEffect(() => {
    countPendingReports().catch(console.error);
  }, []);

  // Save report to IndexedDB for offline storage
  async function saveOfflineReport(offlineReport: InsertOfflineReport): Promise<void> {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORTS_STORE], "readwrite");
        const store = transaction.objectStore(REPORTS_STORE);
        
        const request = store.add(offlineReport);
        
        request.onsuccess = () => {
          countPendingReports();
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error("Failed to save offline report"));
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      throw error;
    }
  }

  // Count pending reports
  async function countPendingReports(): Promise<void> {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORTS_STORE], "readonly");
        const store = transaction.objectStore(REPORTS_STORE);
        
        const countRequest = store.count();
        
        countRequest.onsuccess = () => {
          setPendingReports(countRequest.result);
          resolve();
        };
        
        countRequest.onerror = () => {
          reject(new Error("Failed to count pending reports"));
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
    }
  }

  // Get all pending reports
  async function getPendingReports(): Promise<InsertOfflineReport[]> {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORTS_STORE], "readonly");
        const store = transaction.objectStore(REPORTS_STORE);
        
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = () => {
          reject(new Error("Failed to get pending reports"));
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      return [];
    }
  }

  // Delete a report from IndexedDB
  async function deleteOfflineReport(id: number): Promise<void> {
    try {
      const db = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORTS_STORE], "readwrite");
        const store = transaction.objectStore(REPORTS_STORE);
        
        const request = store.delete(id);
        
        request.onsuccess = () => {
          countPendingReports();
          resolve();
        };
        
        request.onerror = () => {
          reject(new Error("Failed to delete offline report"));
        };
      });
    } catch (error) {
      console.error("IndexedDB error:", error);
      throw error;
    }
  }

  // Sync all offline reports
  async function syncOfflineReports(): Promise<void> {
    if (!navigator.onLine) {
      return;
    }
    
    try {
      const offlineReports = await getPendingReports();
      if (offlineReports.length === 0) {
        return;
      }
      
      // Process each pending report sequentially
      for (const offlineReport of offlineReports) {
        try {
          const reportData = offlineReport.reportData as InsertReport;
          await apiRequest("POST", "/api/reports", reportData);
          await deleteOfflineReport(offlineReport.id);
        } catch (error) {
          console.error("Failed to sync report:", error);
          // Continue with other reports even if one fails
        }
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/reports"] });
      
      toast({
        title: "Sync complete",
        description: `Successfully synced ${offlineReports.length} reports.`,
      });
    } catch (error) {
      console.error("Failed to sync offline reports:", error);
      toast({
        title: "Sync failed",
        description: "Failed to sync some offline reports. Will try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <OfflineStorageContext.Provider
      value={{
        isOffline,
        pendingReports,
        saveOfflineReport,
        syncOfflineReports,
      }}
    >
      {children}
    </OfflineStorageContext.Provider>
  );
}

export function useOfflineStorage() {
  const context = useContext(OfflineStorageContext);
  if (!context) {
    throw new Error("useOfflineStorage must be used within an OfflineStorageProvider");
  }
  return context;
}
