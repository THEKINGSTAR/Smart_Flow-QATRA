import type {
  User,
  InsertUser,
  InsertOAuthUser,
  Report,
  InsertReport,
  Tip,
  InsertTip,
  Achievement,
  InsertAchievement,
  UserAchievement,
  InsertUserAchievement,
  Notification,
  InsertNotification,
  OfflineReport,
  InsertOfflineReport,
  Zone,
  InsertZone,
  Team,
  InsertTeam,
  TeamAssignment,
  InsertTeamAssignment,
  ReportToZone,
  InsertReportToZone,
  AdminUser,
  InsertAdminUser,
} from "@shared/schema"
import session from "express-session"
import createMemoryStore from "memorystore"
import MongoStore from "connect-mongo"
import { getDb, COLLECTIONS } from "./db"

const MemoryStore = createMemoryStore(session)

// Interface for all storage operations
export interface IStorage {
  // Session store
  sessionStore: session.Store

  // User operations
  getUser(id: number): Promise<User | undefined>
  getUserByUsername(username: string): Promise<User | undefined>
  getUserByOAuth(provider: string, oauthId: string): Promise<User | undefined>
  createUser(user: InsertUser): Promise<User>
  createOAuthUser(user: InsertOAuthUser): Promise<User>
  updateUserPoints(userId: number, points: number): Promise<User>

  // Report operations
  createReport(report: InsertReport): Promise<Report>
  getReport(id: number): Promise<Report | undefined>
  getReportsByUser(userId: number): Promise<Report[]>
  getAllReports(): Promise<Report[]>
  updateReportStatus(id: number, status: string): Promise<Report | undefined>

  // Offline reports
  saveOfflineReport(report: InsertOfflineReport): Promise<OfflineReport>
  getOfflineReports(): Promise<OfflineReport[]>
  deleteOfflineReport(id: number): Promise<void>

  // Tips operations
  createTip(tip: InsertTip): Promise<Tip>
  getAllTips(): Promise<Tip[]>
  getTip(id: number): Promise<Tip | undefined>

  // Achievement operations
  createAchievement(achievement: InsertAchievement): Promise<Achievement>
  getAllAchievements(): Promise<Achievement[]>
  getAchievement(id: number): Promise<Achievement | undefined>
  getUserAchievements(userId: number): Promise<Achievement[]>
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>
  getUserNotifications(userId: number): Promise<Notification[]>
  markNotificationAsRead(id: number): Promise<Notification | undefined>

  // Admin dashboard operations

  // Admin user operations
  getAdminUser(userId: number): Promise<AdminUser | undefined>
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>

  // Dashboard statistics
  getDashboardStats(): Promise<any> // Returns statistics for the admin dashboard

  // Zone operations
  getAllZones(): Promise<Zone[]>
  getZone(id: number): Promise<Zone | undefined>
  createZone(zone: InsertZone): Promise<Zone>
  updateZonePriority(id: number, priority: number): Promise<Zone | undefined>

  // Team operations
  getAllTeams(): Promise<Team[]>
  createTeam(team: InsertTeam): Promise<Team>

  // Team assignment operations
  createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment>
  updateTeamAssignmentStatus(id: number, status: string): Promise<TeamAssignment | undefined>

  // Report to zone assignment
  assignReportToZone(reportZone: InsertReportToZone): Promise<ReportToZone>
}

// MongoDB storage implementation
export class MongoDBStorage implements IStorage {
  sessionStore: session.Store

