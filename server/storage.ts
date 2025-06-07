import { MongoClient, type Db } from "mongodb"
import MongoStore from "connect-mongo"

// Type definitions
interface User {
  id: number
  username: string
  password: string
  email?: string
  points?: number
  isAdmin?: boolean
  oauthProvider?: string
  oauthId?: string
  displayName?: string
  firstName?: string
  lastName?: string
  profilePicture?: string | null
  createdAt: Date
  updatedAt?: Date
}

interface InsertUser {
  username: string
  password: string
  email?: string
}

interface Report {
  id: number
  userId?: number
  title: string
  description: string
  address: string
  latitude: string
  longitude: string
  severity: "minor" | "moderate" | "critical"
  status: "pending" | "in-progress" | "resolved"
  photos?: string[]
  voiceNote?: string
  anonymous: boolean
  createdAt: Date
  updatedAt: Date
}

interface InsertReport {
  userId?: number
  title: string
  description: string
  address: string
  latitude: string
  longitude: string
  severity: "minor" | "moderate" | "critical"
  status?: "pending" | "in-progress" | "resolved"
  photos?: string[]
  voiceNote?: string
  anonymous?: boolean
}

// MongoDB connection
let client: MongoClient
let db: Db

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/smartflow"

// Storage implementation
export const storage = {
  sessionStore: MongoStore.create({
    mongoUrl: MONGODB_URI,
    dbName: "smartflow_qatra",
    collectionName: "sessions",
    ttl: 60 * 60 * 24 * 7, // 1 week
  }),

  async init() {
    if (!client) {
      client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db("smartflow_qatra")
      console.log("Connected to MongoDB")
    }
    return { client, db }
  },

  async createUser(userData: InsertUser): Promise<User> {
    await this.init()
    const now = new Date()
    const user: User = {
      ...userData,
      id: Date.now(),
      points: 0,
      createdAt: now,
      updatedAt: now,
    }

    await db.collection("users").insertOne(user)
    return user
  },

  async createOAuthUser(userData: {
    username: string
    password: string
    email: string
    displayName?: string
    firstName?: string
    lastName?: string
    oauthProvider: string
    oauthId: string
    profilePicture?: string | null
  }): Promise<User> {
    await this.init()
    const now = new Date()
    const user: User = {
      id: Date.now(),
      username: userData.username,
      password: userData.password,
      email: userData.email,
      displayName: userData.displayName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      oauthProvider: userData.oauthProvider,
      oauthId: userData.oauthId,
      profilePicture: userData.profilePicture,
      points: 0,
      createdAt: now,
      updatedAt: now,
    }

    await db.collection("users").insertOne(user)
    return user
  },

  async getUser(id: number): Promise<User | null> {
    await this.init()
    return (await db.collection("users").findOne({ id })) as User | null
  },

  async getUserByUsername(username: string): Promise<User | null> {
    await this.init()
    return (await db.collection("users").findOne({ username })) as User | null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await this.init()
    return (await db.collection("users").findOne({ email })) as User | null
  },

  async getUserByOAuth(provider: string, oauthId: string): Promise<User | null> {
    await this.init()
    return (await db.collection("users").findOne({
      oauthProvider: provider,
      oauthId: oauthId,
    })) as User | null
  },

  async createReport(reportData: InsertReport): Promise<Report> {
    await this.init()
    const now = new Date()
    const report: Report = {
      ...reportData,
      id: Date.now(),
      status: reportData.status || "pending",
      photos: reportData.photos || [],
      anonymous: reportData.anonymous || false,
      createdAt: now,
      updatedAt: now,
    }

    await db.collection("reports").insertOne(report)
    return report
  },

  async getReports(filters?: {
    userId?: number
    status?: string
    limit?: number
    offset?: number
  }): Promise<Report[]> {
    await this.init()
    const query: any = {}

    if (filters?.userId) query.userId = filters.userId
    if (filters?.status) query.status = filters.status

    return (await db
      .collection("reports")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 50)
      .skip(filters?.offset || 0)
      .toArray()) as Report[]
  },

  async getReport(id: number): Promise<Report | null> {
    await this.init()
    return (await db.collection("reports").findOne({ id })) as Report | null
  },

  async updateReport(id: number, updates: Partial<Report>): Promise<Report | null> {
    await this.init()
    const result = await db.collection("reports").findOneAndUpdate(
      { id },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )
    return result as Report | null
  },
}
