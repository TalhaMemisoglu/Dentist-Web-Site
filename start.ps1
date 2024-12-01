# Check if a process is running on a port
function Test-PortInUse {
    param([int]$Port)
    
    $connection = netstat -ano | findstr ":$Port"
    return $null -ne $connection
}

# Kill process on a specific port
function Kill-ProcessOnPort {
    param([int]$Port)
    
    $connection = netstat -ano | findstr ":$Port"
    if ($connection) {
        $pid = ($connection -split ' ')[-1]
        taskkill /PID $pid /F
    }
}

# Clear ports if in use
if (Test-PortInUse 8000) {
    Write-Host "Port 8000 in use. Killing process..."
    Kill-ProcessOnPort 8000
}

if (Test-PortInUse 5173) {
    Write-Host "Port 5173 in use. Killing process..."
    Kill-ProcessOnPort 5173
}

# Set working directories
$backendDir = Join-Path $PSScriptRoot "backend"
$frontendDir = Join-Path $PSScriptRoot "frontend"

# Check if directories exist
if (-not (Test-Path $backendDir)) {
    Write-Host "Backend directory not found at: $backendDir"
    exit 1
}

if (-not (Test-Path $frontendDir)) {
    Write-Host "Frontend directory not found at: $frontendDir"
    exit 1
}

# Function to activate virtual environment
function Activate-Venv {
    $venvPath = Join-Path $backendDir "venv"
    $activateScript = Join-Path $venvPath "Scripts" "Activate.ps1"
    
    if (Test-Path $activateScript) {
        & $activateScript
        return $true
    }
    return $false
}

# Start Backend
Write-Host "Starting Backend..."
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    if (Test-Path "venv\Scripts\Activate.ps1") {
        . "venv\Scripts\Activate.ps1"
    }
    python manage.py runserver
} -ArgumentList $backendDir

# Start Frontend
Write-Host "Starting Frontend..."
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $frontendDir

# Function to display output from a job
function Show-JobOutput {
    param(
        [Parameter(Mandatory=$true)]
        [System.Management.Automation.Job]$Job,
        
        [Parameter(Mandatory=$true)]
        [string]$Prefix
    )
    
    $lastOutput = ""
    while ($Job.State -eq "Running") {
        $output = Receive-Job -Job $Job
        if ($output -and $output -ne $lastOutput) {
            $output | ForEach-Object { Write-Host "[$Prefix] $_" }
            $lastOutput = $output
        }
        Start-Sleep -Milliseconds 100
    }
}

try {
    # Display initial status
    Write-Host "`nServers are starting up...`n"
    Write-Host "Backend will be available at: http://localhost:8000"
    Write-Host "Frontend will be available at: http://localhost:5173"
    Write-Host "`nPress Ctrl+C to stop both servers`n"

    # Monitor both jobs
    while ($true) {
        Show-JobOutput -Job $backendJob -Prefix "Backend"
        Show-JobOutput -Job $frontendJob -Prefix "Frontend"
        
        if ($backendJob.State -eq "Failed") {
            Write-Host "Backend server stopped unexpectedly!"
            break
        }
        if ($frontendJob.State -eq "Failed") {
            Write-Host "Frontend server stopped unexpectedly!"
            break
        }
        Start-Sleep -Seconds 1
    }
}
finally {
    # Cleanup on exit
    Write-Host "`nShutting down servers..."
    
    Stop-Job -Job $backendJob
    Stop-Job -Job $frontendJob
    
    Remove-Job -Job $backendJob
    Remove-Job -Job $frontendJob
    
    # Kill any remaining processes
    Kill-ProcessOnPort 8000
    Kill-ProcessOnPort 5173
    
    Write-Host "Servers stopped."
}