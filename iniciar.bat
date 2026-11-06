@echo off
chcp 65001 > nul
title PIZZASMART - Servidor Local

echo ====================================================
echo    🍕 PIZZASMART PAMPLONA - Iniciador Automático
echo ====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [AVISO IMPORTANTE]
    echo Node.js no está instalado en tu computadora.
    echo.
    echo Node.js es el motor necesario para ejecutar aplicaciones web modernas.
    echo Es 100%% gratuito, seguro y se instala en 1 minuto:
    echo.
    echo   1. Descarga la versión "LTS" (Recomendada) desde https://nodejs.org
    echo   2. Abre el instalador descargado y haz clic en "Siguiente" hasta finalizar.
    echo   3. Vuelve a hacer doble clic en este archivo "iniciar.bat".
    echo.
    echo Presiona cualquier tecla para abrir la página oficial de Node.js...
    pause >nul
    start https://nodejs.org/
    exit /b
)

echo [OK] Node.js y NPM detectados correctamente:
node -v
call npm -v
echo.

if not exist node_modules (
    echo [1/2] Instalando paquetes y librerías del proyecto...
    echo Esto puede tardar 1 o 2 minutos la primera vez. Por favor espera...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Hubo un problema al instalar las librerías.
        pause
        exit /b
    )
) else (
    echo [1/2] Librerías ya verificadas.
)

echo.
echo [2/2] Iniciando PIZZASMART...
echo.
echo Abriendo http://localhost:3000 en tu navegador web...
echo (Para detener la app, cierra esta ventana o presiona Ctrl + C)
echo.

timeout /t 2 >nul
start http://localhost:3000
call npm run dev
pause
