const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

// Your provided SESSION_SECRET
const SESSION_SECRET = "4b2d19bf5112939f3c1ca2396c081de2ddf0f3327e47559352ed76ee251c7824"

console.log("🔐 Setting up SESSION_SECRET for SmartFlow-QATRA...\n")

// Validate the session secret
function validateSessionSecret(secret) {
  if (!secret) {
    console.error("❌ SESSION_SECRET is empty")
    return false
  }

  if (secret.length < 32) {
    console.error("❌ SESSION_SECRET should be at least 32 characters long")
    return false
  }

  console.log("✅ SESSION_SECRET is valid")
  return true
}

// Create or update .env file
function updateEnvFile(secret) {
  const envPath = path.join(process.cwd(), ".env")
  let envContent = ""

  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8")
    console.log("📝 Found existing .env file")
  } else {
    console.log("📝 Creating new .env file")
  }

  // Check if SESSION_SECRET already exists
  const sessionSecretRegex = /^SESSION_SECRET=.*$/m
  const newSessionSecretLine = `SESSION_SECRET=${secret}`

  if (sessionSecretRegex.test(envContent)) {
    // Replace existing SESSION_SECRET
    envContent = envContent.replace(sessionSecretRegex, newSessionSecretLine)
    console.log("🔄 Updated existing SESSION_SECRET")
  } else {
    // Add new SESSION_SECRET
    if (envContent && !envContent.endsWith("\n")) {
      envContent += "\n"
    }
    envContent += newSessionSecretLine + "\n"
    console.log("➕ Added new SESSION_SECRET")
  }

  // Write the updated content
  fs.writeFileSync(envPath, envContent)
  console.log("✅ .env file updated successfully")
}

// Main execution
if (validateSessionSecret(SESSION_SECRET)) {
  updateEnvFile(SESSION_SECRET)

  console.log("\n🎉 SESSION_SECRET setup complete!")
  console.log("\n📋 Next steps:")
  console.log("1. For Vercel deployment:")
  console.log("   vercel env add SESSION_SECRET")
  console.log("   (Enter the value when prompted)")
  console.log("\n2. For other platforms, add this environment variable:")
  console.log(`   SESSION_SECRET=${SESSION_SECRET}`)
  console.log("\n3. Restart your development server to use the new secret")
} else {
  console.error("\n❌ Setup failed. Please check your SESSION_SECRET.")
  process.exit(1)
}
