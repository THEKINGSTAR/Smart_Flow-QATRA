import { 
  User, InsertUser, Report, InsertReport, 
  Tip, InsertTip, Achievement, InsertAchievement,
  UserAchievement, InsertUserAchievement, Notification, InsertNotification,
  OfflineReport, InsertOfflineReport,
  Zone, InsertZone, Team, InsertTeam, TeamAssignment, InsertTeamAssignment,
  ReportToZone, InsertReportToZone, AdminUser, InsertAdminUser,
  users, reports, tips, achievements, userAchievements, notifications, offlineReports,
  zones, teams, teamAssignments, reportsToZones, adminUsers
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Interface for all storage operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  
  // Report operations
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: number): Promise<Report | undefined>;
  getReportsByUser(userId: number): Promise<Report[]>;
  getAllReports(): Promise<Report[]>;
  updateReportStatus(id: number, status: string): Promise<Report | undefined>;
  
  // Offline reports
  saveOfflineReport(report: InsertOfflineReport): Promise<OfflineReport>;
  getOfflineReports(): Promise<OfflineReport[]>;
  deleteOfflineReport(id: number): Promise<void>;
  
  // Tips operations
  createTip(tip: InsertTip): Promise<Tip>;
  getAllTips(): Promise<Tip[]>;
  getTip(id: number): Promise<Tip | undefined>;
  
  // Achievement operations
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAllAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Admin dashboard operations
  
  // Admin user operations
  getAdminUser(userId: number): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<any>; // Returns statistics for the admin dashboard
  
  // Zone operations
  getAllZones(): Promise<Zone[]>;
  getZone(id: number): Promise<Zone | undefined>;
  createZone(zone: InsertZone): Promise<Zone>;
  updateZonePriority(id: number, priority: number): Promise<Zone | undefined>;
  
  // Team operations
  getAllTeams(): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  
  // Team assignment operations
  createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment>;
  updateTeamAssignmentStatus(id: number, status: string): Promise<TeamAssignment | undefined>;
  
  // Report to zone assignment
  assignReportToZone(reportZone: InsertReportToZone): Promise<ReportToZone>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reports: Map<number, Report>;
  private offlineReports: Map<number, OfflineReport>;
  private tips: Map<number, Tip>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private notifications: Map<number, Notification>;
  
  // Admin dashboard data
  private adminUsers: Map<number, AdminUser>;
  private zones: Map<number, Zone>;
  private teams: Map<number, Team>;
  private teamAssignments: Map<number, TeamAssignment>;
  private reportsToZones: Map<number, ReportToZone>;
  
  sessionStore: session.Store;
  
  currentUserId: number;
  currentReportId: number;
  currentOfflineReportId: number;
  currentTipId: number;
  currentAchievementId: number;
  currentUserAchievementId: number;
  currentNotificationId: number;
  currentAdminUserId: number;
  currentZoneId: number;
  currentTeamId: number;
  currentTeamAssignmentId: number;
  currentReportToZoneId: number;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.offlineReports = new Map();
    this.tips = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.notifications = new Map();
    
    // Initialize admin dashboard data maps
    this.adminUsers = new Map();
    this.zones = new Map();
    this.teams = new Map();
    this.teamAssignments = new Map();
    this.reportsToZones = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    this.currentUserId = 1;
    this.currentReportId = 1;
    this.currentOfflineReportId = 1;
    this.currentTipId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    this.currentNotificationId = 1;
    this.currentAdminUserId = 1;
    this.currentZoneId = 1;
    this.currentTeamId = 1;
    this.currentTeamAssignmentId = 1;
    this.currentReportToZoneId = 1;
    
    // Initialize with default educational tips
    this.initializeDefaultData();
  }

  // Initialize default data
  private initializeDefaultData() {
    // Add educational tips
    const defaultTips = [
      { title: "Water Saving Tip", content: "Did you know? A single leaky faucet can waste up to 3,000 gallons of water per year. That's enough to take 180 showers!", order: 1 },
      { title: "Water Saving Tip", content: "Fix that drip! A faucet that drips once per second wastes about 3,000 gallons of water per year.", order: 2 },
      { title: "Water Saving Tip", content: "A running toilet can waste up to 200 gallons of water daily. Check for leaks by adding food coloring to the tank.", order: 3 },
      { title: "Water Saving Tip", content: "Outdated fixtures? New WaterSense labeled fixtures can reduce water usage by 20% or more.", order: 4 }
    ];
    
    defaultTips.forEach(tip => {
      this.createTip({
        title: tip.title,
        content: tip.content,
        order: tip.order
      });
    });
    
    // Add default achievements
    const defaultAchievements = [
      { name: "First Report", description: "Submitted your first water leak report", icon: "ri-droplet-fill", pointsRequired: 10 },
      { name: "Photo Reporter", description: "Added photos to your reports 5 times", icon: "ri-camera-fill", pointsRequired: 50 },
      { name: "Water Guardian", description: "Submitted 10 reports", icon: "ri-shield-star-fill", pointsRequired: 100 },
      { name: "Community Hero", description: "Earned 500 points through reporting", icon: "ri-medal-fill", pointsRequired: 500 }
    ];
    
    defaultAchievements.forEach(achievement => {
      this.createAchievement({
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        pointsRequired: achievement.pointsRequired
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser: User = {
      ...user,
      points: user.points + points
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const now = new Date();
    
    const newReport: Report = {
      ...report,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.reports.set(id, newReport);
    
    // If user is authenticated, award points
    if (report.userId) {
      await this.updateUserPoints(report.userId, 10);
      
      // Create a notification
      await this.createNotification({
        userId: report.userId,
        content: `Thank you for submitting a leak report. You've earned 10 points!`
      });
      
      // Check and award achievements
      await this.checkAndAwardAchievements(report.userId);
    }
    
    return newReport;
  }

  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.userId === userId
    );
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async updateReportStatus(id: number, status: string): Promise<Report | undefined> {
    const report = await this.getReport(id);
    
    if (!report) {
      return undefined;
    }
    
    const updatedReport: Report = {
      ...report,
      status,
      updatedAt: new Date()
    };
    
    this.reports.set(id, updatedReport);
    
    // If the report has a userId (not anonymous), create a notification
    if (report.userId && report.status !== status) {
      await this.createNotification({
        userId: report.userId,
        content: `Your report "${report.title}" has been updated to "${status}".`
      });
    }
    
    return updatedReport;
  }
  
  // Offline reports
  async saveOfflineReport(report: InsertOfflineReport): Promise<OfflineReport> {
    const id = this.currentOfflineReportId++;
    
    const offlineReport: OfflineReport = {
      ...report,
      id,
      createdAt: new Date()
    };
    
    this.offlineReports.set(id, offlineReport);
    return offlineReport;
  }
  
  async getOfflineReports(): Promise<OfflineReport[]> {
    return Array.from(this.offlineReports.values());
  }
  
  async deleteOfflineReport(id: number): Promise<void> {
    this.offlineReports.delete(id);
  }

  // Tips operations
  async createTip(tip: InsertTip): Promise<Tip> {
    const id = this.currentTipId++;
    
    const newTip: Tip = {
      ...tip,
      id
    };
    
    this.tips.set(id, newTip);
    return newTip;
  }

  async getAllTips(): Promise<Tip[]> {
    return Array.from(this.tips.values()).sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
  }

  async getTip(id: number): Promise<Tip | undefined> {
    return this.tips.get(id);
  }

  // Achievement operations
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    
    const newAchievement: Achievement = {
      ...achievement,
      id
    };
    
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const userAchievementIds = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);
    
    return Array.from(this.achievements.values())
      .filter(achievement => userAchievementIds.includes(achievement.id));
  }

  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    // Check if user already has this achievement
    const existing = Array.from(this.userAchievements.values()).find(
      ua => ua.userId === userAchievement.userId && ua.achievementId === userAchievement.achievementId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.currentUserAchievementId++;
    
    const newUserAchievement: UserAchievement = {
      ...userAchievement,
      id,
      earnedAt: new Date()
    };
    
    this.userAchievements.set(id, newUserAchievement);
    
    // Get achievement details to create a notification
    const achievement = await this.getAchievement(userAchievement.achievementId);
    
    if (achievement) {
      await this.createNotification({
        userId: userAchievement.userId,
        content: `Congratulations! You've earned the "${achievement.name}" achievement!`
      });
    }
    
    return newUserAchievement;
  }

  private async checkAndAwardAchievements(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    
    const userReports = await this.getReportsByUser(userId);
    const achievements = await this.getAllAchievements();
    
    // Check First Report achievement
    if (userReports.length === 1) {
      const firstReportAchievement = achievements.find(a => a.name === "First Report");
      if (firstReportAchievement && user.points >= firstReportAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: firstReportAchievement.id
        });
      }
    }
    
    // Check Photo Reporter achievement
    const reportsWithPhotos = userReports.filter(r => 
      r.photos && Array.isArray(r.photos) && r.photos.length > 0
    );
    
    if (reportsWithPhotos.length >= 5) {
      const photoReporterAchievement = achievements.find(a => a.name === "Photo Reporter");
      if (photoReporterAchievement && user.points >= photoReporterAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: photoReporterAchievement.id
        });
      }
    }
    
    // Check Water Guardian achievement
    if (userReports.length >= 10) {
      const waterGuardianAchievement = achievements.find(a => a.name === "Water Guardian");
      if (waterGuardianAchievement && user.points >= waterGuardianAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: waterGuardianAchievement.id
        });
      }
    }
    
    // Check Community Hero achievement
    if (user.points >= 500) {
      const communityHeroAchievement = achievements.find(a => a.name === "Community Hero");
      if (communityHeroAchievement) {
        await this.awardAchievement({
          userId,
          achievementId: communityHeroAchievement.id
        });
      }
    }
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    
    const newNotification: Notification = {
      ...notification,
      id,
      read: false,
      createdAt: new Date()
    };
    
    this.notifications.set(id, newNotification);
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    
    if (!notification) {
      return undefined;
    }
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  // Admin user operations
  async getAdminUser(userId: number): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(
      (adminUser) => adminUser.userId === userId
    );
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const id = this.currentAdminUserId++;
    
    const newAdminUser: AdminUser = {
      ...adminUser,
      id
    };
    
    this.adminUsers.set(id, newAdminUser);
    return newAdminUser;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const allReports = await this.getAllReports();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Count reports from last 24 hours
    const reportsLast24h = allReports.filter(
      report => report.createdAt && report.createdAt >= oneDayAgo
    ).length;
    
    // Count reports from last 7 days
    const reportsLast7d = allReports.filter(
      report => report.createdAt && report.createdAt >= sevenDaysAgo
    ).length;
    
    // Count resolved reports
    const resolvedReports = allReports.filter(
      report => report.status === 'resolved'
    ).length;
    
    // Count unresolved reports
    const unresolvedReports = allReports.filter(
      report => report.status !== 'resolved'
    ).length;
    
    // Count critical reports
    const criticalReports = allReports.filter(
      report => report.severity === 'critical'
    ).length;
    
    // Get zone stats
    const zones = await this.getAllZones();
    const zoneStats = await Promise.all(zones.map(async zone => {
      const zoneReports = await this.getReportsByZone(zone.id);
      const unresolvedCount = zoneReports.filter(r => r.status !== 'resolved').length;
      const criticalCount = zoneReports.filter(r => r.severity === 'critical').length;
      
      return {
        id: zone.id,
        name: zone.name,
        reportCount: zoneReports.length,
        unresolvedCount,
        criticalCount
      };
    }));
    
    return {
      totalReports: allReports.length,
      reportsLast24h,
      reportsLast7d,
      resolvedReports,
      unresolvedReports,
      criticalReports,
      zones: zoneStats
    };
  }

  // Helper method to get reports by zone
  private async getReportsByZone(zoneId: number): Promise<Report[]> {
    // Get report IDs in this zone
    const reportIds = Array.from(this.reportsToZones.values())
      .filter(rtz => rtz.zoneId === zoneId)
      .map(rtz => rtz.reportId);
    
    // Get the reports
    return Array.from(this.reports.values())
      .filter(report => reportIds.includes(report.id));
  }

  // Zone operations
  async getAllZones(): Promise<Zone[]> {
    return Array.from(this.zones.values());
  }

  async getZone(id: number): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async createZone(zone: InsertZone): Promise<Zone> {
    const id = this.currentZoneId++;
    
    const newZone: Zone = {
      ...zone,
      id,
      createdAt: new Date()
    };
    
    this.zones.set(id, newZone);
    return newZone;
  }

  async updateZonePriority(id: number, priority: number): Promise<Zone | undefined> {
    const zone = this.zones.get(id);
    
    if (!zone) {
      return undefined;
    }
    
    const updatedZone: Zone = {
      ...zone,
      priority
    };
    
    this.zones.set(id, updatedZone);
    return updatedZone;
  }

  // Team operations
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    
    const newTeam: Team = {
      ...team,
      id,
      createdAt: new Date()
    };
    
    this.teams.set(id, newTeam);
    return newTeam;
  }

  // Team assignment operations
  async createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment> {
    const id = this.currentTeamAssignmentId++;
    
    const newAssignment: TeamAssignment = {
      ...assignment,
      id,
      status: 'assigned',
      createdAt: new Date()
    };
    
    this.teamAssignments.set(id, newAssignment);
    return newAssignment;
  }

  async updateTeamAssignmentStatus(id: number, status: string): Promise<TeamAssignment | undefined> {
    const assignment = this.teamAssignments.get(id);
    
    if (!assignment) {
      return undefined;
    }
    
    const updatedAssignment: TeamAssignment = {
      ...assignment,
      status
    };
    
    this.teamAssignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  // Report to zone assignment
  async assignReportToZone(reportZone: InsertReportToZone): Promise<ReportToZone> {
    const id = this.currentReportToZoneId++;
    
    const newReportToZone: ReportToZone = {
      ...reportZone,
      id,
      createdAt: new Date()
    };
    
    this.reportsToZones.set(id, newReportToZone);
    return newReportToZone;
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
    this.initializeDefaultData();
  }

  // Initialize default data
  private async initializeDefaultData() {
    try {
      // Check if we have any tips already
      const existingTips = await db.select().from(tips);
      
      if (existingTips.length === 0) {
        // Add educational tips
        const defaultTips = [
          { title: "Water Saving Tip", content: "Did you know? A single leaky faucet can waste up to 3,000 gallons of water per year. That's enough to take 180 showers!", order: 1 },
          { title: "Water Saving Tip", content: "Fix that drip! A faucet that drips once per second wastes about 3,000 gallons of water per year.", order: 2 },
          { title: "Water Saving Tip", content: "A running toilet can waste up to 200 gallons of water daily. Check for leaks by adding food coloring to the tank.", order: 3 },
          { title: "Water Saving Tip", content: "Outdated fixtures? New WaterSense labeled fixtures can reduce water usage by 20% or more.", order: 4 }
        ];
        
        for (const tip of defaultTips) {
          await this.createTip({
            title: tip.title,
            content: tip.content,
            order: tip.order
          });
        }
      }
      
      // Check if we have any achievements already
      const existingAchievements = await db.select().from(achievements);
      
      if (existingAchievements.length === 0) {
        // Add default achievements
        const defaultAchievements = [
          { name: "First Report", description: "Submitted your first water leak report", icon: "ri-droplet-fill", pointsRequired: 10 },
          { name: "Photo Reporter", description: "Added photos to your reports 5 times", icon: "ri-camera-fill", pointsRequired: 50 },
          { name: "Water Guardian", description: "Submitted 10 reports", icon: "ri-shield-star-fill", pointsRequired: 100 },
          { name: "Community Hero", description: "Earned 500 points through reporting", icon: "ri-medal-fill", pointsRequired: 500 }
        ];
        
        for (const achievement of defaultAchievements) {
          await this.createAchievement({
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            pointsRequired: achievement.pointsRequired
          });
        }
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const currentPoints = user.points || 0;
    const newPoints = currentPoints + points;
    
    const result = await db
      .update(users)
      .set({ points: newPoints })
      .where(eq(users.id, userId))
      .returning();
      
    return result[0];
  }

  // Report operations
  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    
    // If user is authenticated, award points
    if (report.userId) {
      await this.updateUserPoints(report.userId, 10);
      
      // Create a notification
      await this.createNotification({
        userId: report.userId,
        content: `Thank you for submitting a leak report. You've earned 10 points!`
      });
      
      // Check and award achievements
      await this.checkAndAwardAchievements(report.userId);
    }
    
    return newReport;
  }

  async getReport(id: number): Promise<Report | undefined> {
    const result = await db.select().from(reports).where(eq(reports.id, id));
    return result[0];
  }

  async getReportsByUser(userId: number): Promise<Report[]> {
    return await db.select().from(reports).where(eq(reports.userId, userId));
  }

  async getAllReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async updateReportStatus(id: number, status: string): Promise<Report | undefined> {
    const report = await this.getReport(id);
    
    if (!report) {
      return undefined;
    }
    
    const [updatedReport] = await db
      .update(reports)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(reports.id, id))
      .returning();
    
    // If the report has a userId (not anonymous), create a notification
    if (report.userId && report.status !== status) {
      await this.createNotification({
        userId: report.userId,
        content: `Your report "${report.title}" has been updated to "${status}".`
      });
    }
    
    return updatedReport;
  }
  
  // Offline reports
  async saveOfflineReport(report: InsertOfflineReport): Promise<OfflineReport> {
    const [offlineReport] = await db.insert(offlineReports).values(report).returning();
    return offlineReport;
  }
  
  async getOfflineReports(): Promise<OfflineReport[]> {
    return await db.select().from(offlineReports);
  }
  
  async deleteOfflineReport(id: number): Promise<void> {
    await db.delete(offlineReports).where(eq(offlineReports.id, id));
  }

  // Tips operations
  async createTip(tip: InsertTip): Promise<Tip> {
    const [newTip] = await db.insert(tips).values(tip).returning();
    return newTip;
  }

  async getAllTips(): Promise<Tip[]> {
    return await db
      .select()
      .from(tips)
      .orderBy(tips.order);
  }

  async getTip(id: number): Promise<Tip | undefined> {
    const result = await db.select().from(tips).where(eq(tips.id, id));
    return result[0];
  }

  // Achievement operations
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    const result = await db.select().from(achievements).where(eq(achievements.id, id));
    return result[0];
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    // Get all user achievement IDs
    const userAchievementEntries = await db
      .select({ achievementId: userAchievements.achievementId })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    
    // If no achievements, return empty array
    if (userAchievementEntries.length === 0) {
      return [];
    }
    
    // Get the achievement IDs
    const achievementIds = userAchievementEntries.map(entry => entry.achievementId);
    
    // Get all those achievements
    // If we have achievement IDs to look up
    if (achievementIds.length > 0) {
      // Use a different approach since .in() might not be available
      const results = [];
      for (const id of achievementIds) {
        const [achievement] = await db
          .select()
          .from(achievements)
          .where(eq(achievements.id, id));
        
        if (achievement) {
          results.push(achievement);
        }
      }
      return results;
    }
    return [];
  }

  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    // Check if user already has this achievement
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userAchievement.userId),
          eq(userAchievements.achievementId, userAchievement.achievementId)
        )
      );
    
    if (existing.length > 0) {
      return existing[0];
    }
    
    const [newUserAchievement] = await db
      .insert(userAchievements)
      .values({
        ...userAchievement,
        earnedAt: new Date()
      })
      .returning();
    
    // Get achievement details to create a notification
    const achievement = await this.getAchievement(userAchievement.achievementId);
    
    if (achievement) {
      await this.createNotification({
        userId: userAchievement.userId,
        content: `Congratulations! You've earned the "${achievement.name}" achievement!`
      });
    }
    
    return newUserAchievement;
  }

  private async checkAndAwardAchievements(userId: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;
    
    const userReports = await this.getReportsByUser(userId);
    const achievements = await this.getAllAchievements();
    
    // Check First Report achievement
    if (userReports.length === 1) {
      const firstReportAchievement = achievements.find(a => a.name === "First Report");
      if (firstReportAchievement && user.points >= firstReportAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: firstReportAchievement.id
        });
      }
    }
    
    // Check Photo Reporter achievement
    const reportsWithPhotos = userReports.filter(r => 
      r.photos && Array.isArray(r.photos) && r.photos.length > 0
    );
    
    if (reportsWithPhotos.length >= 5) {
      const photoReporterAchievement = achievements.find(a => a.name === "Photo Reporter");
      if (photoReporterAchievement && user.points >= photoReporterAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: photoReporterAchievement.id
        });
      }
    }
    
    // Check Water Guardian achievement
    if (userReports.length >= 10) {
      const waterGuardianAchievement = achievements.find(a => a.name === "Water Guardian");
      if (waterGuardianAchievement && user.points >= waterGuardianAchievement.pointsRequired) {
        await this.awardAchievement({
          userId,
          achievementId: waterGuardianAchievement.id
        });
      }
    }
    
    // Check Community Hero achievement
    if (user.points >= 500) {
      const communityHeroAchievement = achievements.find(a => a.name === "Community Hero");
      if (communityHeroAchievement) {
        await this.awardAchievement({
          userId,
          achievementId: communityHeroAchievement.id
        });
      }
    }
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values({
        ...notification,
        read: false,
        createdAt: new Date()
      })
      .returning();
      
    return newNotification;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
      
    return updatedNotification;
  }

  // Admin user operations
  async getAdminUser(userId: number): Promise<AdminUser | undefined> {
    const result = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.userId, userId));
    return result[0];
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const [newAdminUser] = await db
      .insert(adminUsers)
      .values({
        userId: adminUser.userId,
        role: adminUser.role,
        isSuperAdmin: adminUser.isSuperAdmin || false,
        createdAt: new Date() // Add the required createdAt field
      })
      .returning();
    return newAdminUser;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<any> {
    const allReports = await this.getAllReports();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Count reports from last 24 hours
    const reportsLast24h = allReports.filter(
      report => report.createdAt && report.createdAt >= oneDayAgo
    ).length;
    
    // Count reports from last 7 days
    const reportsLast7d = allReports.filter(
      report => report.createdAt && report.createdAt >= sevenDaysAgo
    ).length;
    
    // Count resolved reports
    const resolvedReports = allReports.filter(
      report => report.status === 'resolved'
    ).length;
    
    // Count unresolved reports
    const unresolvedReports = allReports.filter(
      report => report.status !== 'resolved'
    ).length;
    
    // Count critical reports
    const criticalReports = allReports.filter(
      report => report.severity === 'critical'
    ).length;
    
    // Get zone stats
    const zones = await this.getAllZones();
    const zoneStats = await Promise.all(zones.map(async zone => {
      const zoneReports = await this.getReportsByZone(zone.id);
      const unresolvedCount = zoneReports.filter(r => r.status !== 'resolved').length;
      const criticalCount = zoneReports.filter(r => r.severity === 'critical').length;
      
      return {
        id: zone.id,
        name: zone.name,
        reportCount: zoneReports.length,
        unresolvedCount,
        criticalCount
      };
    }));
    
    return {
      totalReports: allReports.length,
      reportsLast24h,
      reportsLast7d,
      resolvedReports,
      unresolvedReports,
      criticalReports,
      zones: zoneStats
    };
  }

  // Helper method to get reports by zone
  private async getReportsByZone(zoneId: number): Promise<Report[]> {
    // Get report IDs in this zone from the reports_to_zones table
    const reportToZoneRows = await db
      .select()
      .from(reportsToZones)
      .where(eq(reportsToZones.zoneId, zoneId));
    
    if (reportToZoneRows.length === 0) {
      return [];
    }
    
    const reportIds = reportToZoneRows.map(rtz => rtz.reportId);
    
    // Get the reports
    return await db
      .select()
      .from(reports)
      .where(
        reportIds.map(id => eq(reports.id, id)).reduce((prev, curr) => prev || curr)
      );
  }

  // Zone operations
  async getAllZones(): Promise<Zone[]> {
    return await db.select().from(zones);
  }

  async getZone(id: number): Promise<Zone | undefined> {
    const result = await db.select().from(zones).where(eq(zones.id, id));
    return result[0];
  }

  async createZone(zone: InsertZone): Promise<Zone> {
    const [newZone] = await db
      .insert(zones)
      .values({
        ...zone,
        createdAt: new Date(),
        updatedAt: new Date() // Add the required updatedAt field
      })
      .returning();
    return newZone;
  }

  async updateZonePriority(id: number, priority: number): Promise<Zone | undefined> {
    const zone = await this.getZone(id);
    
    if (!zone) {
      return undefined;
    }
    
    const [updatedZone] = await db
      .update(zones)
      .set({ priority })
      .where(eq(zones.id, id))
      .returning();
    
    return updatedZone;
  }

  // Team operations
  async getAllTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db
      .insert(teams)
      .values({
        ...team,
        createdAt: new Date(),
        description: team.description || null,
        contact: team.contact || null,
        memberCount: team.memberCount || null
      })
      .returning();
    return newTeam;
  }

  // Team assignment operations
  async createTeamAssignment(assignment: InsertTeamAssignment): Promise<TeamAssignment> {
    // Ensure we have all required fields and correct types
    const newTeamAssignment = {
      teamId: assignment.teamId,
      zoneId: assignment.zoneId,
      status: assignment.status || 'assigned',
      startDate: assignment.startDate || new Date(),
      endDate: assignment.endDate || null,
      notes: assignment.notes || null
    };
    
    const [newAssignment] = await db
      .insert(teamAssignments)
      .values(newTeamAssignment)
      .returning();
    return newAssignment;
  }

  async updateTeamAssignmentStatus(id: number, status: string): Promise<TeamAssignment | undefined> {
    const assignment = await db
      .select()
      .from(teamAssignments)
      .where(eq(teamAssignments.id, id));
    
    if (assignment.length === 0) {
      return undefined;
    }
    
    const [updatedAssignment] = await db
      .update(teamAssignments)
      .set({ status })
      .where(eq(teamAssignments.id, id))
      .returning();
    
    return updatedAssignment;
  }

  // Report to zone assignment
  async assignReportToZone(reportZone: InsertReportToZone): Promise<ReportToZone> {
    // Use only the properties that exist in the schema
    const newReportZone = {
      reportId: reportZone.reportId,
      zoneId: reportZone.zoneId,
      assignedAt: new Date() // Set the assignedAt field
    };
    
    const [newReportToZone] = await db
      .insert(reportsToZones)
      .values(newReportZone)
      .returning();
    return newReportToZone;
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
