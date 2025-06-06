import { MongoClient, type Db } from "mongodb"

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smartflow"

// MongoDB client
let client: MongoClient
let db: Db

// Connect to MongoDB
export async function connectToDatabase() {
  if (db) return { client, db }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set. Did you forget to provision a database?")
  }

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI)
    db = client.db()
    console.log("Connected to MongoDB")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB", error)
    throw error
  }
}

// Get MongoDB database instance
export async function getDb() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  REPORTS: "reports",
  OFFLINE_REPORTS: "offline_reports",
  TIPS: "tips",
  ACHIEVEMENTS: "achievements",
  USER_ACHIEVEMENTS: "user_achievements",
  NOTIFICATIONS: "notifications",
  ZONES: "zones",
  REPORTS_TO_ZONES: "reports_to_zones",
  TEAMS: "teams",
  TEAM_ASSIGNMENTS: "team_assignments",
  ADMIN_USERS: "admin_users",
}

// Initialize database with indexes
export async function initializeDatabase() {
  const db = await getDb()

  // Create indexes
  await db.collection(COLLECTIONS.USERS).createIndex({ username: 1 }, { unique: true })
  await db.collection(COLLECTIONS.USERS).createIndex({ oauthProvider: 1, oauthId: 1 })

  // Other indexes as needed
  await db.collection(COLLECTIONS.REPORTS).createIndex({ userId: 1 })
  await db.collection(COLLECTIONS.NOTIFICATIONS).createIndex({ userId: 1 })
  await db.collection(COLLECTIONS.USER_ACHIEVEMENTS).createIndex({ userId: 1 })

  console.log("Database initialized with indexes")
}
