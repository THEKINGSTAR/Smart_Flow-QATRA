const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("🧹 Cleaning up npm cache and lock files...")

// Remove lock files
const filesToRemove = ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb", "node_modules"]

filesToRemove.forEach((file) => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Removing ${file}...`)
    if (file === "node_modules") {
      fs.rmSync(filePath, { recursive: true, force: true })
    } else {
      fs.unlinkSync(filePath)
    }
  }
})

console.log("🧽 Clearing npm cache...")
try {
  execSync("npm cache clean --force", { stdio: "inherit" })
} catch (error) {
  console.log("⚠️  Could not clear npm cache, continuing...")
}

console.log("✅ Cleanup complete!")
console.log("\n🚀 Now run: npm install")
