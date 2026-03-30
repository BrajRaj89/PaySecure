$headers = @{ "Content-Type" = "application/json" }
$body = ConvertTo-Json @{
    username = "testuser"
    email = "testuser@example.com"
    password = "password123"
    role = @("user")
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Output "Success: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Output "Error Caught"
    if ($_.Exception.Response) {
        Write-Output "Error Status: $($_.Exception.Response.StatusCode)"
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Output "Error Body: $($reader.ReadToEnd())"
    } else {
        Write-Output "Error Message: $($_.Exception.Message)"
    }
}
