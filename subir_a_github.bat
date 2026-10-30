@echo off
setlocal
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"

echo ========================================================
echo       SUBIR PROYECTO ESTUDIO DE TATUAJES A GITHUB
echo ========================================================
echo.

set "REPO_URL=https://github.com/vctavn/estudio-tatuajes.git"
echo Vinculando con: %REPO_URL%
git remote remove origin 2>nul
git remote add origin "%REPO_URL%"
git branch -M main

echo.
echo Sincronizando y subiendo archivos a la rama main...
git add .
git commit -m "feat: fase 1 solicitudes, cotizaciones, depositos y horarios libres"
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo  AVISO DE AUTENTICACION
    echo ========================================================
    echo Si te solicita contrasena, recuerda que GitHub requiere un
    echo 'Personal Access Token' con permiso 'repo'.
    echo.
) else (
    echo.
    echo ========================================================
    echo  PROYECTO SUBIDO EXITOSAMENTE A GITHUB!
    echo  Repositorio: %REPO_URL%
    echo ========================================================
)

pause
