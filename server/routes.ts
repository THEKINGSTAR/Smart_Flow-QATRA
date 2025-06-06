import type { Express, Request, Response, NextFunction } from "express"
import { createServer, type Server } from "http"
import { storage } from "./storage"
import { setupAuth } from "./auth"
import { z } from "zod"
import {
  insertReportSchema,
  insertOfflineReportSchema,
  insertZoneSchema,
  insertTeamSchema,
  insertTeamAssignmentSchema,
  insertReportToZoneSchema,
  insertAdminUserSchema,
  type AdminUser,
} from "@shared/schema"

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
      const validatedData = insertReportSchema.parse(req.body)

      // If user is authenticated, add userId
      if (req.isAuthenticated() && !validatedData.anonymous) {
        validatedData.userId = req.user.id
      }

      const report = await storage.createReport(validatedData)
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
      const reports = await storage.getReportsByUser(req.user.id)
      res.json(reports)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user reports" })
    }
  })

  // Offline reports
  app.post("/api/offline-reports", async (req, res) => {
    try {
      const validatedData = insertOfflineReportSchema.parse(req.body)
      const offlineReport = await storage.saveOfflineReport(validatedData)
      res.status(201).json(offlineReport)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid offline report data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to save offline report" })
    }
  })

  app.get("/api/offline-reports", async (req, res) => {
    try {
      const offlineReports = await storage.getOfflineReports()
      res.json(offlineReports)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offline reports" })
    }
  })

  app.delete("/api/offline-reports/:id", async (req, res) => {
    try {
      await storage.deleteOfflineReport(Number.parseInt(req.params.id))
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ message: "Failed to delete offline report" })
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

  app.get("/api/tips/:id", async (req, res) => {
    try {
      const tip = await storage.getTip(Number.parseInt(req.params.id))
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" })
      }
      res.json(tip)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tip" })
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

  app.get("/api/user/achievements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const achievements = await storage.getUserAchievements(req.user.id)
      res.json(achievements)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" })
    }
  })

  // Notifications
  app.get("/api/user/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const notifications = await storage.getUserNotifications(req.user.id)
      res.json(notifications)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" })
    }
  })

  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const notification = await storage.markNotificationAsRead(Number.parseInt(req.params.id))
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" })
      }

      // Make sure the notification belongs to the authenticated user
      if (notification.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" })
      }

      res.json(notification)
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" })
    }
  })

  // Admin dashboard middleware to check if user is admin
  const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      // Check if user has admin role
      const adminUser = await storage.getAdminUser(req.user.id)
      if (!adminUser) {
        return res.status(403).json({ message: "Forbidden: Admin access required" })
      }
      // Add the admin user to the request
      ;(req as any).adminUser = adminUser
      next()
    } catch (error) {
      res.status(500).json({ message: "Server error checking admin access" })
    }
  }

  // Admin role-based middleware
  const hasRole = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const adminUser = (req as any).adminUser as AdminUser
        if (!adminUser) {
          return res.status(403).json({ message: "Forbidden: Admin access required" })
        }

        if (allowedRoles.includes(adminUser.role) || adminUser.role === "admin" || adminUser.isSuperAdmin) {
          next()
        } else {
          res.status(403).json({
            message: `Forbidden: Required role (${allowedRoles.join(", ")}) not found`,
            yourRole: adminUser.role,
          })
        }
      } catch (error) {
        res.status(500).json({ message: "Server error checking role permissions" })
      }
    }
  }

  // ADMIN ROUTES

  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      // User should already be authenticated by Passport
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Check if user has admin role
      const adminUser = await storage.getAdminUser(req.user.id)
      if (!adminUser) {
        return res.status(403).json({ message: "Access denied: Not an admin user" })
      }

      // Return admin user info
      res.json({
        ...req.user,
        adminRole: adminUser.role,
        isSuperAdmin: adminUser.isSuperAdmin,
      })
    } catch (error) {
      res.status(500).json({ message: "Failed to process admin login" })
    }
  })

  app.post("/api/admin/register", async (req, res) => {
    try {
      // User should already be registered and authenticated by the regular auth flow
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "User must be authenticated" })
      }

      // Check if already an admin user
      const existingAdmin = await storage.getAdminUser(req.user.id)
      if (existingAdmin) {
        return res.status(400).json({ message: "User is already an admin" })
      }

      // Validate admin user data
      const validatedData = insertAdminUserSchema.parse({
        ...req.body,
        userId: req.user.id,
      })

      // Create admin user
      const adminUser = await storage.createAdminUser(validatedData)
      res.status(201).json({
        ...req.user,
        adminRole: adminUser.role,
        isSuperAdmin: adminUser.isSuperAdmin,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid admin data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to register admin user" })
    }
  })

  // Admin Dashboard
  app.get("/api/admin/dashboard", isAdmin, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats()

      // Get additional data for dashboard
      const reports = await storage.getAllReports()
      const zones = await storage.getAllZones()
      const teams = await storage.getAllTeams()

      // Calculate key metrics
      const totalReports = reports.length
      const pendingReports = reports.filter((r) => r.status !== "resolved").length
      const resolvedReports = reports.filter((r) => r.status === "resolved").length
      const criticalReports = reports.filter((r) => r.severity === "critical").length

      // Return combined dashboard data
      res.json({
        totalReports,
        pendingReports,
        resolvedReports,
        criticalReports,
        totalZones: zones.length,
        totalTeams: teams.length,
        recentReports: reports.slice(0, 5), // Last 5 reports
        stats,
      })
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" })
    }
  })

  // Zones management
  app.get("/api/admin/zones", isAdmin, async (req, res) => {
    try {
      const zones = await storage.getAllZones()
      res.json(zones)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zones" })
    }
  })

  app.post("/api/admin/zones", isAdmin, hasRole(["admin", "planner"]), async (req, res) => {
    try {
      const validatedData = insertZoneSchema.parse(req.body)
      const zone = await storage.createZone(validatedData)
      res.status(201).json(zone)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid zone data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to create zone" })
    }
  })

  app.get("/api/admin/zones/:id", isAdmin, async (req, res) => {
    try {
      const zone = await storage.getZone(Number.parseInt(req.params.id))
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" })
      }
      res.json(zone)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zone" })
    }
  })

  app.patch("/api/admin/zones/:id/priority", isAdmin, hasRole(["admin", "planner"]), async (req, res) => {
    try {
      const { priority } = req.body
      if (typeof priority !== "number") {
        return res.status(400).json({ message: "Invalid priority value" })
      }

      const zone = await storage.updateZonePriority(Number.parseInt(req.params.id), priority)
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" })
      }

      res.json(zone)
    } catch (error) {
      res.status(500).json({ message: "Failed to update zone priority" })
    }
  })

  // Teams management
  app.get("/api/admin/teams", isAdmin, async (req, res) => {
    try {
      const teams = await storage.getAllTeams()
      res.json(teams)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" })
    }
  })

  app.post("/api/admin/teams", isAdmin, hasRole(["admin", "planner"]), async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body)
      const team = await storage.createTeam(validatedData)
      res.status(201).json(team)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to create team" })
    }
  })

  // Team assignments
  app.post("/api/admin/team-assignments", isAdmin, hasRole(["admin", "planner"]), async (req, res) => {
    try {
      const validatedData = insertTeamAssignmentSchema.parse(req.body)
      const assignment = await storage.createTeamAssignment(validatedData)
      res.status(201).json(assignment)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to create team assignment" })
    }
  })

  app.patch(
    "/api/admin/team-assignments/:id/status",
    isAdmin,
    hasRole(["admin", "planner", "inspector"]),
    async (req, res) => {
      try {
        const { status } = req.body
        if (!status || !["assigned", "in-progress", "completed"].includes(status)) {
          return res.status(400).json({ message: "Invalid status value" })
        }

        const assignment = await storage.updateTeamAssignmentStatus(Number.parseInt(req.params.id), status)
        if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" })
        }

        res.json(assignment)
      } catch (error) {
        res.status(500).json({ message: "Failed to update assignment status" })
      }
    },
  )

  // Report to zone assignments
  app.post("/api/admin/report-zones", isAdmin, hasRole(["admin", "planner"]), async (req, res) => {
    try {
      const validatedData = insertReportToZoneSchema.parse(req.body)
      const reportZone = await storage.assignReportToZone(validatedData)
      res.status(201).json(reportZone)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report zone data", errors: error.errors })
      }
      res.status(500).json({ message: "Failed to assign report to zone" })
    }
  })

  // Create the HTTP server
  const httpServer = createServer(app)
  return httpServer
}
