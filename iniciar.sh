#!/usr/bin/env bash
echo "===================================================="
echo "   🍕 PIZZASMART PAMPLONA - Iniciador macOS/Linux   "
echo "===================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[AVISO] Node.js no está instalado."
    echo "Por favor descárgalo gratis desde: https://nodejs.org/"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[1/2] Instalando librerías (solo la primera vez)..."
    npm install
fi

echo "[2/2] Iniciando PIZZASMART en http://localhost:3000 ..."
npm run dev
