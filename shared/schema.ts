import { pgTable, text, serial, integer, boolean, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Report schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  severity: text("severity").notNull(), // minor, moderate, critical
  status: text("status").default("pending").notNull(), // pending, in-progress, resolved
  photos: jsonb("photos").default([]),
  voiceNote: text("voice_note"),
  anonymous: boolean("anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Offline reports temporary storage
export const offlineReports = pgTable("offline_reports", {
  id: serial("id").primaryKey(),
  reportData: jsonb("report_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOfflineReportSchema = createInsertSchema(offlineReports).omit({
  id: true,
  createdAt: true,
});

// Educational tips
export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order"),
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
});

// Achievements/badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  pointsRequired: integer("points_required").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

// User achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  read: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertOfflineReport = z.infer<typeof insertOfflineReportSchema>;
export type OfflineReport = typeof offlineReports.$inferSelect;

export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tips.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Admin dashboard tables

// Zones in the city/region
export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3B82F6"), // For map visualization
  coordinates: jsonb("coordinates"), // GeoJSON format for map display
  priority: integer("priority").default(0), // Higher number = higher priority
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertZoneSchema = createInsertSchema(zones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Add zone relation to reports
export const reportsToZones = pgTable("reports_to_zones", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").references(() => reports.id).notNull(),
  zoneId: integer("zone_id").references(() => zones.id).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
}, (table) => {
  return {
    unq: unique().on(table.reportId, table.zoneId),
  };
});

export const insertReportToZoneSchema = createInsertSchema(reportsToZones).omit({
  id: true,
  assignedAt: true,
});

// Inspection teams
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  contact: text("contact"), // Contact information
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

// Team assignments to zones
export const teamAssignments = pgTable("team_assignments", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  zoneId: integer("zone_id").references(() => zones.id).notNull(),
  status: text("status").default("assigned").notNull(), // assigned, in-progress, completed
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  notes: text("notes"),
});

export const insertTeamAssignmentSchema = createInsertSchema(teamAssignments).omit({
  id: true,
});

// Admin users with roles
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // admin, analyst, planner, inspector
  isSuperAdmin: boolean("is_super_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

// Types for admin dashboard tables
export type InsertZone = z.infer<typeof insertZoneSchema>;
export type Zone = typeof zones.$inferSelect;

export type InsertReportToZone = z.infer<typeof insertReportToZoneSchema>;
export type ReportToZone = typeof reportsToZones.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertTeamAssignment = z.infer<typeof insertTeamAssignmentSchema>;
export type TeamAssignment = typeof teamAssignments.$inferSelect;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Define relations between tables
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  userAchievements: many(userAchievements),
  notifications: many(notifications),
  adminUser: many(adminUsers),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  zoneAssignments: many(reportsToZones),
}));

export const zonesRelations = relations(zones, ({ many }) => ({
  reportAssignments: many(reportsToZones),
  teamAssignments: many(teamAssignments),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  assignments: many(teamAssignments),
}));

export const reportsToZonesRelations = relations(reportsToZones, ({ one }) => ({
  report: one(reports, {
    fields: [reportsToZones.reportId],
    references: [reports.id],
  }),
  zone: one(zones, {
    fields: [reportsToZones.zoneId],
    references: [zones.id],
  }),
}));

export const teamAssignmentsRelations = relations(teamAssignments, ({ one }) => ({
  team: one(teams, {
    fields: [teamAssignments.teamId],
    references: [teams.id],
  }),
  zone: one(zones, {
    fields: [teamAssignments.zoneId],
    references: [zones.id],
  }),
}));

export const adminUsersRelations = relations(adminUsers, ({ one }) => ({
  user: one(users, {
    fields: [adminUsers.userId],
    references: [users.id],
  }),
}));
