import type { Express, Request, Response, NextFunction } from "express"
import { createServer, type Server } from "http"
import { storage } from "./storage"
import { setupAuth } from "./auth"
import { z } from "zod"

// Define validation schemas inline
const insertReportSchema = z.object({
  userId: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  latitude: z.string(),
  longitude: z.string(),
  severity: z.enum(["minor", "moderate", "critical"]),
  status: z.enum(["pending", "in-progress", "resolved"]).optional(),
  photos: z.array(z.any()).optional(),
  voiceNote: z.string().optional(),
  anonymous: z.boolean().optional(),
})

const insertOfflineReportSchema = z.object({
  reportData: z.any(),
})

const insertZoneSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().optional(),
  coordinates: z.any().optional(),
  priority: z.number().optional(),
})

const insertTeamSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  contact: z.string().optional(),
  memberCount: z.number().optional(),
})

const insertTeamAssignmentSchema = z.object({
  teamId: z.number(),
  zoneId: z.number(),
  status: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
})

const insertReportToZoneSchema = z.object({
  reportId: z.number(),
  zoneId: z.number(),
})

const insertAdminUserSchema = z.object({
  userId: z.number(),
  role: z.string(),
  isSuperAdmin: z.boolean().optional(),
})

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication endpoints
  setupAuth(app)

  // API routes for reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports()
      res.json(reports)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" })
    }
  })

  app.get("/api/reports/:id", async (req, res) => {
    try {
      const report = await storage.getReport(Number.parseInt(req.params.id))
      if (!report) {
        return res.status(404).json({ message: "Report not found" })
      }
      res.json(report)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch report" })
    }
  })

  app.post("/api/reports", async (req, res) => {
    try {
      // Basic validation schema
      const reportSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        address: z.string().min(1),
        latitude: z.string(),
        longitude: z.string(),
        severity: z.enum(["minor", "moderate", "critical"]),
        status: z.enum(["pending", "in-progress", "resolved"]).optional(),
        photos: z.array(z.any()).optional(),
        voiceNote: z.string().optional(),
        anonymous: z.boolean().optional(),
      })

      const validatedData = reportSchema.parse(req.body)

      // If user is authenticated, add userId
      if (req.isAuthenticated() && !validatedData.anonymous) {
        ;(validatedData as any).userId = (req.user as any).id
      }

      const report = await storage.createReport(validatedData as any)
      res.status(201).json(report)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to create report" })
    }
  })

  app.patch("/api/reports/:id/status", async (req, res) => {
    try {
      const { status } = req.body
      if (!status || !["pending", "in-progress", "resolved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" })
      }

      const report = await storage.updateReportStatus(Number.parseInt(req.params.id), status)
      if (!report) {
        return res.status(404).json({ message: "Report not found" })
      }

      res.json(report)
    } catch (error) {
      res.status(500).json({ message: "Failed to update report status" })
    }
  })

  // User reports
  app.get("/api/user/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const reports = await storage.getReportsByUser((req.user as any).id)
      res.json(reports)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reports" })
    }
  })

  // Offline reports
  app.post("/api/offline-reports", async (req, res) => {
    try {
      const offlineReportSchema = z.object({
        reportData: z.any(),
      })

      const validatedData = offlineReportSchema.parse(req.body)
      const offlineReport = await storage.saveOfflineReport(validatedData as any)
      res.status(201).json(offlineReport)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid offline report data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to save offline report" })
    }
  })

  // Educational tips
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getAllTips()
      res.json(tips)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tips" })
    }
  })

  // Achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements()
      res.json(achievements)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" })
    }
  })

  // Admin middleware
  const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const adminUser = await storage.getAdminUser((req.user as any).id)
      if (!adminUser) {
        return res.status(403).json({ message: "Forbidden: Admin access required" })
      }
      ;(req as any).adminUser = adminUser
      next()
    } catch (error) {
      res.status(500).json({ message: "Server error checking admin access" })
    }
  }

  // Admin routes
  app.get("/api/admin/dashboard", isAdmin, async (req, res) => {
    try {
      const reports = await storage.getAllReports()
      const zones = await storage.getAllZones()
      const teams = await storage.getAllTeams()

      const totalReports = reports.length
      const pendingReports = reports.filter((r) => r.status !== "resolved").length
      const resolvedReports = reports.filter((r) => r.status === "resolved").length
      const criticalReports = reports.filter((r) => r.severity === "critical").length

      res.json({
        totalReports,
        pendingReports,
        resolvedReports,
        criticalReports,
        totalZones: zones.length,
        totalTeams: teams.length,
        recentReports: reports.slice(0, 5),
      })
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" })
    }
  })

  // Create the HTTP server
  const httpServer = createServer(app)
  return httpServer
}
