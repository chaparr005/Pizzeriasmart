/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import JSZip from 'jszip';
import { pizzeriaDb } from './src/server/pizzeriaDb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ==========================================
// API REST Endpoints
// ==========================================

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PIZZASMART API - Pizzería Artesanal Inteligente',
    currency: 'COP',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Menu & Catalog
app.get('/api/menu', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  const items = pizzeriaDb.getMenu(category, search);
  const customizer = pizzeriaDb.getCustomizerCatalog();

  res.json({
    success: true,
    count: items.length,
    currency: 'COP',
    items,
    customizer,
  });
});

app.get('/api/menu/:id', (req: Request, res: Response) => {
  const item = pizzeriaDb.getMenuItemById(req.params.id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Producto no encontrado' });
    return;
  }
  res.json({ success: true, item });
});

// Authentication & Customer Profiles (ADMIN01 and Customers)
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password, extraData } = req.body;
    const result = pizzeriaDb.authenticateUser(username, password, extraData);
    if (!result.success) {
      res.status(401).json(result);
      return;
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/profile', (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    if (!user || !user.username) {
      res.status(400).json({ success: false, message: 'Datos de usuario requeridos' });
      return;
    }
    const saved = pizzeriaDb.saveUserProfile(user);
    res.json({ success: true, user: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Pizza Customizer Calculation
app.post('/api/custom-pizza/calculate', (req: Request, res: Response) => {
  try {
    const config = req.body;
    const pricing = pizzeriaDb.calculateCustomPizzaPrice(config);
    res.json({ success: true, pricing });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Catering & Event Quotations
app.post('/api/quotes/calculate', (req: Request, res: Response) => {
  try {
    const request = req.body;
    const quote = pizzeriaDb.calculateCateringQuote(request);
    res.json({ success: true, quote });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/quotes/:id', (req: Request, res: Response) => {
  const quote = pizzeriaDb.getQuoteById(req.params.id);
  if (!quote) {
    res.status(404).json({ success: false, message: 'Cotización no encontrada' });
    return;
  }
  res.json({ success: true, quote });
});

// Promo Codes
app.post('/api/promos/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  const result = pizzeriaDb.validatePromoCode(code, Number(subtotal) || 0);
  res.json({ success: result.valid, ...result });
});

// Orders Management
app.get('/api/orders', (_req: Request, res: Response) => {
  const orders = pizzeriaDb.getAllOrders();
  res.json({ success: true, count: orders.length, orders });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = pizzeriaDb.getOrder(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Orden no encontrada' });
    return;
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    if (!orderData.customerName || !orderData.items || orderData.items.length === 0) {
      res.status(400).json({ success: false, message: 'Faltan datos de cliente o la orden está vacía.' });
      return;
    }
    const order = pizzeriaDb.createOrder(orderData);
    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const order = pizzeriaDb.updateOrderStatus(req.params.id, status);
  if (!order) {
    res.status(404).json({ success: false, message: 'Orden no encontrada' });
    return;
  }
  res.json({ success: true, order });
});

// QA Test Suite Runner
app.get('/api/qa/run', async (_req: Request, res: Response) => {
  try {
    const report = await pizzeriaDb.runQASuite();
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Management Endpoints
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  try {
    const metrics = pizzeriaDb.getAdminMetrics();
    res.json({ success: true, metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/menu/:id', (req: Request, res: Response) => {
  try {
    const updated = pizzeriaDb.updateMenuItem(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/menu/:id/toggle', (req: Request, res: Response) => {
  try {
    const updated = pizzeriaDb.toggleMenuItemAvailability(req.params.id);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Producto no encontrado' });
      return;
    }
    res.json({ success: true, item: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/menu', (req: Request, res: Response) => {
  try {
    const item = pizzeriaDb.addMenuItem(req.body);
    res.status(201).json({ success: true, item });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/menu/:id', (req: Request, res: Response) => {
  try {
    const deleted = pizzeriaDb.deleteMenuItem(req.params.id);
    res.json({ success: deleted });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/quotes', (_req: Request, res: Response) => {
  try {
    const quotes = pizzeriaDb.getAllQuotes();
    res.json({ success: true, quotes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/promos', (_req: Request, res: Response) => {
  try {
    const promos = pizzeriaDb.getAllPromos();
    res.json({ success: true, promos });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/promos', (req: Request, res: Response) => {
  try {
    const promo = pizzeriaDb.addPromo(req.body);
    res.status(201).json({ success: true, promo });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Super-Admin & Gerente User Management Endpoints
app.get('/api/admin/users', (_req: Request, res: Response) => {
  try {
    const users = pizzeriaDb.getAllUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/users', (req: Request, res: Response) => {
  try {
    const newUser = pizzeriaDb.addUser(req.body);
    res.status(201).json({ success: true, user: newUser });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/admin/users/:id', (req: Request, res: Response) => {
  try {
    const updated = pizzeriaDb.updateUser(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }
    res.json({ success: true, user: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/users/:id', (req: Request, res: Response) => {
  try {
    const deleted = pizzeriaDb.deleteUser(req.params.id);
    if (!deleted) {
      res.status(400).json({ success: false, message: 'No se puede eliminar este usuario o no existe.' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/activity-logs', (_req: Request, res: Response) => {
  try {
    const logs = pizzeriaDb.getActivityLogs();
    res.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Multi-Tenant SaaS & Membership Integration Endpoints
// ==========================================

// Get Tenant & White-Label Configuration
app.get('/api/tenant/info', (_req: Request, res: Response) => {
  try {
    const config = pizzeriaDb.getTenantConfig();
    res.json({ success: true, tenant: config });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Tenant Configuration (White-Label, Contact Info, Domain, Webhooks)
app.post('/api/tenant/config', (req: Request, res: Response) => {
  try {
    const updated = pizzeriaDb.updateTenantConfig(req.body);
    res.json({ success: true, tenant: updated, message: 'Configuración de franquicia / nodo actualizada exitosamente.' });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// SaaS Health Heartbeat (Used by Central Membership Hub to monitor all linked pizzerias)
app.get('/api/membership/health', (_req: Request, res: Response) => {
  try {
    const config = pizzeriaDb.getTenantConfig();
    const verification = pizzeriaDb.verifyMembership();
    res.json({
      status: verification.valid ? 'healthy' : 'warning',
      tenantId: config.tenantId,
      restaurantName: config.restaurantName || config.whiteLabel?.restaurantName || 'PIZZASMART PAMPLONA',
      city: config.city || config.whiteLabel?.city || 'Pamplona, Norte de Santander',
      plan: config.membership.plan,
      membershipStatus: verification.status,
      daysRemaining: verification.daysRemaining,
      currency: 'COP',
      uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 3600),
      lastSyncTimestamp: config.lastSyncTimestamp,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Validate or refresh License Key with SaaS Hub
app.post('/api/membership/verify', (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.body;
    const result = pizzeriaDb.verifyMembership(licenseKey);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Sync data & heartbeat with the Parent SaaS Membership Hub
app.post('/api/membership/sync', (req: Request, res: Response) => {
  try {
    const { hubUrl, apiKey } = req.body;
    const result = pizzeriaDb.syncWithPlatformHub(hubUrl, apiKey);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Export 1-Click Connection Manifest for Central Membership Platform
app.get('/api/membership/manifest', (_req: Request, res: Response) => {
  try {
    const manifest = pizzeriaDb.exportSaaSTenantManifest();
    res.json(manifest);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Pizzaiolo Smart AI Chatbot Endpoint
app.post('/api/chatbot', async (req: Request, res: Response) => {
  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ success: false, message: 'Mensaje requerido.' });
    return;
  }

  // System instruction: Human, empathetic, thoughtful Colombian customer service agent
  const systemInstruction = `
Eres un asesor humano de atención al cliente y maestro pizzero en "PIZZASMART PAMPLONA" (Pamplona, Norte de Santander, Colombia).
Tu nombre es Gino y atiendes a las personas como un ser humano real: con genuina calidez, empatía, simpatía y educación santandereana/colombiana.
PIENSA DETENIDAMENTE antes de cada respuesta: comprende qué busca el cliente (hambre rápida, una comida familiar, algo dulce o salado, una recomendación con presupuesto, o un evento) y ofrécele una respuesta conversacional, amena y muy humana.
NUNCA suenes como un robot o plantilla genérica. Habla como una persona real de atención al cliente ("¡Hola! Qué gusto saludarte", "Déjame recomendarte algo delicioso para hoy...", "Con muchísimo gusto te colaboro").
Mantén las respuestas fluidas y concisas (2 a 4 oraciones bien redactadas), siempre mencionando valores exactos en Pesos Colombianos (COP).

Especialidades de la carta:
- Pizza Hawaiana Especial: $33.000 COP (piña oro miel calada artesanal, jamón pietrán premium y abundante mozzarella)
- Pizza Mexicana con Jalapeños: $36.000 COP (jalapeños encurtidos, carne molida sazonada y totopos crocantes)
- Pizza Criolla Santandereana: $38.000 COP (tocineta crujiente, maíz dulce tierno, plátano maduro caramelizado)
- Pizza Pollo con Champiñones: $35.000 COP (pechuga desmechada al ajo y champiñones salteados)
- Margherita Clásica: $32.000 COP | Diavola Piccante: $36.000 COP | Cuatro Quesos: $38.000 COP
Bebidas heladas:
- Coca-Cola Personal 400ml: $5.500 COP | Coca-Cola Zero: $5.500 COP
- Postobón Manzana: $4.800 COP | Colombiana La Nuestra: $4.800 COP
- Cerveza Club Colombia Dorada: $7.000 COP | Corona Extra: $8.500 COP
Zonas de entrega en Pamplona: Centro, El Buque, La Casona, Universidad de Pamplona y alrededores (promedio 25 a 35 minutos).
Cupones activos: SMART10 (10% OFF en pedidos > $60.000 COP) y BIENVENIDO ($10.000 COP de descuento).
`;

  // Fallback Rule-Based Response Generator if Gemini is not reachable or no API key
  const generateFallbackResponse = (userMsg: string): string => {
    const q = userMsg.toLowerCase();
    if (q.includes('hawaian') || q.includes('pina') || q.includes('piña')) {
      return '¡Hola! Es una excelente elección. 🍍 Nuestra Pizza Hawaiana Especial ($33.000 COP) la preparamos con piña oro miel caramelizada artesanalmente y jamón pietrán sobre mozzarella fundente. Te aseguro que queda espectacular recién salida del horno de piedra. ¿Te gustaría añadirle una Coca-Cola bien fría?';
    }
    if (q.includes('mexican') || q.includes('jalape') || q.includes('nacho') || q.includes('picante')) {
      return '¡Qué delicia! Si te gusta el toque picante y crocante, la Pizza Mexicana ($36.000 COP) es la favorita. Lleva carne sazonada, jalapeños encurtidos y totopos dorados. Con todo gusto puedes tocar el botón de abajo para agregarla directo a tu orden.';
    }
    if (q.includes('crioll') || q.includes('platano') || q.includes('maduro') || q.includes('santander') || q.includes('maiz')) {
      return '¡Un verdadero orgullo de nuestra tierra! 🇨🇴 La Criolla Santandereana ($38.000 COP) combina tocineta crujiente ahumada, maíz tierno desgranado y trocitos de plátano maduro. A los comensales en Pamplona les fascina este balance.';
    }
    if (q.includes('coca') || q.includes('bebida') || q.includes('gaseosa') || q.includes('postobon') || q.includes('colombiana') || q.includes('cerveza') || q.includes('club colombia')) {
      return '¡Claro que sí, nada mejor que una bebida bien helada! 🥤 Tenemos Coca-Cola personal de 400ml ($5.500 COP), Postobón Manzana o Colombiana ($4.800 COP) y Club Colombia Dorada ($7.000 COP). Con un clic la sumas a tu pedido.';
    }
    if (q.includes('recomiend') || q.includes('cual es la mejor') || q.includes('menu') || q.includes('sugerir')) {
      return '¡Hola, qué gusto atenderte! Dependiendo de tu gusto, si prefieres sabores suaves y dulces te recomiendo a ojos cerrados la Hawaiana Especial ($33.000 COP), pero si buscas un sabor bien criollo con madurito y tocineta, la Criolla Santandereana ($38.000 COP) es insuperable. ¿Cuál te llama más la atención?';
    }
    if (q.includes('cotiz') || q.includes('evento') || q.includes('personas') || q.includes('fiesta') || q.includes('catering') || q.includes('cumple')) {
      return '¡Excelente, celebremos juntos! 🎉 En PIZZASMART atendemos eventos y reuniones en Pamplona calculando 5 porciones por adulto y 3 por niño para que nadie se quede con hambre, con descuentos especiales por volumen. Puedes tocar la pestaña de "Cotizador Eventos" y te lo calculo en un segundo.';
    }
    if (q.includes('descuento') || q.includes('cupon') || q.includes('promo') || q.includes('oferta')) {
      return '¡Por supuesto, siempre consentimos a nuestros clientes! 🎟️ Puedes usar el código SMART10 al finalizar tu pedido para un 10% de descuento en órdenes superiores a $60.000 COP.';
    }
    if (q.includes('tiempo') || q.includes('tardan') || q.includes('entrega') || q.includes('delivery') || q.includes('domicilio')) {
      return 'Nuestras pizzas van a horno de piedra volcánica a 450°C y están listas en 90 segundos. Nuestro domiciliario te la lleva calientita en un promedio de 25 a 35 minutos a cualquier sector de Pamplona en maletín térmico a 75°C.';
    }
    return '¡Hola! Es un placer saludarte. Soy Gino de atención al cliente en PIZZASMART Pamplona 🍕. Cuéntame con toda confianza qué se te antoja hoy o si deseas que te ayude a armar una combinación deliciosa.';
  };

  try {
    if (ai) {
      const formattedHistory = conversationHistory.slice(-4).map((msg: { sender: string; text: string }) => {
        return `${msg.sender === 'user' ? 'Cliente' : 'Asesor Gino'}: ${msg.text}`;
      }).join('\n');

      const fullPrompt = `${formattedHistory ? `Historial de la conversación:\n${formattedHistory}\n\n` : ''}Cliente: ${message}\n\nAsesor Gino (empático, humano, educado, colombiano, fluido, precios COP):`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || generateFallbackResponse(message);
      res.json({
        success: true,
        reply: replyText.trim(),
        source: 'gemini-2.5-flash',
      });
      return;
    }

    res.json({
      success: true,
      reply: generateFallbackResponse(message),
      source: 'smart-pizzaiolo-pamplona',
    });
  } catch (error: any) {
    console.error('Error generating AI response, using graceful fallback:', error);
    res.json({
      success: true,
      reply: generateFallbackResponse(message),
      source: 'smart-pizzaiolo-fallback',
    });
  }
});

// Helper function to read files recursively
function getProjectFiles(dir: string, baseDir: string = dir): { relativePath: string; fullPath: string }[] {
  let results: { relativePath: string; fullPath: string }[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.cache') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getProjectFiles(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ relativePath, fullPath });
    }
  }
  return results;
}

// Export Project Source Code Tree (JSON)
app.get('/api/export/source-tree', (_req: Request, res: Response) => {
  try {
    const files = getProjectFiles(__dirname);
    const fileContents: Record<string, string> = {};

    for (const file of files) {
      try {
        // Only text files
        const ext = path.extname(file.fullPath).toLowerCase();
        if (['.ts', '.tsx', '.json', '.html', '.css', '.md', '.example'].includes(ext) || file.relativePath.includes('.env')) {
          fileContents[file.relativePath] = fs.readFileSync(file.fullPath, 'utf-8');
        }
      } catch (err) {
        // Skip binary or unreadable files
      }
    }

    res.json({
      success: true,
      totalFiles: Object.keys(fileContents).length,
      files: fileContents,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Check Project Files Export Status
app.get('/api/export/status', (_req: Request, res: Response) => {
  try {
    const files = getProjectFiles(__dirname);
    const summary = files.map((f) => {
      const stat = fs.statSync(f.fullPath);
      return { path: f.relativePath, size: stat.size };
    });
    res.json({
      success: true,
      totalFiles: files.length,
      totalSizeBytes: summary.reduce((acc, f) => acc + f.size, 0),
      files: summary,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Project as .ZIP Download (Robust Windows/Mac/Linux Compatible)
app.get('/api/export/project-zip', async (_req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    const files = getProjectFiles(__dirname);

    // Register all directories explicitly so Windows Explorer unzips properly
    const foldersAdded = new Set<string>();
    for (const file of files) {
      const parts = file.relativePath.split('/');
      if (parts.length > 1) {
        let currentDir = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentDir = currentDir ? `${currentDir}/${parts[i]}` : parts[i];
          if (!foldersAdded.has(currentDir)) {
            zip.folder(currentDir);
            foldersAdded.add(currentDir);
          }
        }
      }
      try {
        const content = fs.readFileSync(file.fullPath);
        zip.file(file.relativePath, content, {
          createFolders: true,
          date: new Date('2026-01-01T12:00:00Z'),
        });
      } catch (err) {
        console.warn('Skipping file during zip creation:', file.relativePath);
      }
    }

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
      platform: 'DOS', // Maximum compatibility with Windows Explorer & macOS Archive Utility
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="pizzasmart.zip"');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');
    res.send(zipBuffer);
  } catch (err: any) {
    console.error('Error in /api/export/project-zip:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Vite Integration (Dev & Prod)
// ==========================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`> Bella Napoli Pizzeria Server running on http://localhost:${PORT}`);
  });
}

startServer();
