# ============================================================
# CareerSetu Phase 8 Complete Backend Integration Tests
# ============================================================
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  CareerSetu Phase 8 Complete Backend Integration Tests   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$passed = 0
$total = 0

function Assert-Test($name, $condition) {
    $global:total++
    if ($condition) {
        $global:passed++
        Write-Host "  [PASS] $name" -ForegroundColor Green
    } else {
        Write-Host "  [FAIL] $name" -ForegroundColor Red
    }
}

# 1. Test Institution Stats
try {
    $stats = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/institutions/stats" -Method Get
    Assert-Test "GET /api/v1/institutions/stats returns aggregated metrics" ($stats.totalStudents -gt 0 -and $stats.avgCgpa -gt 0)
    Write-Host "         Total Students: $($stats.totalStudents), Avg CGPA: $($stats.avgCgpa), NEP Compliant: $($stats.nepCompliantPercentage)%" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/institutions/stats failed: $_" $false
}

# 2. Test Placement Drives
try {
    $drives = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/drives" -Method Get
    Assert-Test "GET /api/v1/drives returns active campus placement drives" ($drives.Count -ge 4)
    Write-Host "         First Drive: $($drives[0].companyName) - $($drives[0].roleTitle) ($($drives[0].ctcPackage))" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/drives failed: $_" $false
}

# 3. Test Public Assessment Credential Verification
try {
    $hash = "0x8f4d92a1c6e409b3e1f5789a2b8e3914a5c6d7e8f90123456789abcdef012345"
    $badge = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/assessment/verify/$hash" -Method Get
    Assert-Test "GET /api/v1/assessment/verify/{hash} validates cryptographic badge" ($badge.score -eq 96 -and $badge.status -eq "PASSED")
    Write-Host "         Verified: $($badge.badgeTitle) for $($badge.studentName)" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/assessment/verify/{hash} failed: $_" $false
}

# 4. Test Primary Employer Company
try {
    $comp = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/companies/primary" -Method Get
    Assert-Test "GET /api/v1/companies/primary returns corporate entity" ($comp.legalName -ne $null)
    Write-Host "         Company: $($comp.legalName) (GSTIN: $($comp.gstin))" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/companies/primary failed: $_" $false
}

# 5. Authenticate as Student
$token = ""
try {
    $loginBody = @{
        email = "student@careersetu.in"
        password = "Demo@CareerSetu2024"
    } | ConvertTo-Json

    $loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.accessToken
    Assert-Test "POST /api/v1/auth/login succeeds for student" ($token -ne $null -and $token.Length -gt 20)
} catch {
    Assert-Test "Login failed: $_" $false
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 6. Test Query Institution Students (Authenticated)
try {
    $students = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/institutions/students" -Method Get -Headers $headers
    Assert-Test "GET /api/v1/institutions/students returns student cohort directory" ($students.Count -ge 5)
    Write-Host "         Students loaded: $($students.Count). First: $($students[0].name) ($($students[0].rollNo))" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/institutions/students failed: $_" $false
}

# 7. Test Get In-App Notifications
try {
    $notifs = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/notifications/my" -Method Get -Headers $headers
    Assert-Test "GET /api/v1/notifications/my returns user notifications" ($notifs.Count -ge 4)
    Write-Host "         Unread Notifications: $($notifs.Count). Top: $($notifs[0].title)" -ForegroundColor Gray
} catch {
    Assert-Test "GET /api/v1/notifications/my failed: $_" $false
}

# 8. Test Submit Assessment Challenge
try {
    $submitBody = @{
        challengeId = "java"
        challengeTitle = "Java 21+ Virtual Threads & Systems"
        language = "java"
        score = 98
        code = "class Solution { void test() { Thread.startVirtualThread(() -> {}); } }"
        passedTestCases = 3
        totalTestCases = 3
        name = "Aarav Sharma"
        email = "student@careersetu.in"
    } | ConvertTo-Json

    $submission = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/assessment/submit" -Method Post -Body $submitBody -Headers $headers
    Assert-Test "POST /api/v1/assessment/submit mints verifiable SHA-256 hash" ($submission.verificationHash.StartsWith("0x") -and $submission.score -eq 98)
    Write-Host "         Generated Hash: $($submission.verificationHash)" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/assessment/submit failed: $_" $false
}

# 9. Test Company GSTIN Verification
try {
    $compId = $comp.id
    $gstinBody = @{
        gstin = "29AABCT1332L1Z2"
        cin = "U72200KA2018PTC112345"
    } | ConvertTo-Json

    $gstinRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/companies/$compId/verify-gstin" -Method Post -Body $gstinBody -Headers $headers
    Assert-Test "POST /api/v1/companies/{id}/verify-gstin verifies Indian GSTIN" ($gstinRes.success -eq $true -and $gstinRes.verificationStatus -eq "APPROVED")
    Write-Host "         GSTIN Result: $($gstinRes.message)" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/companies/{id}/verify-gstin failed: $_" $false
}

# 10. Test Placement Drive Registration
try {
    $firstDriveId = $drives[0].id
    $regRes = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/drives/$firstDriveId/register" -Method Post -Headers $headers -Body "{}"
    Assert-Test "POST /api/v1/drives/{id}/register registers student" ($regRes.status -eq "REGISTERED")
} catch {
    Assert-Test "POST /api/v1/drives/{id}/register failed: $_" $false
}

# 11. Test Bulk Student CSV Upload (Multipart)
try {
    $csvContent = @"
Name,Email,RollNo,Department,Year,CGPA,NEPCredits,PlacementStatus,PlacedCompany,PlacedPackage
Vikram Seth,vikram.s@careersetu.in,22CSE099,Computer Science & Engineering,4,8.75,14,PLACED,Amazon AWS,28.5
Siddharth Rao,sid.r@careersetu.in,22IT088,Information Technology,4,8.12,14,SHORTLISTED,TechCorp India,18.5
Divya Nair,divya.n@careersetu.in,22AI055,Artificial Intelligence & Data Science,4,9.20,14,COMPLIANT,,
"@
    $tempCsv = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "test_cohort.csv")
    [System.IO.File]::WriteAllText($tempCsv, $csvContent)

    $client = New-Object System.Net.WebClient
    $client.Headers.Add("Authorization", "Bearer $token")
    $respBytes = $client.UploadFile("http://localhost:8080/api/v1/institutions/students/bulk-upload", "POST", $tempCsv)
    $uploadJson = [System.Text.Encoding]::UTF8.GetString($respBytes) | ConvertFrom-Json
    [System.IO.File]::Delete($tempCsv)

    Assert-Test "POST /api/v1/institutions/students/bulk-upload parses CSV roster" ($uploadJson.success -eq $true -and $uploadJson.importedCount -eq 3)
    Write-Host "         Import Summary: $($uploadJson.message)" -ForegroundColor Gray
} catch {
    Assert-Test "POST /api/v1/institutions/students/bulk-upload failed: $_" $false
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Results: $passed / $total tests passed ($([math]::Round(($passed/$total)*100))%)" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($passed -ne $total) {
    exit 1
}
