@echo off
title CardCraft Pro Setup & Push Tool
echo ===================================================
echo   CardCraft Pro - Automatic Git Push & Setup Tool
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your system PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    goto end
)

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in your system PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    goto end
)

echo [1/4] Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install npm packages.
    goto end
)
echo [SUCCESS] Dependencies installed.
echo.

echo [2/4] Initializing local Git repository...
if not exist .git (
    git init
)
echo [SUCCESS] Git repository initialized.
echo.

echo [3/4] Staging and committing files...
git add .
git commit -m "feat: implement premium form-based profile card generator"
git branch -M main
echo [SUCCESS] Files committed to branch 'main'.
echo.

echo [4/4] Configuring remote and pushing to GitHub...
:: Remove origin if it already exists to avoid conflict
git remote remove origin >nul 2>nul
git remote add origin https://github.com/mr-yasar/profile-card--virtualintern.git
echo Pushing to GitHub (this may prompt you for credentials)...
git push -u origin main
if %errorlevel% neq 0 (
    echo [WARNING] Push failed. Make sure the repository exists and you have write permissions.
) else (
    echo [SUCCESS] Code pushed successfully to https://github.com/mr-yasar/profile-card--virtualintern.git
)
echo.

echo ===================================================
echo   All tasks complete! Starting the server now...
echo   Open http://localhost:3000 in your browser.
echo ===================================================
echo.
call npm start

:end
pause
