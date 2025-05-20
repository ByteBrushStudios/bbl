# ByteBrush Links (BBL) Setup Script for Windows
# This script helps set up the ByteBrush Links project on Windows

# Check if .env file exists, if not create it from .env.example
if (-not (Test-Path -Path .\.env)) {
    Write-Host "⚠️ No .env file found. Creating from example..." -ForegroundColor Yellow
    
    if (Test-Path -Path .\.env.example) {
        Copy-Item -Path .\.env.example -Destination .\.env
        Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
        Write-Host "⚠️ Please update the .env file with your credentials" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No .env.example file found. Please create a .env file manually." -ForegroundColor Red
        exit 1
    }
}

Write-Host "🚀 Initializing ByteBrush Links project..." -ForegroundColor Cyan

# Run prisma db push
Write-Host "📊 Setting up the database..." -ForegroundColor Cyan
try {
    bun prisma db push
    Write-Host "✅ Database setup complete!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set up database:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# Generate Prisma client
Write-Host "📦 Generating Prisma client..." -ForegroundColor Cyan
try {
    bun prisma generate
    Write-Host "✅ Prisma client generated!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

Write-Host "🎉 ByteBrush Links project initialized successfully!" -ForegroundColor Green
Write-Host "ℹ️ Run the development server with:" -ForegroundColor Cyan
Write-Host "   bun dev" -ForegroundColor White
Write-Host "ℹ️ Build for production with:" -ForegroundColor Cyan
Write-Host "   bun run build" -ForegroundColor White
