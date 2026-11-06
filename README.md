# 🍕 PIZZASMART PAMPLONA - Pizzería Artesanal & Plataforma Multi-Tenant SaaS

Sistema fullstack de última generación para pizzería artesanal en Colombia con precios en COP ($), constructor interactivo de pizzas colombianas en tiempo real, menú coloquial (Hawaiana Especial, Criolla, Pollo Champiñones, etc.), cotizador de eventos/catering, chatbot Gino AI con Gemini, tablero KDS de cocina, gestión de roles (Gerente, Admin01, Clientes) y compatibilidad multi-tenant para integrarse como nodo a plataformas SaaS de membresías.

---

## 🚀 Inicio Rápido (Localmente en tu PC)

Para ejecutar esta aplicación en tu propia computadora sin ninguna restricción de acceso:

### 1. Descargar y descomprimir el código
- Haz clic en el botón **"Exportar"** -> **"Descargar pizzasmart.zip"** o genera el paquete directamente en tu navegador.
- En Windows: Haz clic derecho en el archivo descargado `pizzasmart.zip` y selecciona **"Extraer todo..."** (o usa 7-Zip / WinRAR).
- *Nota:* Si alguna vez viste el mensaje de Windows *"esta carpeta está vacía"*, se debe a que algunos navegadores bloquean las descargas dentro de marcos iframe guardando archivos de 0 bytes. Nuestro nuevo descargador incluye validación de integridad por Blob y generador de respaldo en el navegador para garantizar que todos los 31 archivos se extraigan al 100%.

### 0. Requisito Indispensable: Tener Node.js Instalado
Si al escribir `npm install` en tu terminal o PowerShell te sale el error:
> *"El término 'npm' no se reconoce como nombre de un cmdlet, función..."*

Significa que tu computadora aún no tiene instalado **Node.js** (el motor necesario para ejecutar JavaScript en el servidor):
1. Ve a la página oficial gratuita: **https://nodejs.org**
2. Haz clic en el botón verde grande que dice **"LTS (Recomendado para la mayoría)"**.
3. Abre el archivo descargado e instálalo (haz clic en *Next / Siguiente* hasta finalizar).
4. Cierra y vuelve a abrir tu terminal (o usa el paso 2 a continuación).

---

### 1. ⭐ Inicio Rápido en Windows con 1 Solo Clic (¡Sin escribir comandos!)
Dentro de la carpeta descomprimida del proyecto encontrarás un archivo llamado:
👉 **`iniciar.bat`**

**¡Solo hazle doble clic!**
- Detectará Node.js automáticamente (si no lo tienes, te abrirá la página para descargarlo).
- Instalará los paquetes necesarios la primera vez.
- Abrirá tu navegador automáticamente en **http://localhost:3000**.

---

### 2. Método Manual por Terminal (PowerShell / CMD / macOS)
Una vez que tengas Node.js instalado:
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm run dev
```
Abre tu navegador en:
👉 **http://localhost:3000**

---

## 📦 Subir este proyecto a GitHub en 4 comandos

Desde la terminal en la carpeta del proyecto:

```bash
git init
git add .
git commit -m "feat: PIZZASMART Pamplona pizzería artesanal fullstack"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

---

## 🌐 ¿Por qué sale el error 403 al compartir desde Google AI Studio?

Google AI Studio hospeda prototipos bajo el dominio de Google Cloud Run y por defecto protege los enlaces de desarrollo (`ais-dev-...`) exigiendo que la persona que entra inicie sesión con la cuenta de Google propietaria del proyecto. 

Para que cualquier persona pueda entrar libremente:
1. **Opción A (Recomendada):** Sube el proyecto a GitHub y conéctalo en 1 clic a **Vercel**, **Render** o **Railway** (despliegue 100% público, gratuito y sin login de Google).
2. **Opción B:** En Google AI Studio, haz clic en el botón superior **Share** (Compartir) y asegúrate de cambiar la visibilidad a *"Anyone with the link"*, usando siempre el enlace público `ais-pre-...`.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti, Sonner Toaster.
- **Backend:** Express, Node.js, TSX, JSZip.
- **Inteligencia Artificial:** SDK oficial `@google/genai` con modelo `gemini-3.8-flash` y `thinkingLevel: MINIMAL` para respuesta ultrarrápida.
- **Multi-Tenant SaaS:** Endpoints `/api/membership/health`, `/api/membership/verify`, `/api/membership/sync` y `/api/membership/manifest`.
- **Base de Datos:** Motor in-memory auditado con catálogo colombiano, persistencia de usuarios, pedidos KDS y cotizaciones.

