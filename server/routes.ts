import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertReportSchema, insertOfflineReportSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication endpoints
  setupAuth(app);

  // API routes for reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(parseInt(req.params.id));
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      
      // If user is authenticated, add userId
      if (req.isAuthenticated() && !validatedData.anonymous) {
        validatedData.userId = req.user.id;
      }
      
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.patch("/api/reports/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !['pending', 'in-progress', 'resolved'].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      
      const report = await storage.updateReportStatus(parseInt(req.params.id), status);
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to update report status" });
    }
  });

  // User reports
  app.get("/api/user/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const reports = await storage.getReportsByUser(req.user.id);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reports" });
    }
  });

  // Offline reports
  app.post("/api/offline-reports", async (req, res) => {
    try {
      const validatedData = insertOfflineReportSchema.parse(req.body);
      const offlineReport = await storage.saveOfflineReport(validatedData);
      res.status(201).json(offlineReport);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid offline report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save offline report" });
    }
  });

  app.get("/api/offline-reports", async (req, res) => {
    try {
      const offlineReports = await storage.getOfflineReports();
      res.json(offlineReports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offline reports" });
    }
  });

  app.delete("/api/offline-reports/:id", async (req, res) => {
    try {
      await storage.deleteOfflineReport(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete offline report" });
    }
  });

  // Educational tips
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getAllTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  app.get("/api/tips/:id", async (req, res) => {
    try {
      const tip = await storage.getTip(parseInt(req.params.id));
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tip" });
    }
  });

  // Achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user/achievements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const achievements = await storage.getUserAchievements(req.user.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Notifications
  app.get("/api/user/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const notifications = await storage.getUserNotifications(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const notification = await storage.markNotificationAsRead(parseInt(req.params.id));
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      // Make sure the notification belongs to the authenticated user
      if (notification.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
