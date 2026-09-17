@echo off
setlocal
REM ===================================================================
REM   SHINOBI CODEX v1.0 - production build script (Windows)
REM   Bundles the single-file databook into dist\index.html
REM ===================================================================

echo.
echo  ==========================================
echo    SHINOBI CODEX - Naruto Databook v1.0
echo  ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js was not found on PATH.
  echo         Install Node 18+ from https://nodejs.org and try again.
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
for /f "tokens=*" %%v in ('npm -v') do set NPM_VERSION=%%v
echo [info] Node %NODE_VERSION% / npm %NPM_VERSION%

if not exist "node_modules" (
  echo [info] node_modules missing - installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    exit /b 1
  )
) else (
  echo [info] Dependencies already installed.
)

if exist "dist" (
  echo [info] Cleaning previous build output...
  rmdir /s /q "dist"
)

echo [info] Building with Vite...
call npm run build
if errorlevel 1 (
  echo.
  echo [ERROR] Build failed. See the Vite output above.
  exit /b 1
)

echo.
echo  ==========================================
echo    BUILD COMPLETE - dist\index.html ready
echo    Open dist\index.html or run: npm run preview
echo  ==========================================
echo.
endlocal
exit /b 0
