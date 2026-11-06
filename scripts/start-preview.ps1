param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previewUrl = 'http://localhost:3061/'
$probeUrl = 'http://127.0.0.1:3061/'

function Get-PreviewPage {
    try { return Invoke-WebRequest -Uri $probeUrl -UseBasicParsing -TimeoutSec 2 }
    catch { return $null }
}

try {
    $nodeCommand = Get-Command node -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $nodeCommand) { throw 'Node.js 20 or later is required. Install Node.js LTS and retry.' }
    $nodeVersion = & $nodeCommand.Source --version
    if ($LASTEXITCODE -ne 0 -or [int]($nodeVersion.TrimStart('v').Split('.')[0]) -lt 20) {
        throw 'Node.js 20 or later is required. Update Node.js and retry.'
    }
    $expectedPage = [System.IO.File]::ReadAllText((Join-Path $projectRoot 'dist\index.html'))
    $page = Get-PreviewPage
    if ($page -and $page.Content -cne $expectedPage) {
        throw 'Port 3061 is serving another site. Close that server and retry.'
    }
    if (-not $page) {
        # Relative script arguments avoid quoting problems in Korean or spaced folder paths.
        $server = Start-Process -FilePath $nodeCommand.Source -ArgumentList @('scripts/dev-server.mjs', '--port', '3061') -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $projectRoot 'preview.log') -RedirectStandardError (Join-Path $projectRoot 'preview-error.log') -PassThru
        for ($attempt = 0; $attempt -lt 20; $attempt++) {
            $page = Get-PreviewPage
            if ($page -and $page.Content -ceq $expectedPage) { break }
            if ($server.HasExited) {
                $serverError = Get-Content -LiteralPath (Join-Path $projectRoot 'preview-error.log') -Raw
                throw "Preview server stopped. $serverError"
            }
            Start-Sleep -Milliseconds 250
        }
        if (-not $page -or $page.Content -cne $expectedPage) {
            throw 'Preview did not become ready. Check preview-error.log in the project folder.'
        }
    }
    Write-Host "Banggeut Market preview: $previewUrl"
    Write-Host 'The server runs in the background. Run start-local.cmd again to reopen the preview.'
    if (-not $NoBrowser) { Start-Process $previewUrl }
    exit 0
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
