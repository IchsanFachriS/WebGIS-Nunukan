@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: Quick Deploy Script untuk WebGIS Mangrove Nunukan (Windows)
:: Script ini membantu proses deployment ke GitHub Pages

echo ==================================================
echo 🚀 WebGIS Mangrove Nunukan - Quick Deploy
echo ==================================================
echo.

:: 1. Cek apakah di dalam git repository
echo 1. Checking Git repository...
if not exist ".git" (
    echo ❌ Not a git repository. Initializing git...
    git init
    if errorlevel 1 (
        echo ❌ Failed to initialize git. Please install Git first.
        pause
        exit /b 1
    )
    echo ✅ Git initialized
) else (
    echo ✅ Git repository found
)

:: 2. Cek file penting
echo.
echo 2. Checking required files...

if not exist "vite.config.ts" (
    echo ❌ vite.config.ts not found!
    pause
    exit /b 1
)
echo ✅ vite.config.ts found

if not exist "package.json" (
    echo ❌ package.json not found!
    pause
    exit /b 1
)
echo ✅ package.json found

if not exist "public\data\mangrove.geojson" (
    echo ⚠️  public\data\mangrove.geojson not found!
    echo ℹ️  Please add your GeoJSON file to public\data\
    set /p continue="Continue anyway? (y/n): "
    if /i not "!continue!"=="y" exit /b 1
) else (
    echo ✅ GeoJSON file found
)

if not exist ".github\workflows" (
    echo ⚠️  GitHub Actions workflow not found
    echo ℹ️  Creating .github\workflows directory...
    mkdir .github\workflows
    echo ✅ Directory created
)

if not exist ".github\workflows\deploy.yml" (
    echo ⚠️  deploy.yml not found
    echo ℹ️  Please create .github\workflows\deploy.yml
)

:: 3. Install dependencies
echo.
echo 3. Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed

:: 4. Test build
echo.
echo 4. Testing build...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed. Please fix errors before deploying.
    pause
    exit /b 1
)
echo ✅ Build successful

:: 5. Ask for repository URL
echo.
echo 5. Git remote configuration...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    set /p REPO_URL="Enter GitHub repository URL: "
    git remote add origin "!REPO_URL!"
    echo ✅ Remote added
) else (
    for /f "delims=" %%i in ('git remote get-url origin') do set CURRENT_REMOTE=%%i
    echo ℹ️  Current remote: !CURRENT_REMOTE!
    set /p keep="Keep this remote? (y/n): "
    if /i not "!keep!"=="y" (
        set /p REPO_URL="Enter GitHub repository URL: "
        git remote set-url origin "!REPO_URL!"
        echo ✅ Remote updated
    )
)

:: 6. Get current branch
for /f "delims=" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if "!CURRENT_BRANCH!"=="" (
    set CURRENT_BRANCH=main
    git checkout -b main
)
echo ℹ️  Current branch: !CURRENT_BRANCH!

:: 7. Add and commit files
echo.
echo 6. Committing changes...
git add .

set /p COMMIT_MSG="Enter commit message (or press Enter for default): "
if "!COMMIT_MSG!"=="" (
    set COMMIT_MSG=Deploy WebGIS Mangrove Nunukan to GitHub Pages
)

git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo ⚠️  Nothing to commit or commit failed
)

:: 8. Push to GitHub
echo.
echo 7. Pushing to GitHub...
set /p push="Push to GitHub now? (y/n): "
if /i "!push!"=="y" (
    git push -u origin !CURRENT_BRANCH!
    if errorlevel 1 (
        echo ❌ Push failed. Please check your credentials and repository permissions.
        pause
        exit /b 1
    )
    echo ✅ Pushed to GitHub successfully
) else (
    echo ℹ️  Skipped push. You can push manually with: git push -u origin !CURRENT_BRANCH!
)

:: 9. Final instructions
echo.
echo ==================================================
echo 🎉 Deployment preparation complete!
echo ==================================================
echo.
echo ℹ️  Next steps:
echo 1. Go to your GitHub repository
echo 2. Click Settings → Pages
echo 3. Under 'Source', select 'GitHub Actions'
echo 4. Wait for deployment to complete (check Actions tab)
echo 5. Your site will be available at:
echo    https://ichsanfachris.github.io/YOUR_REPO_NAME/
echo.
echo ✅ Done! Good luck! 🚀
echo.
pause