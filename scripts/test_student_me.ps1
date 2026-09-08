$loginBody = @{ email = 'student@careersetu.in'; password = 'Demo@CareerSetu2024' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginRes.accessToken
$headers = @{ Authorization = "Bearer $token" }

$updateBody = @{
    headline = "Cloud & AI Systems Engineer"
    bio = "Senior CS student crafting scalable distributed microservices and LLM-powered interfaces."
    cgpa = 8.85
    isActivelyLooking = $true
    githubUrl = "https://github.com/aaravsharma-dev"
    linkedinUrl = "https://linkedin.com/in/aarav-sharma-demo"
    portfolioUrl = "https://aaravsharma.dev"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri 'http://localhost:8080/api/v1/students/me' -Method Put -Headers $headers -Body $updateBody -ContentType 'application/json'
Write-Host "Updated profile headline:" $updated.headline
Write-Host "Updated profile CGPA:" $updated.cgpa
Write-Host "Profile completion pct:" $updated.profileCompletionPct
