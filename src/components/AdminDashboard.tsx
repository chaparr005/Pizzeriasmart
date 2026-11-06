/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  OrderStatus,
  Order,
  CateringQuote,
  MenuCategory,
  UserProfile,
  UserRole,
  UserActivityLog,
  TenantConfig,
} from '../types/pizzeria';
import { api } from '../services/api';
import { formatCOP } from '../utils/format';
import { KitchenDashboard } from './KitchenDashboard';
import { QASuiteView } from './QASuiteView';
import {
  UtensilsCrossed,
  ChefHat,
  Flame,
  LayoutDashboard,
  Pizza,
  TrendingUp,
  DollarSign,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Tag,
  AlertCircle,
  Eye,
  Check,
  Crown,
  UserCheck,
  UserX,
  Activity,
  History,
  Phone,
  MapPin,
  Mail,
  X,
  Globe,
  KeyRound,
  Copy,
  Download,
  ExternalLink,
  Layers,
  Settings2,
  Server,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 'kds' | 'menu' | 'metrics' | 'users' | 'catering' | 'promos' | 'qa' | 'saas';

interface AdminDashboardProps {
  onReturnToClient: () => void;
  currentUser?: UserProfile | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnToClient, currentUser }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>(
    currentUser?.role === 'gerente' ? 'users' : 'kds'
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [quotes, setQuotes] = useState<CateringQuote[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // User management state (Rol Gerente)
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilterRole, setUserFilterRole] = useState<'todas' | 'gerente' | 'admin' | 'client'>('todas');
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<UserProfile | null>(null);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState<{
    username: string;
    name: string;
    role: UserRole;
    phone: string;
    email: string;
    address: string;
    neighborhood: string;
  }>({
    username: '',
    name: '',
    role: 'admin',
    phone: '',
    email: '',
    address: '',
    neighborhood: 'Centro Histórico',
  });

  // Menu management state
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<number>(0);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'colombianas' as MenuCategory,
    price: 35000,
    description: '',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 15,
  });

  // SaaS & Multi-Tenant State
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<any>(null);
  const [isSyncingHub, setIsSyncingHub] = useState(false);
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);
  const [manifestData, setManifestData] = useState<Record<string, any> | null>(null);
  const [isEditingWhiteLabel, setIsEditingWhiteLabel] = useState(false);
  const [whiteLabelForm, setWhiteLabelForm] = useState({
    restaurantName: 'PIZZASMART PAMPLONA',
    slogan: 'Pizzería Artesanal & Horno de Piedra',
    city: 'Pamplona, Norte de Santander',
    phone: '+57 312 456 7890',
    primaryColor: '#ea580c',
    accentColor: '#f59e0b',
    licenseKeyInput: 'PS-PAMPLONA-PRO-2026',
    platformHubUrl: 'https://hub.pizzasmart.cloud/api/v1',
  });

  // Load all admin data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [menuRes, metricsRes, quotesRes, promosRes, usersRes, logsRes, tenantRes, membershipRes] = await Promise.allSettled([
        api.getMenu(),
        api.getAdminMetrics(),
        api.getAdminQuotes(),
        api.getAdminPromos(),
        api.getAdminUsers(),
        api.getAdminActivityLogs(),
        api.getTenantInfo(),
        api.verifyMembership(),
      ]);

      if (menuRes.status === 'fulfilled' && menuRes.value.success) {
        setMenuItems(menuRes.value.items);
      }
      if (metricsRes.status === 'fulfilled' && metricsRes.value.success) {
        setMetrics(metricsRes.value.metrics);
      }
      if (quotesRes.status === 'fulfilled' && quotesRes.value.success) {
        setQuotes(quotesRes.value.quotes);
      }
      if (promosRes.status === 'fulfilled' && promosRes.value.success) {
        setPromos(promosRes.value.promos);
      }
      if (usersRes.status === 'fulfilled' && usersRes.value.success) {
        setUsersList(usersRes.value.users);
      }
      if (logsRes.status === 'fulfilled' && logsRes.value.success) {
        setActivityLogs(logsRes.value.logs);
      }
      if (tenantRes.status === 'fulfilled' && tenantRes.value.success) {
        setTenantConfig(tenantRes.value.tenant);
        setWhiteLabelForm({
          restaurantName: tenantRes.value.tenant.restaurantName || tenantRes.value.tenant.whiteLabel.restaurantName || 'PIZZASMART PAMPLONA',
          slogan: tenantRes.value.tenant.slogan || tenantRes.value.tenant.whiteLabel.slogan || 'Pizzería Artesanal & Horno de Piedra',
          city: tenantRes.value.tenant.city || tenantRes.value.tenant.whiteLabel.city || 'Pamplona, Norte de Santander',
          phone: tenantRes.value.tenant.phone || tenantRes.value.tenant.whiteLabel.phone || '+57 312 456 7890',
          primaryColor: tenantRes.value.tenant.whiteLabel.primaryColor || '#ea580c',
          accentColor: tenantRes.value.tenant.whiteLabel.accentColor || '#f59e0b',
          licenseKeyInput: tenantRes.value.tenant.membership.licenseKey || 'PS-PAMPLONA-PRO-2026',
          platformHubUrl: tenantRes.value.tenant.membership.platformHubUrl || 'https://hub.pizzasmart.cloud/api/v1',
        });
      }
      if (membershipRes.status === 'fulfilled' && membershipRes.value.success) {
        setMembershipStatus(membershipRes.value);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const timer = setInterval(() => {
      // Periodic refresh of metrics and users
      api.getAdminMetrics().then((res) => {
        if (res.success) setMetrics(res.metrics);
      }).catch(() => {});
      api.getAdminUsers().then((res) => {
        if (res.success) setUsersList(res.users);
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Gerente user operations
  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await api.updateAdminUser(userId, { role: newRole });
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        toast.success(`Rol de ${res.user.name} actualizado a ${newRole.toUpperCase()}`);
        api.getAdminActivityLogs().then((l) => { if (l.success) setActivityLogs(l.logs); });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar rol del usuario');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'suspendido' ? 'activo' : 'suspendido';
    try {
      const res = await api.updateAdminUser(userId, { status: nextStatus });
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
        );
        toast.success(`Estado de ${res.user.name} cambiado a ${nextStatus.toUpperCase()}`);
        api.getAdminActivityLogs().then((l) => { if (l.success) setActivityLogs(l.logs); });
      }
    } catch (err: any) {
      toast.error('Error al cambiar estado del usuario');
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${name}"?`)) {
      return;
    }
    try {
      const res = await api.deleteAdminUser(userId);
      if (res.success) {
        setUsersList((prev) => prev.filter((u) => u.id !== userId));
        toast.success(`Usuario ${name} eliminado del sistema`);
        api.getAdminActivityLogs().then((l) => { if (l.success) setActivityLogs(l.logs); });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar usuario');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name.trim() || !newUserData.username.trim()) {
      toast.error('Nombre y usuario son obligatorios');
      return;
    }

    try {
      const res = await api.createAdminUser(newUserData);
      if (res.success) {
        setUsersList((prev) => [res.user, ...prev]);
        toast.success(`Usuario ${res.user.name} (${res.user.role}) creado con éxito`);
        setIsNewUserModalOpen(false);
        setNewUserData({
          username: '',
          name: '',
          role: 'admin',
          phone: '',
          email: '',
          address: '',
          neighborhood: 'Centro Histórico',
        });
        api.getAdminActivityLogs().then((l) => { if (l.success) setActivityLogs(l.logs); });
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al crear usuario');
    }
  };

  // Menu operations
  const handleToggleAvailability = async (id: string, currentName: string) => {
    try {
      const res = await api.toggleMenuItem(id);
      if (res.success) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
        );
        const newState = !res.item.isAvailable ? 'Agotado' : 'Disponible';
        toast.success(`Producto "${currentName}" marcado como ${newState}`);
      }
    } catch (err: any) {
      toast.error('Error al actualizar disponibilidad');
    }
  };

  const handleSavePrice = async (id: string) => {
    if (!editPriceInput || editPriceInput <= 0) {
      toast.error('Ingresa un precio válido en COP');
      return;
    }
    try {
      const res = await api.updateMenuItem(id, { price: editPriceInput });
      if (res.success) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, price: editPriceInput } : item))
        );
        setEditingItemId(null);
        toast.success(`Precio actualizado a ${formatCOP(editPriceInput)} COP`);
      }
    } catch (err) {
      toast.error('Error al guardar el nuevo precio');
    }
  };

  const handleCreateNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemData.name.trim()) {
      toast.error('Ingresa el nombre del producto');
      return;
    }
    try {
      const payload: Partial<MenuItem> = {
        name: newItemData.name,
        italianName: newItemData.name,
        category: newItemData.category,
        description: newItemData.description || 'Especialidad recién horneada en horno de piedra.',
        price: Number(newItemData.price),
        image: newItemData.image,
        tags: ['Pamplona', 'Nuevo'],
        prepTimeMin: Number(newItemData.prepTimeMin),
        rating: 5.0,
        reviewsCount: 1,
        isAvailable: true,
      };

      const res = await api.addMenuItem(payload);
      if (res.success) {
        setMenuItems((prev) => [res.item, ...prev]);
        setIsNewItemModalOpen(false);
        setNewItemData({
          name: '',
          category: 'colombianas',
          price: 35000,
          description: '',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
          prepTimeMin: 15,
        });
        toast.success(`¡"${res.item.name}" agregado a la carta!`);
      }
    } catch (err) {
      toast.error('Error al crear producto');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar "${name}" de la carta?`)) return;
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        setMenuItems((prev) => prev.filter((it) => it.id !== id));
        toast.success(`Producto "${name}" eliminado`);
      }
    } catch (err) {
      toast.error('Error al eliminar producto');
    }
  };

  // SaaS Multi-Tenant Handlers
  const handleSaveTenantWhiteLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateTenantConfig({
        restaurantName: whiteLabelForm.restaurantName,
        slogan: whiteLabelForm.slogan,
        city: whiteLabelForm.city,
        phone: whiteLabelForm.phone,
        whiteLabel: {
          ...tenantConfig?.whiteLabel,
          restaurantName: whiteLabelForm.restaurantName,
          slogan: whiteLabelForm.slogan,
          city: whiteLabelForm.city,
          phone: whiteLabelForm.phone,
          primaryColor: whiteLabelForm.primaryColor,
          accentColor: whiteLabelForm.accentColor,
          enabledFeatures: tenantConfig?.whiteLabel?.enabledFeatures || {
            kds: true,
            cateringQuotes: true,
            customBuilder: true,
            aiAssistant: true,
            smsNotifications: true,
          },
        },
        membership: {
          ...tenantConfig?.membership,
          licenseKey: whiteLabelForm.licenseKeyInput,
          platformHubUrl: whiteLabelForm.platformHubUrl,
        } as any,
      });
      if (res.success) {
        setTenantConfig(res.tenant);
        setIsEditingWhiteLabel(false);
        toast.success('¡Configuración de franquicia y marca blanca guardada!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar configuración de franquicia');
    }
  };

  const handleTestPlatformSync = async () => {
    setIsSyncingHub(true);
    try {
      const res = await api.syncPlatformHub(whiteLabelForm.platformHubUrl);
      if (res.success) {
        toast.success(`¡Sincronización exitosa con Hub SaaS! (Eventos: ${res.eventsSyncedCount})`);
        const info = await api.getTenantInfo();
        if (info.success) setTenantConfig(info.tenant);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error en sincronización con plataforma SaaS');
    } finally {
      setIsSyncingHub(false);
    }
  };

  const handleVerifyLicense = async () => {
    setIsVerifyingLicense(true);
    try {
      const res = await api.verifyMembership(whiteLabelForm.licenseKeyInput);
      if (res.success) {
        setMembershipStatus(res);
        if (res.valid) {
          toast.success(res.message);
        } else {
          toast.warning(res.message);
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al validar licencia con plataforma central');
    } finally {
      setIsVerifyingLicense(false);
    }
  };

  const handleLoadManifest = async () => {
    try {
      const manifest = await api.getSaaSManifest();
      setManifestData(manifest);
      toast.info('Manifiesto de conexión SaaS generado.');
    } catch (err: any) {
      toast.error('Error al obtener manifiesto SaaS');
    }
  };

  const handleCopyManifest = async () => {
    try {
      const manifest = manifestData || (await api.getSaaSManifest());
      setManifestData(manifest);
      await navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      toast.success('¡Manifiesto JSON copiado al portapapeles!');
    } catch (err) {
      toast.error('No se pudo copiar el manifiesto');
    }
  };

  const handleDownloadManifest = async () => {
    try {
      const manifest = manifestData || (await api.getSaaSManifest());
      setManifestData(manifest);
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pizzasmart-tenant-${manifest.tenant?.tenantId || 'node'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Manifiesto JSON descargado');
    } catch (err) {
      toast.error('Error al descargar manifiesto');
    }
  };

  // Filtered menu
  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedCategory !== 'todas' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      {/* Top Admin Notice Bar */}
      <div className={`border-b px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 ${
        currentUser?.role === 'gerente'
          ? 'bg-gradient-to-r from-purple-950 via-zinc-900 to-indigo-950 border-purple-800/40'
          : 'bg-gradient-to-r from-red-950 via-zinc-900 to-amber-950 border-red-800/40'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
            currentUser?.role === 'gerente' ? 'bg-purple-400' : 'bg-amber-400'
          }`}></span>
          <span className="font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
            {currentUser?.role === 'gerente' ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-purple-200">Portal Gerencial & Alta Dirección · Sesión: GERENTE01</span>
              </>
            ) : (
              <span className="text-amber-200">Portal Administrador · Sesión: ADMIN01</span>
            )}
          </span>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            Local Pamplona: Abierto (9:00 AM - 11:30 PM) · Horno a 450°C
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={onReturnToClient}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[11px] transition-all shadow-md shadow-orange-950/40"
          >
            <Pizza className="w-3.5 h-3.5" />
            <span>Ver como Cliente</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-zinc-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                Control Operativo & Carta
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Administración de cocina en vivo, precios en pesos colombianos (COP), stock y eventos.
            </p>
          </div>

          {/* Quick Metrics Pill */}
          {metrics && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
              <div className="px-3 py-1 border-r border-zinc-800">
                <span className="text-[10px] uppercase text-zinc-500 block font-bold">Ventas Hoy</span>
                <span className="text-sm font-mono font-black text-emerald-400">
                  {formatCOP(metrics.totalSales)}
                </span>
              </div>
              <div className="px-3 py-1 border-r border-zinc-800">
                <span className="text-[10px] uppercase text-zinc-500 block font-bold">Órdenes</span>
                <span className="text-sm font-bold text-white">{metrics.totalOrders}</span>
              </div>
              <div className="px-3 py-1">
                <span className="text-[10px] uppercase text-zinc-500 block font-bold">Ticket Prom.</span>
                <span className="text-sm font-mono font-bold text-amber-300">
                  {formatCOP(metrics.avgTicket)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Admin Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-4 border-b border-zinc-800 no-scrollbar">
          {[
            { id: 'users' as AdminTab, label: 'Personal & Usuarios', icon: Users, count: usersList.length, badge: currentUser?.role === 'gerente' ? 'Gerente' : undefined },
            { id: 'kds' as AdminTab, label: 'Comandas KDS Cocina', icon: UtensilsCrossed, count: metrics?.activeOrders },
            { id: 'menu' as AdminTab, label: 'Carta e Inventario COP', icon: Pizza, count: menuItems.length },
            { id: 'metrics' as AdminTab, label: 'Ventas & Métricas', icon: TrendingUp },
            { id: 'catering' as AdminTab, label: 'Solicitudes Catering', icon: Calendar, count: quotes.length },
            { id: 'promos' as AdminTab, label: 'Cupones & Promos', icon: Tag, count: promos.length },
            { id: 'saas' as AdminTab, label: 'Membresía & Red SaaS', icon: Globe, badge: 'Multi-Tenant' },
            { id: 'qa' as AdminTab, label: 'Suite QA & Diagnóstico', icon: ShieldCheck, badge: 'Tests' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-950/60'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-850'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-100' : 'text-orange-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-zinc-800 text-orange-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[9px] uppercase px-1.5 py-0.2 bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded font-mono font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content: Personal & Gestión de Usuarios (Rol Gerente / Super-Admin) */}
        {activeAdminTab === 'users' && (
          <div className="pt-6 space-y-6 animate-in fade-in duration-200">
            {/* Gerente Headline & Super-Admin Capabilities */}
            <div className="bg-gradient-to-r from-purple-950/60 via-zinc-900 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40 mb-2">
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Módulo de Control de Alta Dirección · Rol Gerente</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Gestión de Personal, Administradores & Clientes
                </h2>
                <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
                  Como Gerente tienes autoridad para crear, modificar roles, suspender o dar de baja cuentas, auditar el historial de compras en COP y supervisar toda la actividad en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => setShowActivityLogModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-purple-200 border border-purple-500/30 text-xs font-bold shadow transition-colors"
                >
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>Historial de Auditoría ({activityLogs.length})</span>
                </button>

                <button
                  onClick={() => setIsNewUserModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Usuario / Admin</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Usuarios</span>
                  <span className="text-xl font-mono font-black text-white">{usersList.length}</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Admins & Gerencia</span>
                  <span className="text-xl font-mono font-black text-amber-300">
                    {usersList.filter((u) => u.role === 'admin' || u.role === 'gerente').length}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Clientes Pamplona</span>
                  <span className="text-xl font-mono font-black text-emerald-400">
                    {usersList.filter((u) => u.role === 'client').length}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Facturación Acumulada</span>
                  <span className="text-sm sm:text-base font-mono font-black text-orange-400">
                    {formatCOP(usersList.reduce((acc, u) => acc + (u.totalSpentCOP || 0), 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, usuario, teléfono o barrio..."
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Role Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'todas', label: 'Todos' },
                  { id: 'gerente', label: '👑 Gerentes' },
                  { id: 'admin', label: '🛡️ Administradores' },
                  { id: 'client', label: '👤 Clientes' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setUserFilterRole(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      userFilterRole === item.id
                        ? 'bg-purple-600 text-white font-bold'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Data Table */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase font-bold text-zinc-400">
                    <tr>
                      <th className="py-3 px-4">Usuario & Nombre</th>
                      <th className="py-3 px-4">Rol Asignado</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Contacto & Ubicación</th>
                      <th className="py-3 px-4">Historial de Compras</th>
                      <th className="py-3 px-4 text-right">Acciones Gerenciales</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {usersList
                      .filter((u) => {
                        if (userFilterRole !== 'todas' && u.role !== userFilterRole) return false;
                        if (userSearchQuery.trim() !== '') {
                          const q = userSearchQuery.toLowerCase().trim();
                          return (
                            u.name.toLowerCase().includes(q) ||
                            u.username.toLowerCase().includes(q) ||
                            (u.phone && u.phone.includes(q)) ||
                            (u.neighborhood && u.neighborhood.toLowerCase().includes(q))
                          );
                        }
                        return true;
                      })
                      .map((u) => {
                        const isSelfGerente = u.username.toUpperCase() === 'GERENTE01';
                        return (
                          <tr key={u.id} className="hover:bg-zinc-850/60 transition-colors">
                            {/* User details */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                  u.role === 'gerente'
                                    ? 'bg-purple-600 text-white ring-2 ring-purple-400/40'
                                    : u.role === 'admin'
                                    ? 'bg-amber-600 text-white ring-2 ring-amber-400/40'
                                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                }`}>
                                  {u.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    <span>{u.name}</span>
                                    {isSelfGerente && (
                                      <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-500/40 px-1 rounded font-mono font-bold">
                                        ROOT
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] font-mono text-zinc-400">@{u.username}</span>
                                </div>
                              </div>
                            </td>

                            {/* Role Badge */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border ${
                                u.role === 'gerente'
                                  ? 'bg-purple-950/80 text-purple-200 border-purple-500/50 shadow-sm'
                                  : u.role === 'admin'
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/50'
                                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                              }`}>
                                {u.role === 'gerente' ? (
                                  <>
                                    <Crown className="w-3 h-3 text-amber-300" />
                                    <span>Gerente General</span>
                                  </>
                                ) : u.role === 'admin' ? (
                                  <>
                                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                                    <span>Administrador</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-3 h-3 text-emerald-400" />
                                    <span>Cliente</span>
                                  </>
                                )}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => !isSelfGerente && handleToggleUserStatus(u.id, u.status)}
                                disabled={isSelfGerente}
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                  u.status === 'suspendido'
                                    ? 'bg-red-950 text-red-300 border-red-700/60 hover:bg-red-900/60'
                                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
                                } ${isSelfGerente ? 'cursor-default' : 'cursor-pointer'}`}
                                title={isSelfGerente ? 'No se puede suspender al Gerente Principal' : 'Clic para alternar estado'}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'suspendido' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                                <span className="capitalize">{u.status || 'activo'}</span>
                              </button>
                            </td>

                            {/* Contact & Location */}
                            <td className="py-3.5 px-4 text-zinc-300 space-y-0.5 text-[11px]">
                              {u.phone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-zinc-500" />
                                  <span>{u.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                                <MapPin className="w-3 h-3 text-zinc-500" />
                                <span className="truncate max-w-[140px]">{u.neighborhood || 'Pamplona'}, {u.city || 'Pamplona'}</span>
                              </div>
                            </td>

                            {/* Transactions & Orders */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-0.5">
                                <span className="font-mono font-bold text-orange-400 block">
                                  {formatCOP(u.totalSpentCOP || 0)}
                                </span>
                                <span className="text-[10px] text-zinc-400 block font-mono">
                                  {u.lastOrderCount || 0} pedidos registrados
                                </span>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {/* Role toggle button */}
                                {!isSelfGerente && (
                                  u.role === 'client' ? (
                                    <button
                                      onClick={() => handleUpdateUserRole(u.id, 'admin')}
                                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-600/40 text-[11px] font-bold transition-colors"
                                      title="Promover a Administrador"
                                    >
                                      Hacer Admin
                                    </button>
                                  ) : u.role === 'admin' ? (
                                    <button
                                      onClick={() => handleUpdateUserRole(u.id, 'client')}
                                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-[11px] font-medium transition-colors"
                                      title="Remover permisos de admin y pasar a cliente"
                                    >
                                      Hacer Cliente
                                    </button>
                                  ) : null
                                )}

                                {/* View User History Button */}
                                <button
                                  onClick={() => setSelectedUserForHistory(u)}
                                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                                  title="Ver expediente e historial de transacciones"
                                >
                                  <History className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete User Button */}
                                {!isSelfGerente && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-800/40 transition-colors"
                                    title="Eliminar usuario del sistema"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal: Activity Audit Logs */}
            {showActivityLogModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col text-zinc-100 max-h-[85vh]">
                  <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Registro de Actividad & Auditoría</h3>
                        <p className="text-[11px] text-zinc-400">Historial cronológico de acciones gerenciales, administrativas y de clientes</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowActivityLogModal(false)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-zinc-800/60 text-xs">
                    {activityLogs.length === 0 ? (
                      <p className="text-zinc-500 text-center py-6">No hay registros de actividad aún.</p>
                    ) : (
                      activityLogs.map((log) => (
                        <div key={log.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{log.action}</span>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                log.role === 'gerente'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                  : log.role === 'admin'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              }`}>
                                {log.username}
                              </span>
                            </div>
                            {log.details && (
                              <p className="text-[11px] text-zinc-300">{log.details}</p>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modal: User Transaction History & Profile */}
            {selectedUserForHistory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col text-zinc-100">
                  <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center">
                        <History className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Expediente de Usuario</h3>
                        <p className="text-[11px] text-zinc-400 font-mono">@{selectedUserForHistory.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedUserForHistory(null)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-zinc-900 p-3.5 rounded-2xl border border-zinc-800">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Nombre Completo</span>
                        <span className="font-bold text-white text-sm">{selectedUserForHistory.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Rol Actual</span>
                        <span className="font-bold text-amber-300 capitalize">{selectedUserForHistory.role}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Gasto Total Acumulado</span>
                        <span className="font-mono font-bold text-orange-400 text-sm">
                          {formatCOP(selectedUserForHistory.totalSpentCOP || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold block">Órdenes Realizadas</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {selectedUserForHistory.lastOrderCount || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800 text-[11px]">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedUserForHistory.phone || 'No registrado'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Mail className="w-3.5 h-3.5 text-orange-400" />
                        <span>{selectedUserForHistory.email || 'No registrado'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{selectedUserForHistory.address || 'Pamplona, Norte de Santander'}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedUserForHistory(null)}
                        className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 font-bold text-white transition-colors"
                      >
                        Cerrar Expediente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: Create New User / Admin */}
            {isNewUserModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col text-zinc-100">
                  <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Registrar Nuevo Usuario / Admin</h3>
                        <p className="text-[11px] text-zinc-400">Creación manual de cuenta desde Gerencia</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNewUserModalOpen(false)}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="p-5 space-y-3.5 text-xs">
                    <div>
                      <label className="block text-zinc-400 font-bold mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={newUserData.name}
                        onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                        placeholder="Ej: Laura Camila Jaimes"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-zinc-400 font-bold mb-1">Nombre de Usuario</label>
                        <input
                          type="text"
                          required
                          value={newUserData.username}
                          onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                          placeholder="Ej: laura.jaimes"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-bold mb-1">Rol a Asignar</label>
                        <select
                          value={newUserData.role}
                          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="admin">🛡️ Administrador</option>
                          <option value="client">👤 Cliente</option>
                          <option value="gerente">👑 Gerente</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-zinc-400 font-bold mb-1">Teléfono</label>
                        <input
                          type="tel"
                          value={newUserData.phone}
                          onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                          placeholder="+57 312 000 0000"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 font-bold mb-1">Barrio Pamplona</label>
                        <input
                          type="text"
                          value={newUserData.neighborhood}
                          onChange={(e) => setNewUserData({ ...newUserData, neighborhood: e.target.value })}
                          placeholder="Centro, El Buque..."
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-bold mb-1">Dirección de Entrega</label>
                      <input
                        type="text"
                        value={newUserData.address}
                        onChange={(e) => setNewUserData({ ...newUserData, address: e.target.value })}
                        placeholder="Carrera 5 # 4 - 32, Pamplona"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                      <button
                        type="button"
                        onClick={() => setIsNewUserModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-950/40"
                      >
                        Crear Cuenta
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 1: KDS Cocina */}
        {activeAdminTab === 'kds' && (
          <div className="pt-6">
            <KitchenDashboard />
          </div>
        )}

        {/* Tab Content 2: Menú e Inventario */}
        {activeAdminTab === 'menu' && (
          <div className="pt-6 space-y-6">
            {/* Control Bar: Filters, Search & Add Product */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <div className="flex flex-1 items-center gap-3 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar producto por nombre o ingrediente..."
                    className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Categories Filter */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'todas', label: 'Todas' },
                    { id: 'colombianas', label: '🇨🇴 Colombianas' },
                    { id: 'clasicas', label: 'Clásicas' },
                    { id: 'gourmet', label: 'Gourmet' },
                    { id: 'bebidas', label: 'Bebidas' },
                    { id: 'postres', label: 'Postres' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-orange-600 text-white font-bold'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Add New Product Button */}
                <button
                  onClick={() => setIsNewItemModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Product List Table / Grid */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Precio (COP)</th>
                      <th className="py-3 px-4">Disponibilidad</th>
                      <th className="py-3 px-4">Tiempo</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredMenuItems.map((item) => {
                      const isEditing = editingItemId === item.id;
                      const isAvailable = item.isAvailable !== false;

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-zinc-850/60 transition-colors ${
                            !isAvailable ? 'opacity-60 bg-zinc-950/40' : ''
                          }`}
                        >
                          {/* Image & Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                  {item.category === 'colombianas' && (
                                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">
                                      🇨🇴 Colombia
                                    </span>
                                  )}
                                  {item.category === 'bebidas' && (
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">
                                      🥤 Bebida
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-xs">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="capitalize px-2 py-1 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                              {item.category}
                            </span>
                          </td>

                          {/* Price in COP (with inline edit) */}
                          <td className="py-3 px-4 font-mono">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  value={editPriceInput}
                                  onChange={(e) => setEditPriceInput(Number(e.target.value))}
                                  className="w-24 px-2 py-1 bg-zinc-950 border border-orange-500 rounded text-xs text-white"
                                  step="1000"
                                />
                                <button
                                  onClick={() => handleSavePrice(item.id)}
                                  className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                                  title="Guardar precio"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingItemId(null)}
                                  className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                                  title="Cancelar"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {formatCOP(item.price)}
                                </span>
                                <button
                                  onClick={() => {
                                    setEditingItemId(item.id);
                                    setEditPriceInput(item.price);
                                  }}
                                  className="text-zinc-500 hover:text-orange-400 transition-colors p-1"
                                  title="Editar precio"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Availability Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleAvailability(item.id, item.name)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                isAvailable
                                  ? 'bg-emerald-950 border border-emerald-600 text-emerald-400 hover:bg-emerald-900'
                                  : 'bg-red-950 border border-red-700 text-red-400 hover:bg-red-900'
                              }`}
                            >
                              {isAvailable ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Disponible</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-red-400" />
                                  <span>Agotado Hoy</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Prep Time */}
                          <td className="py-3 px-4 text-zinc-400 font-mono">
                            {item.prepTimeMin} min
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Eliminar de carta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Métricas y Ventas */}
        {activeAdminTab === 'metrics' && metrics && (
          <div className="pt-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">
                  Facturación Total Hoy
                </span>
                <div className="text-2xl font-mono font-black text-emerald-400 mt-2">
                  {formatCOP(metrics.totalSales)}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Pesos Colombianos (COP)
                </span>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">
                  Ticket Promedio
                </span>
                <div className="text-2xl font-mono font-black text-amber-300 mt-2">
                  {formatCOP(metrics.avgTicket)}
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  Por comanda procesada
                </span>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">
                  Órdenes Activas
                </span>
                <div className="text-2xl font-bold text-orange-400 mt-2">
                  {metrics.activeOrders} en proceso
                </div>
                <span className="text-[11px] text-zinc-400 mt-1 block">
                  {metrics.inOvenCount} en horno de leña a 450°C
                </span>
              </div>

              <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
                <span className="text-xs uppercase text-zinc-500 font-bold tracking-wider">
                  Entregas Exitosas
                </span>
                <div className="text-2xl font-bold text-white mt-2">
                  {metrics.deliveredCount} entregadas
                </div>
                <span className="text-[11px] text-emerald-400 mt-1 block">
                  100% a tiempo en Pamplona
                </span>
              </div>
            </div>

            {/* Top Selling Pizzas Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>Pizzas & Bebidas Más Vendidas en Pamplona</span>
                </h3>

                <div className="space-y-4">
                  {metrics.topSelling && metrics.topSelling.length > 0 ? (
                    metrics.topSelling.map((it: any, idx: number) => {
                      const maxCount = metrics.topSelling[0]?.count || 1;
                      const pct = Math.round((it.count / maxCount) * 100);

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-zinc-800 text-orange-400 flex items-center justify-center text-[10px] font-mono">
                                {idx + 1}
                              </span>
                              {it.name}
                            </span>
                            <div className="font-mono text-right">
                              <span className="text-orange-400 font-bold">{it.count} uds.</span>
                              <span className="text-zinc-500 text-[10px] ml-2">
                                ({formatCOP(it.totalRev)})
                              </span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-zinc-950 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-zinc-500 text-xs">No hay datos de ventas aún.</p>
                  )}
                </div>
              </div>

              {/* Operational Status Box */}
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Salud del Sistema & Logística Pamplona</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Temperatura de Horno</span>
                      <span className="text-zinc-400 text-[11px]">Piedra volcánica refractaria</span>
                    </div>
                    <span className="font-mono font-bold text-red-400 text-sm">450 °C (Óptima)</span>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Tiempo Medio de Despacho</span>
                      <span className="text-zinc-400 text-[11px]">Desde comanda a mochila repartidor</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">18 minutos</span>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Radio de Domicilios</span>
                      <span className="text-zinc-400 text-[11px]">Pamplona Centro, U. Pamplona, Álamos</span>
                    </div>
                    <span className="font-mono font-bold text-blue-400 text-sm">Tarifa base $5.000 COP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Cotizaciones de Catering */}
        {activeAdminTab === 'catering' && (
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Solicitudes de Eventos & Catering</h3>
                <p className="text-xs text-zinc-400">
                  Cotizaciones generadas por clientes para matrimonios, grados y eventos corporativos en Pamplona.
                </p>
              </div>
              <span className="text-xs bg-orange-950 text-orange-300 px-3 py-1 rounded-full border border-orange-500/30 font-bold">
                {quotes.length} Cotizaciones
              </span>
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-500 text-xs">
                No hay cotizaciones pendientes en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-4 hover:border-orange-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-orange-400">
                          #{quote.id}
                        </span>
                        <h4 className="font-bold text-white text-sm capitalize">
                          Evento: {quote.request?.eventType || 'Evento Especial'}
                        </h4>
                      </div>
                      <span className="text-sm font-mono font-black text-emerald-400">
                        {formatCOP(quote.finalTotal)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-zinc-950 rounded-lg">
                        <span className="text-[10px] text-zinc-500 block">Invitados</span>
                        <span className="font-bold text-white">{quote.totalGuests} personas</span>
                      </div>
                      <div className="p-2 bg-zinc-950 rounded-lg">
                        <span className="text-[10px] text-zinc-500 block">Pizzas Est.</span>
                        <span className="font-bold text-amber-300">{quote.estimatedPizzasNeeded} Fam.</span>
                      </div>
                      <div className="p-2 bg-zinc-950 rounded-lg">
                        <span className="text-[10px] text-zinc-500 block">Costo / Persona</span>
                        <span className="font-bold text-emerald-400">{formatCOP(quote.costPerGuest)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1">
                      <div>
                        <span className="text-zinc-500">Servicio:</span>{' '}
                        <span className="text-white font-medium capitalize">
                          {(quote.request?.serviceType || 'delivery_termico').replace(/_/g, ' ')}
                        </span>
                      </div>
                      {quote.request?.contactPhone && (
                        <div>
                          <span className="text-zinc-500">Contacto:</span>{' '}
                          <span className="text-orange-400 font-mono font-bold">
                            {quote.request.contactPhone} ({quote.request.contactName || 'Cliente'})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                      <button
                        onClick={() =>
                          toast.success(`Contactando al organizador del evento #${quote.id}`)
                        }
                        className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs transition-colors text-center"
                      >
                        Contactar Organizador
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 5: Cupones y Promos */}
        {activeAdminTab === 'promos' && (
          <div className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Cupones Activos en Pamplona</h3>
              <p className="text-xs text-zinc-400">
                Descuentos directos en COP o porcentajes automáticos en el checkout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {promos.map((promo, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-lg text-amber-300 bg-black/40 px-3 py-1 rounded-xl border border-amber-500/30">
                      {promo.code}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-600/50">
                      {promo.discountPercent ? `${promo.discountPercent}% OFF` : `${formatCOP(promo.discountFixed)} OFF`}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300">{promo.description}</p>

                  <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
                    Pedido mínimo: <strong className="text-zinc-300 font-mono">{formatCOP(promo.minSubtotal)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Red SaaS & Membresía Multi-Tenant */}
        {activeAdminTab === 'saas' && (
          <div className="pt-6 space-y-6 animate-in fade-in">
            {/* Header with Title and Global Sync */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 p-6 rounded-3xl border border-indigo-900/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Plataforma SaaS & Membresía de Franquicia
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Nodo Conectado
                  </span>
                </div>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Este restaurante opera como un nodo independiente 100% compatible con tu futura plataforma de suscripciones/membresías SaaS. Permite vincular múltiples pizzerías, controlar licencias y habilitar marca blanca por cliente.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTestPlatformSync}
                  disabled={isSyncingHub}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingHub ? 'animate-spin' : ''}`} />
                  <span>{isSyncingHub ? 'Sincronizando...' : 'Probar Sincronización en Vivo'}</span>
                </button>

                <button
                  onClick={handleCopyManifest}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors border border-zinc-700"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copiar Manifiesto JSON</span>
                </button>
              </div>
            </div>

            {/* Top KPI Cards for Membership & Node Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Plan de Membresía</span>
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-black text-amber-400 uppercase tracking-tight">
                  {tenantConfig?.membership.plan || 'PRO / EMPRESARIAL'}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>{membershipStatus?.daysRemaining || 358} días restantes de licencia</span>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Identificador del Nodo (Tenant)</span>
                  <Server className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-lg font-mono font-bold text-white truncate">
                  {tenantConfig?.tenantId || 'pizzasmart-pamplona-01'}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Ciudad: <strong className="text-zinc-200">{tenantConfig?.city || tenantConfig?.whiteLabel?.city || 'Pamplona'}</strong>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Cuota Mensual de Pedidos</span>
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-mono font-black text-emerald-400">
                  {metrics?.totalOrders || 4} / {tenantConfig?.membership.maxMonthlyOrders || 5000}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Consumo: <strong>{(((metrics?.totalOrders || 4) / (tenantConfig?.membership.maxMonthlyOrders || 5000)) * 100).toFixed(1)}%</strong> de la cuota
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Última Sincronización Hub</span>
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs font-mono font-bold text-purple-300 truncate">
                  {tenantConfig?.lastSyncTimestamp ? new Date(tenantConfig.lastSyncTimestamp).toLocaleTimeString('es-CO') : 'Hace un momento'}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Heartbeat Activo (COP)</span>
                </div>
              </div>
            </div>

            {/* Split layout: White-Label Configurator vs Central Platform Linking */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* White-Label Editor (Left 7 Cols) */}
              <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-orange-400" />
                      <span>Personalización Marca Blanca (White-Label)</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Configura el branding de cada pizzería que adquiera la membresía en tu plataforma.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveTenantWhiteLabel} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-bold mb-1">Nombre Comercial del Restaurante</label>
                      <input
                        type="text"
                        required
                        value={whiteLabelForm.restaurantName}
                        onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, restaurantName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold mb-1">Ciudad / Municipio Colombiano</label>
                      <input
                        type="text"
                        required
                        value={whiteLabelForm.city}
                        onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Slogan o Lema Comercial</label>
                    <input
                      type="text"
                      value={whiteLabelForm.slogan}
                      onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, slogan: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-300 font-bold mb-1">Teléfono WhatsApp de Pedidos</label>
                      <input
                        type="text"
                        value={whiteLabelForm.phone}
                        onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-zinc-300 font-bold mb-1">Color Primario</label>
                        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl">
                          <input
                            type="color"
                            value={whiteLabelForm.primaryColor}
                            onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, primaryColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[11px] text-zinc-300">{whiteLabelForm.primaryColor}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-300 font-bold mb-1">Color Acento</label>
                        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl">
                          <input
                            type="color"
                            value={whiteLabelForm.accentColor}
                            onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, accentColor: e.target.value })}
                            className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[11px] text-zinc-300">{whiteLabelForm.accentColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Preview Badge */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-sm"
                        style={{ backgroundColor: whiteLabelForm.primaryColor }}
                      >
                        PS
                      </div>
                      <div>
                        <div className="font-black text-white">{whiteLabelForm.restaurantName}</div>
                        <div className="text-[11px] text-zinc-400">{whiteLabelForm.slogan} • {whiteLabelForm.city}</div>
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow"
                      style={{ backgroundColor: whiteLabelForm.accentColor }}
                    >
                      Previsualización Marca
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-all shadow-lg shadow-orange-950/50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Guardar Cambios de Marca Blanca</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Central Platform Linking & License Management (Right 5 Cols) */}
              <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-5">
                <div className="pb-3 border-b border-zinc-800">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Control de Licencia & Hub SaaS</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Vinculación directa con el servidor central de membresías.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Licencia Activa del Restaurante</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={whiteLabelForm.licenseKeyInput}
                        onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, licenseKeyInput: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-amber-300 font-mono font-bold focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyLicense}
                        disabled={isVerifyingLicense}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all disabled:opacity-50 shrink-0"
                      >
                        {isVerifyingLicense ? '...' : 'Verificar'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">URL Endpoint del Hub Central SaaS</label>
                    <input
                      type="url"
                      value={whiteLabelForm.platformHubUrl}
                      onChange={(e) => setWhiteLabelForm({ ...whiteLabelForm, platformHubUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-[11px] focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Verification Status Card */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 font-bold">Estado de Licencia:</span>
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {membershipStatus?.valid ? 'VÁLIDA & ACTIVA' : 'PENDIENTE'}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 leading-relaxed">
                      {membershipStatus?.message || `Membresía PRO activa. Licencia válida por ${membershipStatus?.daysRemaining || 358} días.`}
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>Moneda Oficial: <strong>COP (Pesos Colombianos)</strong></span>
                      <span>Soporte: <strong>Prioritario 24/7</strong></span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadManifest}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ver Manifiesto de Nodo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadManifest}
                      className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold transition-colors border border-indigo-500/40"
                      title="Descargar archivo JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar JSON</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Connection Manifest & API Endpoints for the Central Platform */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-zinc-800">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Endpoints REST de Integración para el Proyecto SaaS Padre</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tu proyecto central de membresías puede vincular, monitorear y sincronizar este restaurante mediante las siguientes rutas:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyManifest}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copiar JSON</span>
                  </button>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/60 text-zinc-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-4 py-2.5 rounded-l-xl">Método</th>
                      <th className="px-4 py-2.5">Endpoint del Nodo</th>
                      <th className="px-4 py-2.5">Propósito en la Plataforma SaaS</th>
                      <th className="px-4 py-2.5 rounded-r-xl">Respuesta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">GET</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-300">/api/membership/health</td>
                      <td className="px-4 py-2.5 text-zinc-400">Heartbeat en vivo, estado de licencia, uptime y ventas</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-[11px]">&#123; status: &quot;healthy&quot;, daysRemaining... &#125;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-bold text-amber-400">POST</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-300">/api/membership/verify</td>
                      <td className="px-4 py-2.5 text-zinc-400">Validación de licencia y cuotas desde el portal central</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-[11px]">&#123; valid: true, plan: &quot;pro&quot; &#125;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-bold text-indigo-400">POST</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-300">/api/membership/sync</td>
                      <td className="px-4 py-2.5 text-zinc-400">Sincronización remota de eventos, métricas y catálogo</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-[11px]">&#123; success: true, syncedAt... &#125;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">GET</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-300">/api/membership/manifest</td>
                      <td className="px-4 py-2.5 text-zinc-400">Manifiesto completo de auto-descubrimiento para el SaaS</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-[11px]">&#123; manifestVersion: &quot;1.0.0&quot;... &#125;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">GET</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-300">/api/menu</td>
                      <td className="px-4 py-2.5 text-zinc-400">Consulta de menú y precios en pesos colombianos</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-[11px]">&#123; currency: &quot;COP&quot;, items: [...] &#125;</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">GET</td>
                      <td className="px-4 py-2.5 font-mono text-zinc-300">/api/orders</td>
                      <td className="px-4 py-2.5 text-zinc-400">Auditoría centralizada de transacciones y estados KDS</td>
                      <td className="px-4 py-2.5 text-zinc-500 font-mono text-[11px]">&#123; count: 4, orders: [...] &#125;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* JSON Manifest Code Preview */}
              {manifestData && (
                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-bold">
                    <span>Manifiesto JSON Generado (Listo para importar en el SaaS):</span>
                    <button
                      onClick={() => setManifestData(null)}
                      className="text-zinc-500 hover:text-white"
                    >
                      Ocultar
                    </button>
                  </div>
                  <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-[11px] font-mono text-emerald-300 max-h-60 overflow-y-auto no-scrollbar">
                    {JSON.stringify(manifestData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 6: QA Suite Runner */}
        {activeAdminTab === 'qa' && (
          <div className="pt-6">
            <QASuiteView />
          </div>
        )}
      </div>

      {/* Modal: Agregar Nuevo Producto */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Agregar Producto a la Carta</span>
              </h3>
              <button
                onClick={() => setIsNewItemModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  required
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  placeholder="Ej: Pizza Paisa Especial, Gaseosa Postobón..."
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Categoría</label>
                  <select
                    value={newItemData.category}
                    onChange={(e) =>
                      setNewItemData({ ...newItemData, category: e.target.value as MenuCategory })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="colombianas">🇨🇴 Colombianas</option>
                    <option value="clasicas">Clásicas</option>
                    <option value="gourmet">Gourmet</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="postres">Postres</option>
                    <option value="calzones">Calzones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Precio en COP</label>
                  <input
                    type="number"
                    required
                    step="1000"
                    value={newItemData.price}
                    onChange={(e) =>
                      setNewItemData({ ...newItemData, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newItemData.description}
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, description: e.target.value })
                  }
                  placeholder="Ingredientes clave, preparación..."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={newItemData.image}
                  onChange={(e) => setNewItemData({ ...newItemData, image: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/40"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
