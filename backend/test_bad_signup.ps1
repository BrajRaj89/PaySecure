$headers = @{ "Content-Type" = "application/json" }
$body = @{
    username = "ab"
    email = "invalid-email"
    password = "123"
    role = @("user")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Output "Success: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Output "Error Status: $($_.Exception.Response.StatusCode.value__)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Output "Error Body: $responseBody"
}
