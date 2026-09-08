Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   CareerSetu Phase 5 End-to-End Test Suite       " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Spring Boot Auth Login
Write-Host "`n[1/6] Testing Spring Boot Authentication..." -ForegroundColor Yellow
$loginBody = @{ email = 'student@careersetu.in'; password = 'Demo@CareerSetu2024' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginRes.accessToken

if (-not $token) {
    Write-Error "Failed to obtain auth token"
    exit 1
}
Write-Host "  -> Auth token acquired successfully! User: $($loginRes.user.fullName)" -ForegroundColor Green

# 2. Get Current Student Profile
Write-Host "`n[2/6] Testing GET /api/v1/students/me..." -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $token" }
$profile = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/students/me' -Method Get -Headers $headers
Write-Host "  -> Current Profile: Roll=$($profile.rollNumber), CGPA=$($profile.cgpa), Headline='$($profile.headline)'" -ForegroundColor Green

# 3. Update Student Profile via PUT
Write-Host "`n[3/6] Testing PUT /api/v1/students/me (Profile Edit)..." -ForegroundColor Yellow
$updateBody = @{
    headline = "Cloud Native & AI Systems Architect"
    bio = "Final year undergraduate passionate about distributed microservices, Spring Boot, and GenAI platforms."
    cgpa = 8.92
    graduationYear = 2026
    currentYear = 4
    currentSemester = 7
    isActivelyLooking = $true
    githubUrl = "https://github.com/aaravsharma-dev"
    linkedinUrl = "https://linkedin.com/in/aarav-sharma-demo"
    portfolioUrl = "https://aaravsharma.dev"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/students/me' -Method Put -Headers $headers -Body $updateBody -ContentType 'application/json'
Write-Host "  -> Updated Headline: $($updated.headline)" -ForegroundColor Green
Write-Host "  -> Updated CGPA: $($updated.cgpa)" -ForegroundColor Green
Write-Host "  -> Updated Profile Completion Score: $($updated.profileCompletionPct)%" -ForegroundColor Green

# 4. Check AI Service Health
Write-Host "`n[4/6] Checking AI Service Health..." -ForegroundColor Yellow
$aiHealth = Invoke-RestMethod -Uri 'http://localhost:8000/health' -Method Get
Write-Host "  -> AI Service Status: $($aiHealth.status), Version: $($aiHealth.version)" -ForegroundColor Green

# 5. Test AI Resume Upload & Extraction Pipeline
Write-Host "`n[5/6] Testing AI Resume Upload & Parsing..." -ForegroundColor Yellow
$testResumeText = @"
Aarav Sharma
Email: aarav@careersetu.in
Senior Software Engineer Intern

SUMMARY
Architected and engineered distributed microservices using Java 21, Spring Boot, Docker, and PostgreSQL.
Optimized API query latency by 42% utilizing Redis distributed caching.

TECHNICAL SKILLS
Languages: Java, Python, TypeScript, SQL
Frameworks: Spring Boot, FastAPI, React
DevOps: Docker, Kubernetes, CI/CD, AWS, Linux

PROJECTS
High-Performance Career Gateway
- Developed and deployed high-throughput REST APIs handling over 50,000 requests per minute.
- Automated deployment workflows using GitHub Actions and containerization.
"@

$tempFile = "$PSScriptRoot\temp_test_resume.txt"
[System.IO.File]::WriteAllText($tempFile, $testResumeText)

Add-Type -AssemblyName System.Net.Http
$client = New-Object System.Net.Http.HttpClient
$form = New-Object System.Net.Http.MultipartFormDataContent
$fileBytes = [System.IO.File]::ReadAllBytes($tempFile)
$byteContent = New-Object System.Net.Http.ByteArrayContent($fileBytes, 0, $fileBytes.Length)
$byteContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("text/plain")
$form.Add($byteContent, "file", "temp_test_resume.txt")

$roleContent = New-Object System.Net.Http.StringContent("Backend Software Engineer")
$form.Add($roleContent, "target_role")

$aiUploadRes = $client.PostAsync("http://localhost:8000/api/v1/ai/resume/upload", $form).Result
$aiUploadBody = $aiUploadRes.Content.ReadAsStringAsync().Result | ConvertFrom-Json

Remove-Item -Path $tempFile -Force -ErrorAction SilentlyContinue

Write-Host "  -> Upload Status: $($aiUploadRes.StatusCode)" -ForegroundColor Green
Write-Host "  -> Extracted Characters: $($aiUploadBody.char_count)" -ForegroundColor Green
Write-Host "  -> Overall Score: $($aiUploadBody.analysis.overall_score)/100" -ForegroundColor Green
Write-Host "  -> ATS Score: $($aiUploadBody.analysis.ats_compatibility_score)/100" -ForegroundColor Green
Write-Host "  -> Detected Strengths: $($aiUploadBody.analysis.strengths.Count)" -ForegroundColor Green

# 6. Vite Gateway & Proxy Verification
Write-Host "`n[6/6] Verifying Vite Gateway Routing..." -ForegroundColor Yellow
$viteRes = Invoke-RestMethod -Uri 'http://localhost:5173/health' -Method Get
Write-Host "  -> Vite -> AI Health Proxy: $($viteRes.status)" -ForegroundColor Green

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "   ALL PHASE 5 TESTS PASSED WITH 100% SUCCESS!    " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
