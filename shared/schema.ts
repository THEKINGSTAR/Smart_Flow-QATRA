// Keep the existing schema structure but note that we'll be using MongoDB
// The schema definitions will be used as TypeScript interfaces for MongoDB documents

// User schema types
export interface User {
  id: number
  username: string
  password: string
  email?: string
  points: number
  createdAt: Date
  // OAuth fields
  oauthProvider?: string
  oauthId?: string
}

export interface InsertUser {
  username: string
  password: string
  email?: string
}

export interface InsertOAuthUser {
  username: string
  password: string
  email?: string
  oauthProvider: string
  oauthId: string
}

// Report schema types
export interface Report {
  id: number
  userId?: number
  title: string
  description: string
  address: string
  latitude: string
  longitude: string
  severity: string // minor, moderate, critical
  status: string // pending, in-progress, resolved
  photos: any[]
  voiceNote?: string
  anonymous: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InsertReport {
  userId?: number
  title: string
  description: string
  address: string
  latitude: string
  longitude: string
  severity: string
  status?: string
  photos?: any[]
  voiceNote?: string
  anonymous?: boolean
}

// Offline reports temporary storage
export interface OfflineReport {
  id: number
  reportData: any
  createdAt: Date
}

export interface InsertOfflineReport {
  reportData: any
}

// Educational tips
export interface Tip {
  id: number
  title: string
  content: string
  order?: number
}

export interface InsertTip {
  title: string
  content: string
  order?: number
}

// Achievements/badges
export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  pointsRequired: number
}

export interface InsertAchievement {
  name: string
  description: string
  icon: string
  pointsRequired: number
}

// User achievements
export interface UserAchievement {
  id: number
  userId: number
  achievementId: number
  earnedAt: Date
}

export interface InsertUserAchievement {
  userId: number
  achievementId: number
}

// Notifications
export interface Notification {
  id: number
  userId: number
  content: string
  read: boolean
  createdAt: Date
}

export interface InsertNotification {
  userId: number
  content: string
}

// Admin dashboard types

// Zones in the city/region
export interface Zone {
  id: number
  name: string
  description?: string
  color: string // For map visualization
  coordinates?: any // GeoJSON format for map display
  priority: number // Higher number = higher priority
  createdAt: Date
  updatedAt: Date
}

export interface InsertZone {
  name: string
  description?: string
  color?: string
  coordinates?: any
  priority?: number
}

// Reports to zones mapping
export interface ReportToZone {
  id: number
  reportId: number
  zoneId: number
  assignedAt: Date
}

export interface InsertReportToZone {
  reportId: number
  zoneId: number
}

// Inspection teams
export interface Team {
  id: number
  name: string
  description?: string
  contact?: string // Contact information
  memberCount?: number
  createdAt: Date
}

export interface InsertTeam {
  name: string
  description?: string
  contact?: string
  memberCount?: number
}

// Team assignments to zones
export interface TeamAssignment {
  id: number
  teamId: number
  zoneId: number
  status: string // assigned, in-progress, completed
  startDate: Date
  endDate?: Date
  notes?: string
}

export interface InsertTeamAssignment {
  teamId: number
  zoneId: number
  status?: string
  startDate?: Date
  endDate?: Date
  notes?: string
}

// Admin users with roles
export interface AdminUser {
  id: number
  userId: number
  role: string // admin, analyst, planner, inspector
  isSuperAdmin: boolean
  createdAt: Date
}

export interface InsertAdminUser {
  userId: number
  role: string
  isSuperAdmin?: boolean
}
