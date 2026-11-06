$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Install Node.js LTS (20+) and run again.' }
$major = [int]((node --version).TrimStart('v').Split('.')[0])
if ($major -lt 20) { throw 'Node.js 20 or later is required.' }
Write-Host 'Local preview is ready: http://localhost:3061'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host 'Git is not installed. Install Git for Windows and rerun to connect GitHub.'
    Write-Host 'You can run start-local.cmd now.'
    exit 0
}
function Run-Git {
    & git @args
    if ($LASTEXITCODE -ne 0) { throw 'Git command failed. Check the message above. Your local source is preserved.' }
}
if (-not (Test-Path '.git')) { Run-Git init -b main }
function Get-GitValue {
    $ErrorActionPreference = 'Continue'
    & git @args 2>$null
}
$remote = Get-GitValue remote get-url origin
if ($LASTEXITCODE -ne 0) { Run-Git remote add origin 'https://github.com/nan29077/banggood.git' }
elseif ($remote -notmatch '^https://github\.com/nan29077/banggood(?:\.git)?/?$') { throw 'A different origin already exists. Check git remote -v before continuing.' }
$userName = Get-GitValue config user.name
if (-not $userName) { Run-Git config --local user.name 'nan29077' }
$userEmail = Get-GitValue config user.email
if (-not $userEmail) { Run-Git config --local user.email 'nan29077@users.noreply.github.com' }
$head = Get-GitValue rev-parse --verify HEAD
if ($LASTEXITCODE -ne 0) {
    Run-Git add -- .
    Run-Git commit -m 'Set up Banggeut Market local development on port 3061'
}
Write-Host 'Connecting GitHub. Complete browser sign-in if Git asks for it.'
Run-Git push -u origin main
Write-Host 'GitHub sync completed. Run start-local.cmd to open the local server.'
