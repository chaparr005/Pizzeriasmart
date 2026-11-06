import React from 'react';
import {
  Pizza,
  Sparkles,
  Calculator,
  Compass,
  UtensilsCrossed,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  Flame,
  FolderGit2,
  User,
  Crown,
} from 'lucide-react';
import { formatCOP } from '../utils/format';
import { UserProfile } from '../types/pizzeria';

export type ActiveTab =
  | 'menu'
  | 'builder'
  | 'quotation'
  | 'tracker'
  | 'kitchen'
  | 'qa';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  isAdminPortalActive: boolean;
  onToggleAdminView: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onToggleChatbot: () => void;
  isChatOpen: boolean;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  isAdminPortalActive,
  onToggleAdminView,
  cartCount,
  cartTotal,
  onOpenCart,
  onToggleChatbot,
  isChatOpen,
  onOpenExport,
}) => {
  const clientNavItems = [
    { id: 'menu' as ActiveTab, label: 'Menú Interactivo', icon: Pizza },
    { id: 'builder' as ActiveTab, label: 'Arma tu Pizza', icon: Sparkles },
    { id: 'quotation' as ActiveTab, label: 'Cotizador Eventos', icon: Calculator, badge: 'Catering' },
    { id: 'tracker' as ActiveTab, label: 'Rastreo en Vivo', icon: Compass },
  ];

  const adminNavItems = [
    { id: 'kitchen' as ActiveTab, label: 'Comandas & KDS', icon: UtensilsCrossed },
    { id: 'qa' as ActiveTab, label: 'Suite QA', icon: ShieldCheck, badge: 'Tests' },
  ];

  const navItems = isAdminPortalActive ? adminNavItems : clientNavItems;

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 text-zinc-100 shadow-2xl">
      {/* Top Banner - Sleek, fast, Colombian currency promo */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 text-xs py-1.5 px-4 text-center text-white font-medium flex items-center justify-center gap-3">
        <span className="flex items-center gap-1.5 font-bold tracking-tight">
          <Flame className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
          PIZZASMART
        </span>
        <span className="hidden sm:inline text-white/50">•</span>
        <span className="hidden sm:inline text-[11px] font-medium text-amber-100">
          Horno de piedra a 450°C · Masa madre 72h · Precios en COP
        </span>
        <span className="text-white/50">•</span>
        <span className="bg-black/30 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-amber-200 border border-white/20">
          CUPÓN: SMART10 (10% OFF)
        </span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Zone */}
          <div
            onClick={() => setActiveTab('menu')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-red-600 to-amber-500 p-0.5 shadow-lg shadow-orange-950/40 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Pizza className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-zinc-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-black text-xl sm:text-2xl tracking-tighter text-white group-hover:text-orange-400 transition-colors">
                  PIZZA<span className="text-orange-500">SMART</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded-full border border-orange-500/30">
                  COP
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 tracking-wide font-sans">
                Pizzería Artesanal & Motor Digital
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md shadow-orange-950/50'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-100' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 bg-orange-500/20 text-orange-300 rounded font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons - Compact, Responsive & Overflow-Safe */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Colorful & High-Visibility User Authentication Button */}
            {!currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-lg shadow-orange-950/40 ring-1 ring-amber-400/50 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                title="Iniciar sesión para guardar tus datos o ingresar como Administrador/Gerente"
              >
                <User className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="whitespace-nowrap">Iniciar Sesión</span>
              </button>
            ) : currentUser.role === 'gerente' ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onToggleAdminView}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                    isAdminPortalActive
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 text-white shadow-purple-950/50 ring-1 ring-purple-400/40'
                      : 'bg-zinc-900 border border-purple-500/50 text-purple-300 hover:bg-zinc-850'
                  }`}
                  title="Alternar entre Carta Cliente y Panel Gerencial"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="hidden sm:inline">
                    {isAdminPortalActive ? 'Ver Carta' : 'Portal Gerencial'}
                  </span>
                </button>

                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-purple-200 bg-purple-950/70 border border-purple-500/40 hover:border-purple-300 transition-colors"
                  title="Perfil Gerente General GERENTE01"
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  <span className="font-mono font-bold">GERENTE01</span>
                </button>
              </div>
            ) : currentUser.role === 'admin' ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onToggleAdminView}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isAdminPortalActive
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950/40'
                      : 'bg-zinc-900 border border-amber-600/50 text-amber-300 hover:bg-zinc-850'
                  }`}
                  title="Alternar entre Carta Cliente y Panel de Administrador"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span className="hidden sm:inline">
                    {isAdminPortalActive ? 'Ver Carta' : 'Portal Admin'}
                  </span>
                </button>

                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-300 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-colors"
                  title="Perfil Administrador ADMIN01"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="font-mono font-bold">ADMIN01</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all shrink-0"
                title="Ver datos guardados para tus pedidos"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="truncate max-w-[80px] sm:max-w-[110px]">{currentUser.name}</span>
                <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 px-1 py-0.2 rounded font-mono hidden md:inline">
                  Cliente
                </span>
              </button>
            )}

            {/* Export Code Modal Button (Hidden on small screens to prevent crowding) */}
            <button
              onClick={onOpenExport}
              className="hidden md:flex relative items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:bg-zinc-800 hover:text-orange-300 transition-all duration-200 shrink-0"
              title="Descargar código ZIP y comandos para GitHub"
            >
              <FolderGit2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="hidden xl:inline">Exportar</span>
              <span className="text-[9px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded font-mono font-bold">
                ZIP
              </span>
            </button>

            {/* Smart Pizzaiolo AI Chat Toggle */}
            <button
              onClick={onToggleChatbot}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0 ${
                isChatOpen
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/60'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-850 hover:border-emerald-500/50'
              }`}
              title="Habla con Gino, Asesor Humano de Servicio al Cliente & Maestro Pizzero"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="hidden sm:inline">Pizzaiolo AI</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-700/50 font-mono hidden sm:inline">
                Smart
              </span>
            </button>

            {/* Cart Trigger Button - Always fully visible, never overflows (shrink-0) */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-95 text-white font-semibold text-xs transition-all duration-200 shadow-lg shadow-orange-950/60 shrink-0 z-10"
              title="Abrir Carrito de Compras"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-bold whitespace-nowrap">
                  {cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}
                </span>
                <span className="text-[10px] text-amber-200 font-mono font-bold whitespace-nowrap">
                  {formatCOP(cartTotal)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-zinc-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold'
                    : 'text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-orange-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
