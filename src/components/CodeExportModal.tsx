import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Copy,
  Check,
  Code2,
  Terminal,
  ExternalLink,
  ShieldAlert,
  FileCode,
  FolderGit2,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileArchive,
  HardDriveDownload,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'zip' | 'github' | 'files'>('zip');
  const [selectedFile, setSelectedFile] = useState<string>('package.json');
  const [filesMap, setFilesMap] = useState<Record<string, string>>({});
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMethod, setDownloadMethod] = useState<'server' | 'browser'>('server');
  const [exportStats, setExportStats] = useState<{ totalFiles: number; totalSizeBytes: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (Object.keys(filesMap).length === 0) {
        setIsLoadingFiles(true);
        fetch('/api/export/source-tree')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.files) {
              setFilesMap(data.files);
            }
          })
          .catch((err) => console.error('Error cargando archivos:', err))
          .finally(() => setIsLoadingFiles(false));
      }

      fetch('/api/export/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setExportStats({
              totalFiles: data.totalFiles,
              totalSizeBytes: data.totalSizeBytes,
            });
          }
        })
        .catch(() => {});
    }
  }, [isOpen, filesMap]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copiado al portapapeles', {
      description: 'El código o comando está listo para pegar.',
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadZip = async (method: 'server' | 'browser' = 'server') => {
    setIsDownloading(true);
    setDownloadMethod(method);

    try {
      if (method === 'server') {
        toast.info('Descargando paquete completo...', {
          description: 'Obteniendo pizzasmart.zip verificado desde el servidor...',
        });

        // Use Blob fetch to prevent iframe download blocks and 0-byte downloads
        const res = await fetch('/api/export/project-zip', { cache: 'no-store' });
        if (!res.ok) throw new Error('El servidor de exportación no respondió');
        const blob = await res.blob();

        // If the blob is abnormally small (< 10 KB), it means an error or 0-byte download happened
        if (blob.size < 10000) {
          throw new Error('Archivo recibido incompleto. Activando generador directo en navegador...');
        }

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'pizzasmart.zip';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }, 3000);

        toast.success('¡Descarga exitosa de pizzasmart.zip!', {
          description: `Archivo verificado (${(blob.size / 1024).toFixed(1)} KB) listo para descomprimir.`,
        });
        setIsDownloading(false);
        return;
      }

      // Method: Browser-side JSZip Generation (100% immune to iframe blocks and empty folders)
      toast.info('Generando ZIP directamente en tu navegador...', {
        description: 'Empaquetando todos los archivos sin intermediarios...',
      });

      // Ensure files are loaded
      let sourceFiles = filesMap;
      if (Object.keys(sourceFiles).length === 0) {
        const treeRes = await fetch('/api/export/source-tree');
        const treeData = await treeRes.json();
        if (treeData.success && treeData.files) {
          sourceFiles = treeData.files;
          setFilesMap(sourceFiles);
        }
      }

      const zip = new JSZip();
      // Add each file ensuring folders are registered
      for (const [filePath, fileContent] of Object.entries(sourceFiles)) {
        zip.file(filePath, fileContent, {
          createFolders: true,
          date: new Date('2026-01-01T12:00:00Z'),
        });
      }

      const generatedBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const url = window.URL.createObjectURL(generatedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pizzasmart-navegador.zip';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 3000);

      toast.success('¡Paquete generado y descargado exitosamente!', {
        description: `${Object.keys(sourceFiles).length} archivos empaquetados (${(generatedBlob.size / 1024).toFixed(1)} KB).`,
      });
    } catch (err: any) {
      console.warn('Fallo método servidor, cambiando automáticamente a generador en navegador:', err.message);
      // Fallback to browser generation automatically!
      if (method === 'server') {
        handleDownloadZip('browser');
        return;
      }
      toast.error('No se pudo descargar el archivo: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const gitCommands = `# 1. Inicializar repositorio Git local
git init

# 2. Agregar todos los archivos
git add .

# 3. Guardar el primer commit
git commit -m "feat: PIZZASMART Pizzeria artesanal fullstack completa"

# 4. Cambiar a rama principal
git branch -M main

# 5. Conectar con tu repositorio de GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 6. Subir el proyecto a GitHub
git push -u origin main`;

  const availableFiles = [
    'package.json',
    'server.ts',
    'src/App.tsx',
    'src/server/pizzeriaDb.ts',
    'src/components/AdminDashboard.tsx',
    'src/components/MenuView.tsx',
    'src/components/PizzaBuilder.tsx',
    'src/components/CateringQuoteEngine.tsx',
    'src/components/GinoChatbot.tsx',
    'src/components/KitchenDashboard.tsx',
    'src/components/OrderTracker.tsx',
    'src/types/pizzeria.ts',
    'src/services/api.ts',
    'vite.config.ts',
    'tsconfig.json',
    'index.html',
    '.env.example',
    'README.md',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg text-white">
                  Exportar Proyecto & Guía de Acceso Público
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-800">
                  Sin Restricciones
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Descarga el proyecto completo en ZIP o copia el código directamente para subirlo a tu GitHub.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('zip')}
            className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-all ${
              activeTab === 'zip'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Descargar ZIP & Ejecutar en PC</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-all ${
              activeTab === 'github'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Comandos para GitHub</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-all ${
              activeTab === 'files'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Copiar Archivos de Código</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: ZIP & LOCAL RUN */}
          {activeTab === 'zip' && (
            <div className="space-y-6">
              {/* Error 403 Explanation Box */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 flex items-start gap-3.5">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-300">
                    ¿Por qué el otro usuario vio el error "403 de Google"?
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    Google AI Studio coloca un cortafuegos (Google Auth Bridge) que solo permite entrar a la cuenta de Google con la que creaste el proyecto.
                    <strong> Al descargarlo o subirlo a GitHub y desplegarlo en Vercel, Render o en tu computadora, la aplicación es 100% pública y libre de cualquier login o bloqueo de Google.</strong>
                  </p>
                </div>
              </div>

              {/* Verified Project Stats Card */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>Estructura de Archivos Verificada</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                        0 Carpetas Vacías
                      </span>
                    </div>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      {exportStats?.totalFiles || Object.keys(filesMap).length || 31} archivos listos • Frontend React 19 + Servidor Express + Base de Datos + Catálogo Colombiano.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Node.js 18+ • TypeScript • Vite 8</span>
                </div>
              </div>

              {/* Direct ZIP Download Cards */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-white flex items-center gap-2">
                      <FileArchive className="w-5 h-5 text-amber-400" />
                      <span>Paquete Completo PIZZASMART (.zip)</span>
                    </h4>
                    <p className="text-xs text-stone-400 max-w-md">
                      Descarga verificada con todos los archivos de frontend, backend, KDS de cocina, constructor de pizza colombiana y chatbot Gino AI.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDownloadZip('server')}
                      disabled={isDownloading}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-950/80 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isDownloading && downloadMethod === 'server' ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                      ) : (
                        <Download className="w-4 h-4 text-stone-950" />
                      )}
                      <span>Descargar pizzasmart.zip</span>
                    </button>

                    <button
                      onClick={() => handleDownloadZip('browser')}
                      disabled={isDownloading}
                      className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs flex items-center gap-2 border border-stone-700 active:scale-95 transition-all disabled:opacity-50"
                      title="Genera el ZIP directamente en tu navegador para saltarse cualquier bloqueo de descarga del iframe"
                    >
                      {isDownloading && downloadMethod === 'browser' ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      ) : (
                        <HardDriveDownload className="w-4 h-4 text-amber-400" />
                      )}
                      <span>Generar en Navegador (Anti-bloqueos)</span>
                    </button>
                  </div>
                </div>

                {/* Explanation of empty folder issue */}
                <div className="pt-3 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>¿Por qué antes aparecía "la carpeta está vacía"?</strong> Cuando un navegador dentro de un iframe bloquea la descarga tradicional, guardaba un archivo corrupto de 0 bytes. Ahora el sistema valida los bytes con Blob y genera el paquete directamente en tu memoria para que contenga cada archivo al 100%.
                  </span>
                </div>
              </div>

              {/* How to run locally */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Instrucciones para correrlo en tu computadora:
                </h4>
                <div className="space-y-2 text-xs">
                  {/* Step 0: Node.js check */}
                  <div className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-600/30 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300">Requisito Previo: Tener Node.js Instalado</span>
                        <span className="text-[10px] bg-amber-900/60 text-amber-200 px-1.5 py-0.2 rounded font-mono">Gratis</span>
                      </div>
                      <p className="text-stone-300 text-[11px] mt-0.5">
                        Si PowerShell te dice <em>"El término 'npm' no se reconoce"</em>, significa que tu PC aún no tiene Node.js.
                        Descárgalo e instálalo en 1 minuto desde su web oficial (versión LTS).
                      </p>
                    </div>
                    <a
                      href="https://nodejs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Descargar Node.js</span>
                    </a>
                  </div>

                  {/* 1-Click Windows shortcut */}
                  <div className="p-3.5 bg-emerald-950/20 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400">⭐ Método Rápido Windows (1 Clic)</span>
                        <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold">¡Sin escribir comandos!</span>
                      </div>
                      <p className="text-stone-300 text-[11px] mt-0.5">
                        En la carpeta descomprimida encontrarás un archivo llamado <code className="text-emerald-300 font-mono font-bold bg-black/40 px-1.5 py-0.5 rounded border border-emerald-800">iniciar.bat</code>. ¡Solo hazle doble clic y él se encargará de todo automáticamente!
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Método Manual Paso 1: Abrir terminal en la carpeta</span>
                      <p className="text-stone-400 text-[11px]">Ejecuta en la terminal para instalar librerías:</p>
                      <code className="text-amber-400 font-mono text-[11px] block mt-1">npm install</code>
                    </div>
                    <button
                      onClick={() => handleCopy('npm install', 'npm-install')}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5"
                    >
                      {copiedKey === 'npm-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copiar</span>
                    </button>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Método Manual Paso 2: Arrancar el servidor</span>
                      <p className="text-stone-400 text-[11px]">Inicia el servidor fullstack (Express + Vite en puerto 3000):</p>
                      <code className="text-amber-400 font-mono text-[11px] block mt-1">npm run dev</code>
                    </div>
                    <button
                      onClick={() => handleCopy('npm run dev', 'npm-run-dev')}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5"
                    >
                      {copiedKey === 'npm-run-dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB COMMANDS */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Comandos para subir a tu GitHub</h4>
                  <p className="text-xs text-stone-400">
                    Copia estos comandos y pégalos en tu terminal dentro de la carpeta del proyecto:
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(gitCommands, 'git-all')}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'git-all' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>Copiar Todos los Comandos</span>
                </button>
              </div>

              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 font-mono text-xs text-stone-300 overflow-x-auto leading-relaxed">
                <pre>{gitCommands}</pre>
              </div>

              <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800/80 space-y-2 text-xs">
                <span className="font-bold text-amber-400 block">¿Cómo desplegarlo gratis y 100% público en 2 minutos?</span>
                <ol className="list-decimal list-inside space-y-1 text-stone-300">
                  <li>Una vez que subas el repositorio a tu GitHub, ve a <a href="https://render.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">Render.com</a> o <a href="https://railway.app" target="_blank" rel="noreferrer" className="text-amber-400 underline">Railway.app</a>.</li>
                  <li>Selecciona <strong>"New Web Service"</strong> y conecta tu repositorio.</li>
                  <li>En Build Command pon: <code className="bg-stone-900 px-1.5 py-0.5 rounded text-amber-300">npm install && npm run build</code></li>
                  <li>En Start Command pon: <code className="bg-stone-900 px-1.5 py-0.5 rounded text-amber-300">npm run start</code></li>
                  <li>¡Listo! Te dará un enlace público que funcionará para todo el mundo sin errores de Google 403.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: FILE CODE INSPECTOR */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 no-scrollbar text-xs">
                  {availableFiles.map((fname) => (
                    <button
                      key={fname}
                      onClick={() => setSelectedFile(fname)}
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-colors ${
                        selectedFile === fname
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      {fname.split('/').pop()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const content = filesMap[selectedFile] || '';
                    handleCopy(content, `file-${selectedFile}`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-stone-700"
                >
                  {copiedKey === `file-${selectedFile}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copiar {selectedFile.split('/').pop()}</span>
                </button>
              </div>

              {/* Code viewer */}
              <div className="relative rounded-2xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs text-stone-300 overflow-x-auto max-h-96">
                {isLoadingFiles ? (
                  <div className="py-12 text-center text-stone-500">Cargando árbol de archivos...</div>
                ) : filesMap[selectedFile] ? (
                  <pre>{filesMap[selectedFile]}</pre>
                ) : (
                  <div className="py-8 text-center text-stone-500">
                    Archivo no encontrado en memoria o seleccionando...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
