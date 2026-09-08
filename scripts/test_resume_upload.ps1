$sampleResume = @"
Aarav Sharma
Software Engineer & Systems Specialist
Email: aarav@example.com

SUMMARY
Architected and engineered distributed cloud microservices using Java, Spring Boot, Docker, and PostgreSQL. Reduced latency by 45% through Redis caching.

TECHNICAL SKILLS
Languages: Java, Python, TypeScript, SQL
Frameworks: Spring Boot, React, FastAPI
DevOps: Docker, Kubernetes, CI/CD, AWS, Linux

EXPERIENCE
Software Engineering Intern - Cloud Solutions
- Developed and deployed high-throughput REST APIs handling over 50,000 requests per minute.
- Optimized database query execution, reducing P99 latency by 35ms.
- Automated deployment workflows using GitHub Actions CI/CD pipelines.
"@

$samplePath = "$PSScriptRoot\sample_resume.txt"
[System.IO.File]::WriteAllText($samplePath, $sampleResume)

Add-Type -AssemblyName System.Net.Http
$form = New-Object System.Net.Http.MultipartFormDataContent
$fileBytes = [System.IO.File]::ReadAllBytes($samplePath)
$byteContent = New-Object System.Net.Http.ByteArrayContent($fileBytes, 0, $fileBytes.Length)
$byteContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("text/plain")
$form.Add($byteContent, "file", "sample_resume.txt")

$roleContent = New-Object System.Net.Http.StringContent("Backend Systems Engineer")
$form.Add($roleContent, "target_role")

$client = New-Object System.Net.Http.HttpClient
$response = $client.PostAsync("http://localhost:8000/api/v1/ai/resume/upload", $form).Result
$responseBody = $response.Content.ReadAsStringAsync().Result

Write-Host "Status Code:" $response.StatusCode
Write-Host "Response Body:" $responseBody
