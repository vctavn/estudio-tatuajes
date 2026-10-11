@echo off
title Sistema de Barberia - The Barber Club
cd /d "%~dp0"

echo ========================================================
echo       THE BARBER CLUB ^& CO. - INICIANDO SISTEMA
echo ========================================================
echo.
echo [1/2] Verificando si hay actualizaciones disponibles en la nube...

:: Intento de actualizacion remota si git esta configurado
git pull origin main --quiet 2>nul
if %errorlevel% equ 0 (
    echo [OK] Sistema actualizado a la ultima version con exito.
) else (
    echo [INFO] Iniciando con la version local actual.
)

echo.
echo [2/2] Abriendo sistema en tu pantalla...

:: Abrir en Microsoft Edge o navegador predeterminado
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "file:///%~dp0index.html"
) else (
    start "" "%~dp0index.html"
)

timeout /t 2 >nul
exit
