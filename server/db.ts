import { MongoClient, type Db } from "mongodb"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) return { client, db }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set. Did you forget to provision a database?")
  }

  try {
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    db = client.db("smartflow_qatra")
    console.log("Connected to MongoDB")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB", error)
    throw error
  }
}

export async function initializeDatabase() {
  const { db } = await connectToDatabase()

  // Create indexes for better performance
  await db.collection("users").createIndex({ username: 1 }, { unique: true })
  await db.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true })
  await db.collection("users").createIndex({ oauthProvider: 1, oauthId: 1 }, { unique: true, sparse: true })
  await db.collection("reports").createIndex({ userId: 1 })
  await db.collection("reports").createIndex({ createdAt: -1 })

  console.log("Database initialized with indexes")
}
