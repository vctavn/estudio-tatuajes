@echo off
setlocal
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"

echo ========================================================
echo       SUBIR PROYECTO BARBERIA A GITHUB
echo ========================================================
echo.

set /p GITHUB_USER="Ingresa tu nombre de usuario de GitHub: "
if "%GITHUB_USER%"=="" (
    echo [ERROR] Debes ingresar un usuario de GitHub.
    pause
    exit /b
)

set "REPO_URL=https://github.com/%GITHUB_USER%/barberia.git"
echo.
echo Vinculando con: %REPO_URL%
git remote remove origin 2>nul
git remote add origin "%REPO_URL%"
git branch -M main

echo.
echo Subiendo archivos a la rama main...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo  AVISO DE AUTENTICACION
    echo ========================================================
    echo Si te solicita contrasena, recuerda que GitHub requiere un
    echo 'Personal Access Token' (Token de Acceso Personal) con permiso 'repo'.
    echo Puedes generarlo en: https://github.com/settings/tokens
    echo.
) else (
    echo.
    echo ========================================================
    echo  PROYECTO SUBIDO EXITOSAMENTE A GITHUB!
    echo ========================================================
)

pause
