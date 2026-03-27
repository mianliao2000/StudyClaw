param(
  [ValidateSet("start", "stop", "restart", "status")]
  [string]$Action = "status"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$StateDir = Join-Path $ProjectRoot ".dev-state"
$PidFile = Join-Path $StateDir "dev-server.pid"
$OutLog = Join-Path $StateDir "dev-server.out.log"
$ErrLog = Join-Path $StateDir "dev-server.err.log"

function Ensure-StateDir {
  if (-not (Test-Path -LiteralPath $StateDir)) {
    New-Item -ItemType Directory -Path $StateDir | Out-Null
  }
}

function Get-ManagedProcess {
  if (-not (Test-Path -LiteralPath $PidFile)) {
    return $null
  }

  $rawPid = Get-Content -LiteralPath $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $rawPid) {
    Remove-Item -LiteralPath $PidFile -ErrorAction SilentlyContinue
    return $null
  }

  $pidValue = 0
  if (-not [int]::TryParse($rawPid, [ref]$pidValue)) {
    Remove-Item -LiteralPath $PidFile -ErrorAction SilentlyContinue
    return $null
  }

  $process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
  if (-not $process) {
    Remove-Item -LiteralPath $PidFile -ErrorAction SilentlyContinue
    return $null
  }

  return $process
}

function Stop-ManagedProcess {
  $process = Get-ManagedProcess
  if (-not $process) {
    Write-Output "No managed dev server is running."
    return
  }

  Stop-Process -Id $process.Id -Force
  Remove-Item -LiteralPath $PidFile -ErrorAction SilentlyContinue
  Write-Output "Stopped managed dev server PID $($process.Id)."
}

function Start-ManagedProcess {
  Ensure-StateDir

  $existing = Get-ManagedProcess
  if ($existing) {
    Write-Output "Managed dev server already running on PID $($existing.Id)."
    return
  }

  $portProcess = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty OwningProcess

  if ($portProcess) {
    try {
      Stop-Process -Id $portProcess -Force -ErrorAction Stop
      Write-Output "Stopped existing process on port 3000 (PID $portProcess)."
    } catch {
      Write-Output "Could not stop existing process on port 3000 (PID $portProcess): $($_.Exception.Message)"
    }
  }

  Start-Sleep -Seconds 1

  if (Test-Path -LiteralPath $OutLog) {
    Remove-Item -LiteralPath $OutLog -Force -ErrorAction SilentlyContinue
  }

  if (Test-Path -LiteralPath $ErrLog) {
    Remove-Item -LiteralPath $ErrLog -Force -ErrorAction SilentlyContinue
  }

  $process = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "Set-Location '$ProjectRoot'; corepack pnpm dev" `
    -WorkingDirectory $ProjectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $OutLog `
    -RedirectStandardError $ErrLog `
    -PassThru

  Set-Content -LiteralPath $PidFile -Value $process.Id
  Write-Output "Started managed dev server on PID $($process.Id)."
}

function Show-ManagedStatus {
  $process = Get-ManagedProcess
  if ($process) {
    Write-Output "Managed dev server is running on PID $($process.Id)."
    return
  }

  $portProcess = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty OwningProcess

  if ($portProcess) {
    Write-Output "Port 3000 is in use by unmanaged PID $portProcess."
    return
  }

  Write-Output "No dev server is running on port 3000."
}

switch ($Action) {
  "start" { Start-ManagedProcess }
  "stop" { Stop-ManagedProcess }
  "restart" {
    Stop-ManagedProcess
    Start-ManagedProcess
  }
  "status" { Show-ManagedStatus }
}
