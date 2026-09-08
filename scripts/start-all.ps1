# CareerSetu Full Stack Launcher (PowerShell)
# Starts Frontend (5173), AI Service (8000), and Spring Boot Backend (8080)

$rootDir = Split-Path -Parent $PSScriptRoot
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       Launching CareerSetu Full Stack Platform           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. AI Service (Port 8000)
$aiRunning = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 8000 }
if (-not $aiRunning) {
    Write-Host "[1/3] Starting FastAPI AI Service on port 8000..." -ForegroundColor Yellow
    $aiPath = Join-Path $rootDir "ai-service"
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd `"$aiPath`"; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -WindowStyle Minimized
    Start-Sleep -Seconds 2
} else {
    Write-Host "[1/3] FastAPI AI Service is already running on port 8000." -ForegroundColor Green
}

# 2. Spring Boot Core Backend (Port 8080)
$backendRunning = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 8080 }
if (-not $backendRunning) {
    Write-Host "[2/3] Starting Spring Boot Backend on port 8080 (Profile: local)..." -ForegroundColor Yellow
    $backendPath = Join-Path $rootDir "backend"

    $mvnExecutable = "mvn"
    $mvnCandidates = @(
        "C:\Users\siddhartha jaiswal\.maven\maven-3.9.15\bin\mvn.cmd",
        "$env:USERPROFILE\.maven\maven-3.9.15\bin\mvn.cmd",
        "C:\tools\maven\apache-maven-3.9.9\bin\mvn.cmd"
    )
    foreach ($cand in $mvnCandidates) {
        if (Test-Path $cand) {
            $mvnExecutable = $cand
            break
        }
    }

    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; & `"$mvnExecutable`" spring-boot:run `"-Dspring-boot.run.profiles=local`"" -WindowStyle Minimized
    Start-Sleep -Seconds 4
} else {
    Write-Host "[2/3] Spring Boot Backend is already running on port 8080." -ForegroundColor Green
}

# 3. React Vite Frontend (Port 5173)
$frontendRunning = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 5173 }
if (-not $frontendRunning) {
    Write-Host "[3/3] Starting Vite React Frontend on port 5173..." -ForegroundColor Yellow
    $frontendPath = Join-Path $rootDir "frontend"
    Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; npm run dev" -WindowStyle Minimized
    Start-Sleep -Seconds 2
} else {
    Write-Host "[3/3] Vite React Frontend is already running on port 5173." -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "               All Services are Active!                   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  * Frontend UI:       http://localhost:5173" -ForegroundColor Cyan
Write-Host "  * AI Intelligence:   http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  * Core Backend API:  http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host "  * H2 DB Console:     http://localhost:8080/h2-console" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Demo Credentials:" -ForegroundColor Magenta
Write-Host "  - Student:  student@careersetu.in  /  Demo@CareerSetu2024" -ForegroundColor White
Write-Host "  - Employer: employer@careersetu.in /  Demo@CareerSetu2024" -ForegroundColor White
Write-Host "  - Admin:    admin@careersetu.in    /  Demo@CareerSetu2024" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
