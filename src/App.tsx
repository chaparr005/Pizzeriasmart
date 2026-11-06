/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Hero } from './components/Hero';
import { MenuView } from './components/MenuView';
import { PizzaBuilder } from './components/PizzaBuilder';
import { CateringQuoteEngine } from './components/CateringQuoteEngine';
import { OrderTracker } from './components/OrderTracker';
import { KitchenDashboard } from './components/KitchenDashboard';
import { QASuiteView } from './components/QASuiteView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { GinoChatbot } from './components/GinoChatbot';
import { CartDrawer } from './components/CartDrawer';
import { CodeExportModal } from './components/CodeExportModal';
import {
  MenuItem,
  CartItem,
  Order,
  CateringQuote,
  DoughOption,
  SauceOption,
  CheeseOption,
  ToppingOption,
  UserProfile,
} from './types/pizzeria';
import { api } from './services/api';
import {
  DOUGH_OPTIONS,
  SAUCE_OPTIONS,
  CHEESE_OPTIONS,
  TOPPING_OPTIONS,
  DEMO_MENU_ITEMS,
} from './server/pizzeriaDb';
import {
  Flame,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Heart,
  Pizza,
  ArrowRight,
  FolderGit2,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { formatCOP } from './utils/format';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pizzasmart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPortalActive, setIsAdminPortalActive] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEMO_MENU_ITEMS);
  const [doughs, setDoughs] = useState<DoughOption[]>(DOUGH_OPTIONS);
  const [sauces, setSauces] = useState<SauceOption[]>(SAUCE_OPTIONS);
  const [cheeses, setCheeses] = useState<CheeseOption[]>(CHEESE_OPTIONS);
  const [toppings, setToppings] = useState<ToppingOption[]>(TOPPING_OPTIONS);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Initial friendly demo cart item in COP
    return [
      {
        id: 'cart-init-1',
        type: 'menu_item',
        menuItemId: 'piz-haw',
        name: 'Pizza Hawaiana Especial',
        size: 'mediana',
        price: 34000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
      },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState<string>('ORD-8492');
  const [builderTemplate, setBuilderTemplate] = useState<{
    name: string;
    doughId?: string;
    sauceId?: string;
    cheeseId?: string;
    toppings?: string[];
  } | undefined>(undefined);

  // Fetch menu and catalog from server on load
  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const res = await api.getMenu();
        if (res.success && res.items.length > 0) {
          setMenuItems(res.items);
          if (res.customizer) {
            setDoughs(res.customizer.doughs);
            setSauces(res.customizer.sauces);
            setCheeses(res.customizer.cheeses);
            setToppings(res.customizer.toppings);
          }
        }
      } catch (err) {
        console.warn('API getMenu failed, using loaded demo data:', err);
      }
    };

    loadCatalog();
  }, []);

  // Cart operations with interactive Toast notifications in COP
  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.name === newItem.name &&
          it.size === newItem.size &&
          it.type === newItem.type &&
          JSON.stringify(it.customDetails) === JSON.stringify(newItem.customDetails)
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    toast.success(`¡${newItem.name} agregada!`, {
      description: `${newItem.size.toUpperCase()} · ${formatCOP(newItem.price * newItem.quantity)} COP`,
      action: {
        label: 'Ver Carrito',
        onClick: () => setIsCartOpen(true),
      },
      duration: 3500,
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? { ...it, quantity: nextQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    const removedItem = cartItems.find((it) => it.id === id);
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    if (removedItem) {
      toast.info(`Eliminado: ${removedItem.name}`, {
        duration: 2000,
      });
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info('El carrito ha sido vaciado');
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setTrackedOrderId(newOrder.id);
    setActiveTab('tracker');
    toast.success(`¡Orden #${newOrder.id} confirmada!`, {
      description: `Masa en preparación para ${newOrder.customerName}. Tiempo: ~${newOrder.estimatedMinutes} min.`,
      duration: 5000,
    });
  };

  const handleCustomizeItem = (item: MenuItem) => {
    setBuilderTemplate({
      name: item.name,
      doughId: 'dough-masamadre',
      sauceId: item.category === 'gourmet' ? 'sauce-trufa' : 'sauce-sanmarzano',
      cheeseId: 'cheese-bufala',
      toppings: ['top-salame', 'top-albahaca'],
    });
    setActiveTab('builder');
    toast.info(`Personalizando: ${item.name}`, {
      description: 'Ajusta la masa, salsa, quesos y toppings en vivo.',
    });
  };

  const handleQuoteAccepted = (quote: CateringQuote) => {
    toast.success(`¡Cotización #${quote.id} validada!`, {
      description: `${quote.totalGuests} invitados · ${quote.estimatedPizzasNeeded} pizzas familiares · Total: ${formatCOP(quote.finalTotal)} COP`,
      action: {
        label: 'Ver Menú',
        onClick: () => setActiveTab('menu'),
      },
      duration: 4500,
    });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('pizzasmart_user', JSON.stringify(user));
    } catch {}
    if (user.role === 'gerente') {
      setIsAdminPortalActive(true);
      toast.success('¡Acceso concedido como Gerente General (GERENTE01)!', {
        description: 'Control total de alta dirección: gestión de personal, roles, auditoría y métricas.',
      });
    } else if (user.role === 'admin') {
      setIsAdminPortalActive(true);
      toast.success('¡Acceso concedido como Administrador ADMIN01!', {
        description: 'Tienes acceso total a comandas KDS, inventario, precios y ventas.',
      });
    } else {
      setIsAdminPortalActive(false);
      toast.success(`¡Bienvenido ${user.name}!`, {
        description: 'Tus datos de entrega en Pamplona están guardados para compras rápidas.',
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminPortalActive(false);
    try {
      localStorage.removeItem('pizzasmart_user');
    } catch {}
  };

  const cartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toaster position="bottom-left" richColors theme="dark" closeButton />

      {/* Main Top Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAdminPortalActive={isAdminPortalActive}
        onToggleAdminView={() => setIsAdminPortalActive(!isAdminPortalActive)}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleChatbot={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Tab Router View */}
      <main className="flex-1">
        {(currentUser?.role === 'admin' || currentUser?.role === 'gerente') && isAdminPortalActive ? (
          /* Dedicated Admin / Gerencial Portal Interface */
          <AdminDashboard
            onReturnToClient={() => setIsAdminPortalActive(false)}
            currentUser={currentUser}
          />
        ) : (
          /* Client / Customer Interface */
          <>
            {activeTab === 'menu' && (
              <>
                <Hero
                  onNavigate={setActiveTab}
                  onOpenGino={() => setIsChatOpen(true)}
                  onAddToCart={handleAddToCart}
                />
                <MenuView
                  items={menuItems}
                  onAddToCart={handleAddToCart}
                  onCustomizeItem={handleCustomizeItem}
                />
              </>
            )}

            {activeTab === 'builder' && (
              <PizzaBuilder
                doughs={doughs}
                sauces={sauces}
                cheeses={cheeses}
                toppings={toppings}
                onAddToCart={handleAddToCart}
                initialTemplate={builderTemplate}
              />
            )}

            {activeTab === 'quotation' && (
              <CateringQuoteEngine onQuoteAccepted={handleQuoteAccepted} />
            )}

            {activeTab === 'tracker' && (
              <OrderTracker initialOrderId={trackedOrderId} />
            )}

            {activeTab === 'kitchen' && (
              <div className="p-4">
                <div className="max-w-7xl mx-auto mb-4 bg-amber-950/40 border border-amber-600/40 p-3 rounded-xl flex items-center justify-between text-xs text-amber-200">
                  <span>Visualización de comanda de cocina.</span>
                  {currentUser?.role === 'admin' ? (
                    <button
                      onClick={() => setIsAdminPortalActive(true)}
                      className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500"
                    >
                      Abrir Portal Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-500"
                    >
                      Iniciar como ADMIN01
                    </button>
                  )}
                </div>
                <KitchenDashboard />
              </div>
            )}

            {activeTab === 'qa' && (
              <div className="p-4">
                <QASuiteView />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Interactive Quick Cart Bar (COP) */}
      {cartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-zinc-900/95 backdrop-blur-md border border-orange-500/40 p-3 rounded-2xl shadow-2xl shadow-black/90 flex items-center justify-between text-white">
            <div
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 cursor-pointer pl-1 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center text-white font-mono font-bold shadow-md group-hover:scale-105 transition-transform">
                {cartCount}
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                  {cartCount === 1 ? '1 Pizza en tu Carrito' : `${cartCount} Productos en tu Carrito`}
                </div>
                <div className="text-[11px] font-mono font-bold text-orange-400">
                  Subtotal: {formatCOP(cartTotal)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>Ver Pedido</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sliding Cart Drawer with auto-filled saved client profile */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Discrete Authentication & Customer Data Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onOpenAdminPortal={() => setIsAdminPortalActive(true)}
      />

      {/* Floating Pizzaiolo Smart AI Assistant */}
      <GinoChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        onAddToCart={handleAddToCart}
      />

      {/* Full Code Export & GitHub Instructions Modal */}
      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Modern Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 text-zinc-400 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <Pizza className="w-4 h-4" />
                </div>
                <span className="font-sans font-black text-lg text-white">
                  PIZZA<span className="text-orange-500">SMART</span>
                </span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                Pizzería artesanal inteligente en Colombia. Masa madre fermentada 72h, horno de piedra a 450°C e ingredientes San Marzano D.O.P.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Auténtica Tradición Napolitana D.O.P.</span>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Horario del Horno
              </h5>
              <div className="space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span>Lunes a Jueves:</span>
                  <span className="text-zinc-300 font-mono">12:00 - 22:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Viernes y Sábado:</span>
                  <span className="text-zinc-300 font-mono">12:00 - 23:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span className="text-zinc-300 font-mono">12:00 - 22:00</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Sedes en Colombia
              </h5>
              <div className="space-y-1 text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Carrera 6 # 5 - 20, Centro Histórico / Pamplona, N. de Santander</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+57 310 456 7890 (Domicilios & Eventos Pamplona)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>pedidos@pizzasmart.co</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Exportar / GitHub
              </h5>
              <p className="text-[11px] text-zinc-400">
                Descarga el proyecto completo en ZIP para ejecutarlo localmente o subirlo a GitHub.
              </p>
              <button
                onClick={() => setIsExportOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-orange-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-orange-400" />
                <span>Descargar Código (.ZIP)</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-[11px]">
            <div>© {new Date().getFullYear()} PIZZASMART Pamplona. Todos los derechos reservados. Precios en Pesos Colombianos (COP).</div>
            <div className="flex items-center gap-1 text-zinc-400">
              Hecho con <Heart className="w-3 h-3 text-red-500 fill-red-500" /> y masa madre viva.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
