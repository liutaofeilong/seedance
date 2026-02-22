# Fix Vercel build issues

Write-Host "Fixing build issues..." -ForegroundColor Green

# Remove problematic API routes that use missing dependencies
$filesToRemove = @(
    "pages/api/auth",
    "pages/api/stripe",
    "lib/mongodb.ts"
)

foreach ($file in $filesToRemove) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        Write-Host "Removing: $file" -ForegroundColor Yellow
        Remove-Item -Path $fullPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Done! Now run: npm run build" -ForegroundColor Green

