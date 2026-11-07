@echo off
cd /d "%~dp0"
title TATTOO STUDIO - Sistema de Gestión
echo ========================================================
echo            TATTOO STUDIO - SISTEMA DE GESTION
echo ========================================================
echo Abriendo aplicacion en tu navegador...

:: Abrir en Microsoft Edge o navegador predeterminado
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "file:///%~dp0index.html"
) else (
    start "" "%~dp0index.html"
)

echo.
echo Aplicacion iniciada correctamente.
timeout /t 2 >nul
exit
