/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/pizzeria';
import { api } from '../services/api';
import {
  X,
  User,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  LogOut,
  ArrowRight,
  KeyRound,
  Building,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenAdminPortal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOpenAdminPortal,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Register / profile fields for clients
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState('Centro Histórico');
  const [clientEmail, setClientEmail] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Ingresa un usuario o correo electrónico.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.login(username.trim(), password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        toast.success(res.message || `¡Bienvenido ${res.user.name}!`);
        onClose();
      } else {
        setErrorMsg(res.message || 'Credenciales no válidas.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim()) {
      setErrorMsg('Por favor completa nombre, teléfono y dirección de entrega.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const cleanUser = (clientEmail.trim() || clientName.trim().toLowerCase().replace(/\s+/g, '.'));
      const extraData: Partial<UserProfile> = {
        name: clientName.trim(),
        phone: clientPhone.trim(),
        address: clientAddress.trim(),
        neighborhood: clientNeighborhood.trim(),
        email: clientEmail.trim() || `${cleanUser}@pizzasmart.com`,
      };

      const res = await api.login(cleanUser, undefined, extraData);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        toast.success(`¡Datos guardados con éxito para ${res.user.name}! Tus compras serán en 1 clic.`);
        onClose();
      } else {
        setErrorMsg(res.message || 'Error al guardar perfil.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar datos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-click login helpers for testing
  const handleQuickLoginGerente = () => {
    setUsername('GERENTE01');
    setPassword('GERENTE01');
    setErrorMsg(null);
  };

  const handleQuickLoginAdmin = () => {
    setUsername('ADMIN01');
    setPassword('ADMIN01');
    setErrorMsg(null);
  };

  const handleQuickLoginClient = () => {
    setUsername('carlos.gomez');
    setPassword('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col text-zinc-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              currentUser?.role === 'gerente'
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-400'
                : currentUser?.role === 'admin'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                : 'bg-orange-600/20 border-orange-500/30 text-orange-400'
            }`}>
              {currentUser?.role === 'gerente' ? (
                <Crown className="w-5 h-5 text-amber-300" />
              ) : currentUser?.role === 'admin' ? (
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {currentUser ? 'Perfil de Usuario' : 'Identificación de Usuario'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                PIZZASMART Pamplona · Transacciones & Control
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Case 1: User already logged in */}
          {currentUser ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                    Sesión Activa
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      currentUser.role === 'gerente'
                        ? 'bg-purple-950/80 text-purple-200 border-purple-500/60 shadow-sm'
                        : currentUser.role === 'admin'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                    }`}
                  >
                    {currentUser.role === 'gerente'
                      ? '👑 Gerente General (Super-Admin)'
                      : currentUser.role === 'admin'
                      ? '🛡️ Administrador'
                      : '👤 Cliente Frecuente'}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{currentUser.name}</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">Usuario: {currentUser.username}</p>
                </div>

                {currentUser.role === 'gerente' && (
                  <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200">
                    👑 <strong>Permisos de Alta Dirección:</strong> Control total para gestionar personal, asignar roles admin/cliente, auditar historial de órdenes en COP y monitorear actividad del sistema.
                  </div>
                )}

                {currentUser.role === 'client' && (
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-[11px] text-zinc-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{currentUser.address || 'Pamplona, Norte de Santander'}</span>
                    </div>
                    {currentUser.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{currentUser.phone}</span>
                      </div>
                    )}
                    <p className="text-[10px] text-zinc-500 pt-1">
                      ✨ Tus datos se cargan automáticamente en el carrito para ordenar en 1 solo clic.
                    </p>
                  </div>
                )}
              </div>

              {(currentUser.role === 'gerente' || currentUser.role === 'admin') && onOpenAdminPortal && (
                <button
                  onClick={() => {
                    onOpenAdminPortal();
                    onClose();
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    currentUser.role === 'gerente'
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 shadow-purple-950/40'
                      : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-red-950/40'
                  }`}
                >
                  {currentUser.role === 'gerente' ? <Crown className="w-4 h-4 text-amber-300" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{currentUser.role === 'gerente' ? 'Abrir Portal Gerencial & Usuarios' : 'Abrir Portal de Administrador'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  onLogout();
                  toast.info('Sesión cerrada correctamente');
                  onClose();
                }}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-red-400 border border-zinc-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            /* Case 2: Not logged in (Show Tabs) */
            <>
              {/* Tab Selector */}
              <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
                <button
                  onClick={() => {
                    setTab('login');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    tab === 'login'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                    tab === 'register'
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Guardar Datos (Cliente)
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700/60 text-red-300 text-xs animate-in fade-in">
                  {errorMsg}
                </div>
              )}

              {/* Tab 1: Login */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">
                      Usuario o Correo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Ej: ADMIN01 o carlos.gomez"
                        className="w-full pl-9 pr-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-zinc-400 font-bold">Contraseña</label>
                      <span className="text-[10px] text-zinc-500">
                        (Requerida para ADMIN01)
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-950/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{isLoading ? 'Verificando...' : 'Entrar a PIZZASMART'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Discrete Quick Access Helpers */}
                  <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                      Accesos rápidos de prueba (Roles):
                    </span>
                    <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={handleQuickLoginGerente}
                        className="p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-colors flex flex-col group"
                      >
                        <span className="font-bold text-purple-300 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-300 shrink-0" /> GERENTE01
                        </span>
                        <span className="text-[9px] text-purple-400 font-mono mt-0.5">Rol Gerente</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleQuickLoginAdmin}
                        className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-left transition-colors flex flex-col group"
                      >
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" /> ADMIN01
                        </span>
                        <span className="text-[9px] text-amber-400 font-mono mt-0.5">Rol Admin</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleQuickLoginClient}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-left transition-colors flex flex-col group"
                      >
                        <span className="font-bold text-zinc-200 flex items-center gap-1">
                          <User className="w-3 h-3 text-emerald-400 shrink-0" /> Cliente
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono mt-0.5">Carlos G.</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tab 2: Register Client & Save Data */}
              {tab === 'register' && (
                <form onSubmit={handleRegisterClient} className="space-y-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-orange-950/30 border border-orange-500/20 text-orange-200 text-[11px]">
                    ✨ Guarda tus datos de entrega en Pamplona una sola vez para agilizar todas tus futuras pizzas.
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Laura Camila Prada"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-zinc-400 font-bold mb-1">Teléfono Móvil</label>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="315 123 4567"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-1">Barrio Pamplona</label>
                      <input
                        type="text"
                        value={clientNeighborhood}
                        onChange={(e) => setClientNeighborhood(e.target.value)}
                        placeholder="Centro, Los Álamos..."
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">
                      Dirección de Entrega
                    </label>
                    <input
                      type="text"
                      required
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Carrera 6 # 5 - 20, Centro Histórico / Pamplona"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Correo Electrónico (Opcional)</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="laura@example.com"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Guardar Datos y Continuar</span>
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
