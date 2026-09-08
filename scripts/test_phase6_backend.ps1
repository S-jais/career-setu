# Automated verification test for Phase 6 Backend APIs
$ErrorActionPreference = "Stop"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Testing Phase 6 Spring Boot Backend APIs" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Test Public Events Endpoint
Write-Host "`n[1/8] Testing GET /api/v1/events..." -ForegroundColor Yellow
$events = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/events" -Method GET
if ($events.Count -ge 3) {
    Write-Host "  PASSED: Found $($events.Count) active campus events. First: $($events[0].title)" -ForegroundColor Green
} else {
    throw "Expected at least 3 events, found $($events.Count)"
}

# 2. Test Public Mentors Endpoint
Write-Host "`n[2/8] Testing GET /api/v1/mentors..." -ForegroundColor Yellow
$mentors = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/mentors" -Method GET
if ($mentors.Count -ge 3) {
    Write-Host "  PASSED: Found $($mentors.Count) verified mentors. First: $($mentors[0].name) ($($mentors[0].company))" -ForegroundColor Green
} else {
    throw "Expected at least 3 mentors, found $($mentors.Count)"
}

# 3. Authenticate as Student
Write-Host "`n[3/8] Authenticating as Student (student@careersetu.in)..." -ForegroundColor Yellow
$studentLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body '{"email":"student@careersetu.in","password":"Demo@CareerSetu2024"}' -ContentType "application/json"
$studentHeaders = @{ "Authorization" = "Bearer $($studentLogin.accessToken)" }
Write-Host "  PASSED: Student JWT acquired for user ID $($studentLogin.user.id)" -ForegroundColor Green

# 4. Test Student Messaging
Write-Host "`n[4/8] Testing GET /api/v1/messages/conversations & POST /api/v1/messages/send..." -ForegroundColor Yellow
$convs = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/messages/conversations" -Method GET -Headers $studentHeaders
if ($convs.Count -ge 1) {
    Write-Host "  PASSED: Found $($convs.Count) active conversations. First thread with: $($convs[0].otherPartyName)" -ForegroundColor Green
} else {
    throw "Expected at least 1 conversation for student"
}

$sendMsgBody = @{
    conversationId = $convs[0].conversationId
    recipientId = $convs[0].otherPartyId
    recipientName = $convs[0].otherPartyName
    content = "Automated test message sent at $(Get-Date -Format 'HH:mm:ss')"
    senderRole = "STUDENT"
} | ConvertTo-Json
$sent = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/messages/send" -Method POST -Headers $studentHeaders -Body $sendMsgBody -ContentType "application/json"
Write-Host "  PASSED: Message successfully sent! ID: $($sent.id), Content: $($sent.content)" -ForegroundColor Green

# 5. Authenticate as Employer
Write-Host "`n[5/8] Authenticating as Employer (employer@careersetu.in)..." -ForegroundColor Yellow
$employerLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -Body '{"email":"employer@careersetu.in","password":"Demo@CareerSetu2024"}' -ContentType "application/json"
$employerHeaders = @{ "Authorization" = "Bearer $($employerLogin.accessToken)" }
Write-Host "  PASSED: Employer JWT acquired for user ID $($employerLogin.user.id)" -ForegroundColor Green

# 6. Test Employer Interview Scheduling
Write-Host "`n[6/8] Testing GET /api/v1/interviews/employer & POST /api/v1/interviews/schedule..." -ForegroundColor Yellow
$interviews = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/interviews/employer" -Method GET -Headers $employerHeaders
Write-Host "  PASSED: Found $($interviews.Count) employer interviews." -ForegroundColor Green

$scheduleBody = @{
    candidateId = $studentLogin.user.id
    candidateName = "Aarav Sharma"
    candidateEmail = "student@careersetu.in"
    roleTitle = "Distributed Systems Engineer Intern"
    round = "TECHNICAL_1"
    dateStr = "March 20, 2026"
    timeStr = "04:00 PM - 04:45 PM"
    durationMinutes = 45
    interviewerName = "Sarah Jenkins"
    meetingUrl = "https://meet.google.com/cs-auto-test"
    notes = "Live test interview scheduled via automated verification pipeline"
} | ConvertTo-Json
$scheduled = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/interviews/schedule" -Method POST -Headers $employerHeaders -Body $scheduleBody -ContentType "application/json"
Write-Host "  PASSED: Interview successfully scheduled! ID: $($scheduled.id), Meeting URL: $($scheduled.meetingUrl)" -ForegroundColor Green

# 7. Test Mentorship Booking
Write-Host "`n[7/8] Testing POST /api/v1/mentors/book..." -ForegroundColor Yellow
$bookBody = @{
    mentorId = $mentors[0].id
    scheduledTime = "Friday, 4:00 PM IST"
    topic = "System Design & Distributed Storage Deep Dive"
    goals = "Review distributed consensus and Raft algorithm implementations"
    durationMinutes = 45
} | ConvertTo-Json
$session = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/mentors/book" -Method POST -Headers $studentHeaders -Body $bookBody -ContentType "application/json"
Write-Host "  PASSED: Mentorship session booked! ID: $($session.id), Meeting Link: $($session.meetingLink)" -ForegroundColor Green

# 8. Test Campus Event Registration
Write-Host "`n[8/8] Testing POST /api/v1/events/{id}/register..." -ForegroundColor Yellow
$regBody = @{
    teamName = "NeuralHack Pioneers"
} | ConvertTo-Json
$reg = Invoke-RestMethod -Uri "http://localhost:8080/api/v1/events/$($events[0].id)/register" -Method POST -Headers $studentHeaders -Body $regBody -ContentType "application/json"
Write-Host "  PASSED: Event registration confirmed! ID: $($reg.id), Team: $($reg.teamName), Event: $($reg.eventTitle)" -ForegroundColor Green

Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host " ALL 8 INTEGRATION TESTS PASSED WITH 100% SUCCESS!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
