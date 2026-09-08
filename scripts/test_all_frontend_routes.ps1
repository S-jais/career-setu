Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Testing All Frontend Routes via Vite Server    " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

$routes = @(
    "/",
    "/auth/login",
    "/auth/register",
    "/student/overview",
    "/student/passport",
    "/student/skills",
    "/student/opportunities",
    "/student/applications",
    "/student/assessment",
    "/student/copilot",
    "/student/onboarding",
    "/student/learning",
    "/student/mentors",
    "/student/events",
    "/student/messages",
    "/employer/overview",
    "/employer/jobs",
    "/employer/applicants",
    "/employer/interviews",
    "/employer/analytics",
    "/employer/profile",
    "/employer/messages",
    "/institution/overview",
    "/institution/students",
    "/institution/drives"
)

Add-Type -AssemblyName System.Net.Http
$client = New-Object System.Net.Http.HttpClient
$allPassed = $true

foreach ($route in $routes) {
    $url = "http://localhost:5173$route"
    try {
        $res = $client.GetAsync($url).Result
        if ($res.StatusCode -eq [System.Net.HttpStatusCode]::OK) {
            Write-Host " [PASS] $route (Status: $($res.StatusCode))" -ForegroundColor Green
        } else {
            Write-Host " [FAIL] $route (Status: $($res.StatusCode))" -ForegroundColor Red
            $allPassed = $false
        }
    } catch {
        Write-Host " [ERROR] ${route}: $_" -ForegroundColor Red
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "`nAll 25 Frontend Routes Responding 200 OK Cleanly!" -ForegroundColor Cyan
} else {
    Write-Error "Some routes failed to respond"
}
