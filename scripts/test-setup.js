const fs = require("fs")
const path = require("path")

console.log("🧪 Testing SmartFlow-QATRA Setup...\n")

// Test 1: Check required files
const requiredFiles = ["package.json", ".env", "server/index.ts", "client/src/App.tsx", "vite.config.ts"]

console.log("📁 Checking required files:")
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(path.join(process.cwd(), file))
  console.log(`${exists ? "✅" : "❌"} ${file}`)
})

// Test 2: Check environment variables
console.log("\n🔐 Checking environment variables:")
const envPath = path.join(process.cwd(), ".env")
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8")
  const requiredEnvVars = ["MONGODB_URI", "SESSION_SECRET", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]

  requiredEnvVars.forEach((envVar) => {
    const exists = envContent.includes(envVar)
    console.log(`${exists ? "✅" : "❌"} ${envVar}`)
  })
} else {
  console.log("❌ .env file not found")
}

// Test 3: Check package.json scripts
console.log("\n📜 Checking package.json scripts:")
const packagePath = path.join(process.cwd(), "package.json")
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
  const requiredScripts = ["dev", "build", "start"]

  requiredScripts.forEach((script) => {
    const exists = packageJson.scripts && packageJson.scripts[script]
    console.log(`${exists ? "✅" : "❌"} npm run ${script}`)
  })
} else {
  console.log("❌ package.json not found")
}

console.log("\n🎯 Setup Status:")
console.log("If all items show ✅, you're ready to run the development server!")
console.log("If any items show ❌, please fix them before proceeding.")
