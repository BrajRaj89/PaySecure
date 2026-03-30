$headers = @{ "Content-Type" = "application/json" }
$username = "testuser_repro"
$password = "password123"

# 1. Signup
$signupBody = @{
    username = $username
    email = "$username@example.com"
    password = $password
    role = @("user")
} | ConvertTo-Json

Write-Output "Attempting Signup..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signup" -Method Post -Headers $headers -Body $signupBody -ErrorAction Stop
    Write-Output "Signup Success: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Output "Signup Error or User Exists: $($_.Exception.Message)"
}

# 2. Login
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

$token = $null

Write-Output "Attempting Login..."
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/signin" -Method Post -Headers $headers -Body $loginBody -ErrorAction Stop
    Write-Output "Login Success"
    $token = $loginResponse.token
    Write-Output "Token: $token"
} catch {
    Write-Output "Login Error: $($_.Exception.Message)"
    exit
}

# 3. Get Orders
if ($token) {
    $authHeader = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Output "Attempting to Fetch Orders..."
    try {
        $orders = Invoke-RestMethod -Uri "http://localhost:8080/api/orders/my-orders" -Method Get -Headers $authHeader -ErrorAction Stop
        Write-Output "Orders Fetch Success: $($orders | ConvertTo-Json -Depth 5)"
    } catch {
        Write-Output "Orders Fetch Error: $($_.Exception.Message)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Output "Error Body: $responseBody"
    }
}
