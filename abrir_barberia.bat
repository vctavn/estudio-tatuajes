@echo off
cd /d "%~dp0"
title Sistema de Barberia - The Barber Club
echo ========================================================
echo       THE BARBER CLUB ^& CO. - SISTEMA DE GESTION
echo ========================================================
echo Abriendo aplicacion en tu navegador...

:: Intento 1: Asociacion predeterminada de Windows
start "" "%~dp0index.html"

:: Intento 2: Fallback directo a Microsoft Edge
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "file:///%~dp0index.html"
)

echo.
echo Aplicacion iniciada correctamente.
timeout /t 2 >nul
exit