  constructor() {
    // Create MongoDB session store
    this.sessionStore = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    })

    this.initializeDefaultData()
  }

  // Initialize default data
  private async initializeDefaultData() {
    try {
      const db = await getDb()

      // Check if we have any tips already
      const tipsCount = await db.collection(COLLECTIONS.TIPS).countDocuments()

      if (tipsCount === 0) {
        // Add educational tips
        const defaultTips = [
          {
            title: "Water Saving Tip",
            content:
              "Did you know? A single leaky faucet can waste up to 3,000 gallons of water per year. That's enough to take 180 showers!",
            order: 1,
          },
          {
            title: "Water Saving Tip",
            content: "Fix that drip! A faucet that drips once per second wastes about 3,000 gallons of water per year.",
            order: 2,
          },
          {
            title: "Water Saving Tip",
            content:
              "A running toilet can waste up to 200 gallons of water daily. Check for leaks by adding food coloring to the tank.",
            order: 3,
          },
          {
            title: "Water Saving Tip",
            content: "Outdated fixtures? New WaterSense labeled fixtures can reduce water usage by 20% or more.",
            order: 4,
          },
        ]

        for (const tip of defaultTips) {
          await this.createTip(tip)
        }
      }

      // Check if we have any achievements already
      const achievementsCount = await db.collection(COLLECTIONS.ACHIEVEMENTS).countDocuments()

      if (achievementsCount === 0) {
        // Add default achievements
        const defaultAchievements = [
          {
            name: "First Report",
            description: "Submitted your first water leak report",
            icon: "ri-droplet-fill",
            pointsRequired: 10,
          },
          {
            name: "Photo Reporter",
            description: "Added photos to your reports 5 times",
            icon: "ri-camera-fill",
            pointsRequired: 50,
          },
          {
            name: "Water Guardian",
            description: "Submitted 10 reports",
            icon: "ri-shield-star-fill",
            pointsRequired: 100,
          },
          {
            name: "Community Hero",
            description: "Earned 500 points through reporting",
            icon: "ri-medal-fill",
            pointsRequired: 500,
          },
        ]

        for (const achievement of defaultAchievements) {
          await this.createAchievement(achievement)
        }
      }
    } catch (error) {
      console.error("Error initializing default data:", error)
    }
  }

  // Helper method to generate sequential IDs
  private async getNextId(collectionName: string): Promise<number> {
    const db = await getDb()
    const counters = db.collection("counters")

    const result = await counters.findOneAndUpdate(
      { _id: collectionName },
      { $inc: { sequence_value: 1 } },
      { upsert: true, returnDocument: "after" },
    )

    return result.value.sequence_value
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const db = await getDb()
    const user = await db.collection(COLLECTIONS.USERS).findOne({ id })
    return user as User | undefined
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDb()
    const user = await db.collection(COLLECTIONS.USERS).findOne({ username })
    return user as User | undefined
  }

  async getUserByOAuth(provider: string, oauthId: string): Promise<User | undefined> {
    const db = await getDb()
    const user = await db.collection(COLLECTIONS.USERS).findOne({ oauthProvider: provider, oauthId })
    return user as User | undefined
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.USERS)

    const user: User = {
      ...insertUser,
      id,
      points: 0,
      createdAt: new Date(),
    }

    await db.collection(COLLECTIONS.USERS).insertOne(user)
    return user
  }

  async createOAuthUser(insertUser: InsertOAuthUser): Promise<User> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.USERS)

    const user: User = {
      ...insertUser,
      id,
      points: 0,
      createdAt: new Date(),
    }

    await db.collection(COLLECTIONS.USERS).insertOne(user)
    return user
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const db = await getDb()
    const user = await this.getUser(userId)

    if (!user) {
      throw new Error("User not found")
    }

    const currentPoints = user.points || 0
    const newPoints = currentPoints + points

    await db.collection(COLLECTIONS.USERS).updateOne({ id: userId }, { $set: { points: newPoints } })

    return { ...user, points: newPoints }
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.REPORTS)
    const now = new Date()

    const newReport: Report = {
      ...report,
      id,
      photos: report.photos || [],
      anonymous: report.anonymous || false,
      status: report.status || "pending",
      createdAt: now,
      updatedAt: now,
    }

    await db.collection(COLLECTIONS.REPORTS).insertOne(newReport)

    // If user is authenticated, award points
    if (report.userId) {
      await this.updateUserPoints(report.userId, 10)

      // Create a notification
      await this.createNotification({
        userId: report.userId,
        content: `Thank you for submitting a leak report. You've earned 10 points!`,
      })

      // Check and award achievements
      await this.checkAndAwardAchievements(report.userId)
    }

    return newReport
  }

  async getReport(id: number): Promise<Report | undefined> {
    const db = await getDb()
    const report = await db.collection(COLLECTIONS.REPORTS).findOne({ id })
    return report as Report | undefined
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    const db = await getDb()
    const reports = await db.collection(COLLECTIONS.REPORTS).find({ userId }).toArray()
    return reports as Report[]
  }

  async getAllReports(): Promise<Report[]> {
    const db = await getDb()
    const reports = await db.collection(COLLECTIONS.REPORTS).find().toArray()
    return reports as Report[]
  }

  async updateReportStatus(id: number, status: string): Promise<Report | undefined> {
    const db = await getDb()
    const report = await this.getReport(id)

    if (!report) {
      return undefined
    }

    await db.collection(COLLECTIONS.REPORTS).updateOne(
      { id },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )

    const updatedReport = { ...report, status, updatedAt: new Date() }

    // If the report has a userId (not anonymous), create a notification
    if (report.userId && report.status !== status) {
      await this.createNotification({
        userId: report.userId,
        content: `Your report "${report.title}" has been updated to "${status}".`,
      })
    }

    return updatedReport
  }

  // Offline reports
  async saveOfflineReport(report: InsertOfflineReport): Promise<OfflineReport> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.OFFLINE_REPORTS)

    const offlineReport: OfflineReport = {
      ...report,
      id,
      createdAt: new Date(),
    }

    await db.collection(COLLECTIONS.OFFLINE_REPORTS).insertOne(offlineReport)
    return offlineReport
  }

  async getOfflineReports(): Promise<OfflineReport[]> {
    const db = await getDb()
    const reports = await db.collection(COLLECTIONS.OFFLINE_REPORTS).find().toArray()
    return reports as OfflineReport[]
  }

  async deleteOfflineReport(id: number): Promise<void> {
    const db = await getDb()
    await db.collection(COLLECTIONS.OFFLINE_REPORTS).deleteOne({ id })
  }

  // Tips operations
  async createTip(tip: InsertTip): Promise<Tip> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.TIPS)

    const newTip: Tip = {
      ...tip,
      id,
    }

    await db.collection(COLLECTIONS.TIPS).insertOne(newTip)
    return newTip
  }

  async getAllTips(): Promise<Tip[]> {
    const db = await getDb()
    const tips = await db.collection(COLLECTIONS.TIPS).find().sort({ order: 1 }).toArray()
    return tips as Tip[]
  }

  async getTip(id: number): Promise<Tip | undefined> {
    const db = await getDb()
    const tip = await db.collection(COLLECTIONS.TIPS).findOne({ id })
    return tip as Tip | undefined
  }

  // Achievement operations
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.ACHIEVEMENTS)

    const newAchievement: Achievement = {
      ...achievement,
      id,
    }

    await db.collection(COLLECTIONS.ACHIEVEMENTS).insertOne(newAchievement)
    return newAchievement
  }

  async getAllAchievements(): Promise<Achievement[]> {
    const db = await getDb()
    const achievements = await db.collection(COLLECTIONS.ACHIEVEMENTS).find().toArray()
    return achievements as Achievement[]
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    const db = await getDb()
    const achievement = await db.collection(COLLECTIONS.ACHIEVEMENTS).findOne({ id })
    return achievement as Achievement | undefined
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const db = await getDb()

    // Get all user achievement IDs
    const userAchievements = await db.collection(COLLECTIONS.USER_ACHIEVEMENTS).find({ userId }).toArray()

    if (userAchievements.length === 0) {
      return []
    }

    // Get the achievement IDs
    const achievementIds = userAchievements.map((ua) => ua.achievementId)

    // Get all those achievements
    const achievements = await db
      .collection(COLLECTIONS.ACHIEVEMENTS)
      .find({ id: { $in: achievementIds } })
      .toArray()

    return achievements as Achievement[]
  }

  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const db = await getDb()

    // Check if user already has this achievement
    const existing = await db.collection(COLLECTIONS.USER_ACHIEVEMENTS).findOne({
      userId: userAchievement.userId,
      achievementId: userAchievement.achievementId,
    })

    if (existing) {
      return existing as UserAchievement
    }

    const id = await this.getNextId(COLLECTIONS.USER_ACHIEVEMENTS)

    const newUserAchievement: UserAchievement = {
      ...userAchievement,
      id,
      earnedAt: new Date(),
    }

    await db.collection(COLLECTIONS.USER_ACHIEVEMENTS).insertOne(newUserAchievement)

    // Get achievement details to create a notification
    const achievement = await this.getAchievement(userAchievement.achievementId)

    if (achievement) {
      await this.createNotification({
        userId: userAchievement.userId,
        content: `Congratulations! You've earned the "${achievement.name}" achievement!`,
      })
    }

    return newUserAchievement
  }

  private async checkAndAwardAchievements(userId: number): Promise<void> {
    const user = await this.getUser(userId)
    if (!user) return

    const userReports = await this.getReportsByUser(userId)
    const achievements = await this.getAllAchievements()

    // Check First Report achievement
    if (userReports.length === 1) {
      const firstReportAchievement = achievements.find((a) => a.name === "First Report")
      if (firstReportAchievement && user.points >= firstReportAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: firstReportAchievement.id,
        })
      }
    }

    // Check Photo Reporter achievement
    const reportsWithPhotos = userReports.filter((r) => r.photos && Array.isArray(r.photos) && r.photos.length > 0)

    if (reportsWithPhotos.length >= 5) {
      const photoReporterAchievement = achievements.find((a) => a.name === "Photo Reporter")
      if (photoReporterAchievement && user.points >= photoReporterAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: photoReporterAchievement.id,
        })
      }
    }

    // Check Water Guardian achievement
    if (userReports.length >= 10) {
      const waterGuardianAchievement = achievements.find((a) => a.name === "Water Guardian")
      if (waterGuardianAchievement && user.points >= waterGuardianAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: waterGuardianAchievement.id,
        })
      }
    }

    // Check Community Hero achievement
    if (user.points >= 500) {
      const communityHeroAchievement = achievements.find((a) => a.name === "Community Hero")
      if (communityHeroAchievement) {
        await this.awardAchievement({
          userId,
          achievementId: communityHeroAchievement.id,
        })
      }
    }
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.NOTIFICATIONS)

    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date(),
    }

    await db.collection(COLLECTIONS.NOTIFICATIONS).insertOne(newNotification)
    return newNotification
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    const db = await getDb()
    const notifications = await db
      .collection(COLLECTIONS.NOTIFICATIONS)
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    return notifications as Notification[]
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const db = await getDb()
    const notification = await db.collection(COLLECTIONS.NOTIFICATIONS).findOne({ id })

    if (!notification) {
      return undefined
    }

    await db.collection(COLLECTIONS.NOTIFICATIONS).updateOne({ id }, { $set: { read: true } })

    return { ...notification, read: true } as Notification
  }

  // Admin user operations
  async getAdminUser(userId: number): Promise<AdminUser | undefined> {
    const db = await getDb()
    const adminUser = await db.collection(COLLECTIONS.ADMIN_USERS).findOne({ userId })
    return adminUser as AdminUser | undefined
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.ADMIN_USERS)

    const newAdminUser: AdminUser = {
      ...adminUser,
      id,
      isSuperAdmin: adminUser.isSuperAdmin || false,
      createdAt: new Date(),
    }

    await db.collection(COLLECTIONS.ADMIN_USERS).insertOne(newAdminUser)
    return newAdminUser
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const db = await getDb()
    const allReports = await this.getAllReports()
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Count reports from last 24 hours
    const reportsLast24h = allReports.filter((report) => report.createdAt && report.createdAt >= oneDayAgo).length

    // Count reports from last 7 days
    const reportsLast7d = allReports.filter((report) => report.createdAt && report.createdAt >= sevenDaysAgo).length

    // Count resolved reports
    const resolvedReports = allReports.filter((report) => report.status === "resolved").length

    // Count unresolved reports
    const unresolvedReports = allReports.filter((report) => report.status !== "resolved").length

    // Count critical reports
    const criticalReports = allReports.filter((report) => report.severity === "critical").length

    // Get zone stats
    const zones = await this.getAllZones()
    const zoneStats = await Promise.all(
      zones.map(async (zone) => {
        const zoneReports = await this.getReportsByZone(zone.id)
        const unresolvedCount = zoneReports.filter((r) => r.status !== "resolved").length
        const criticalCount = zoneReports.filter((r) => r.severity === "critical").length

        return {
          id: zone.id,
          name: zone.name,
          reportCount: zoneReports.length,
          unresolvedCount,
          criticalCount,
        }
      }),
    )

    return {
      totalReports: allReports.length,
      reportsLast24h,
      reportsLast7d,
      resolvedReports,
      unresolvedReports,
      criticalReports,
      zones: zoneStats,
    }
  }

  // Helper method to get reports by zone
  private async getReportsByZone(zoneId: number): Promise<Report[]> {
    const db = await getDb()

    // Get report IDs in this zone from the reports_to_zones collection
    const reportToZoneRows = await db.collection(COLLECTIONS.REPORTS_TO_ZONES).find({ zoneId }).toArray()

    if (reportToZoneRows.length === 0) {
      return []
    }

    const reportIds = reportToZoneRows.map((rtz) => rtz.reportId)

    // Get the reports
    const reports = await db
      .collection(COLLECTIONS.REPORTS)
      .find({ id: { $in: reportIds } })
      .toArray()

    return reports as Report[]
  }

  // Zone operations
  async getAllZones(): Promise<Zone[]> {
    const db = await getDb()
    const zones = await db.collection(COLLECTIONS.ZONES).find().toArray()
    return zones as Zone[]
  }

  async getZone(id: number): Promise<Zone | undefined> {
    const db = await getDb()
    const zone = await db.collection(COLLECTIONS.ZONES).findOne({ id })
    return zone as Zone | undefined
  }

  async createZone(zone: InsertZone): Promise<Zone> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.ZONES)

    const newZone: Zone = {
      ...zone,
      id,
      color: zone.color || "#3B82F6",
      priority: zone.priority || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(COLLECTIONS.ZONES).insertOne(newZone)
    return newZone
  }

  async updateZonePriority(id: number, priority: number): Promise<Zone | undefined> {
    const db = await getDb()
    const zone = await this.getZone(id)

    if (!zone) {
      return undefined
    }

    await db.collection(COLLECTIONS.ZONES).updateOne({ id }, { $set: { priority } })

    return { ...zone, priority }
  }

  // Team operations
  async getAllTeams(): Promise<Team[]> {
    const db = await getDb()
    const teams = await db.collection(COLLECTIONS.TEAMS).find().toArray()
    return teams as Team[]
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.TEAMS)

    const newTeam: Team = {
      ...team,
      id,
      createdAt: new Date(),
    }

    await db.collection(COLLECTIONS.TEAMS).insertOne(newTeam)
    return newTeam
  }

  // Team assignment operations
  async createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.TEAM_ASSIGNMENTS)

    const newTeamAssignment: TeamAssignment = {
      ...assignment,
      id,
      status: assignment.status || "assigned",
      startDate: assignment.startDate || new Date(),
    }

    await db.collection(COLLECTIONS.TEAM_ASSIGNMENTS).insertOne(newTeamAssignment)
    return newTeamAssignment
  }

  async updateTeamAssignmentStatus(id: number, status: string): Promise<TeamAssignment | undefined> {
    const db = await getDb()
    const assignment = await db.collection(COLLECTIONS.TEAM_ASSIGNMENTS).findOne({ id })

    if (!assignment) {
      return undefined
    }

    await db.collection(COLLECTIONS.TEAM_ASSIGNMENTS).updateOne({ id }, { $set: { status } })

    return { ...assignment, status } as TeamAssignment
  }

  // Report to zone assignment
  async assignReportToZone(reportZone: InsertReportToZone): Promise<ReportToZone> {
    const db = await getDb()
    const id = await this.getNextId(COLLECTIONS.REPORTS_TO_ZONES)

    const newReportToZone: ReportToZone = {
      ...reportZone,
      id,
      assignedAt: new Date(),
    }

    await db.collection(COLLECTIONS.REPORTS_TO_ZONES).insertOne(newReportToZone)
    return newReportToZone
  }
}

// Use the MongoDB storage implementation
export const storage = new MongoDBStorage()
