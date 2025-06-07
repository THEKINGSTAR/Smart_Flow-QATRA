# Your provided SESSION_SECRET
$SESSION_SECRET = "4b2d19bf5112939f3c1ca2396c081de2ddf0f3327e47559352ed76ee251c7824"

Write-Host "🔐 Setting up SESSION_SECRET for SmartFlow-QATRA..." -ForegroundColor Cyan
Write-Host ""

# Validate session secret
if ([string]::IsNullOrEmpty($SESSION_SECRET)) {
    Write-Host "❌ SESSION_SECRET is empty" -ForegroundColor Red
    exit 1
}

if ($SESSION_SECRET.Length -lt 32) {
    Write-Host "❌ SESSION_SECRET should be at least 32 characters long" -ForegroundColor Red
    exit 1
}

Write-Host "✅ SESSION_SECRET is valid" -ForegroundColor Green

# Create or update .env file
$envFile = ".env"
$sessionSecretLine = "SESSION_SECRET=$SESSION_SECRET"

if (Test-Path $envFile) {
    Write-Host "📝 Found existing .env file" -ForegroundColor Yellow
    
    $content = Get-Content $envFile -Raw
    
    # Check if SESSION_SECRET already exists
    if ($content -match "^SESSION_SECRET=.*$") {
        # Replace existing SESSION_SECRET
        $content = $content -replace "^SESSION_SECRET=.*$", $sessionSecretLine
        Write-Host "🔄 Updated existing SESSION_SECRET" -ForegroundColor Yellow
    } else {
        # Add new SESSION_SECRET
        if (-not $content.EndsWith("`n")) {
            $content += "`n"
        }
        $content += "$sessionSecretLine`n"
        Write-Host "➕ Added new SESSION_SECRET" -ForegroundColor Green
    }
    
    Set-Content -Path $envFile -Value $content -NoNewline
} else {
    Write-Host "📝 Creating new .env file" -ForegroundColor Yellow
    Set-Content -Path $envFile -Value $sessionSecretLine
}

Write-Host "✅ .env file updated successfully" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 SESSION_SECRET setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. For Vercel deployment:"
Write-Host "   vercel env add SESSION_SECRET"
Write-Host "   (Enter the value when prompted)"
Write-Host ""
Write-Host "2. For other platforms, add this environment variable:"
Write-Host "   SESSION_SECRET=$SESSION_SECRET"
Write-Host ""
Write-Host "3. Restart your development server to use the new secret"
