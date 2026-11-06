/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MenuItem,
  CustomPizzaConfig,
  QuoteCalculationRequest,
  CateringQuote,
  Order,
  OrderStatus,
  DoughOption,
  SauceOption,
  CheeseOption,
  ToppingOption,
  QATestResult,
  UserProfile,
  TenantConfig,
} from '../types/pizzeria';

export interface MenuResponse {
  success: boolean;
  count: number;
  items: MenuItem[];
  customizer: {
    doughs: DoughOption[];
    sauces: SauceOption[];
    cheeses: CheeseOption[];
    toppings: ToppingOption[];
  };
}

export const api = {
  // Fetch full menu and customizer catalog
  async getMenu(category?: string, search?: string): Promise<MenuResponse> {
    const params = new URLSearchParams();
    if (category && category !== 'todas') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`/api/menu?${params.toString()}`);
    if (!res.ok) throw new Error('Error al cargar la carta de Bella Napoli');
    return res.json();
  },

  // Calculate custom pizza pricing
  async calculateCustomPizza(config: CustomPizzaConfig) {
    const res = await fetch('/api/custom-pizza/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Error al calcular el precio de la pizza');
    return res.json();
  },

  // Catering Quote calculation
  async calculateQuote(request: QuoteCalculationRequest): Promise<{ success: boolean; quote: CateringQuote }> {
    const res = await fetch('/api/quotes/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error('Error al calcular la cotización de catering');
    return res.json();
  },

  // Validate Promo Code
  async validatePromo(code: string, subtotal: number) {
    const res = await fetch('/api/promos/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });
    return res.json();
  },

  // Orders
  async getOrders(): Promise<{ success: boolean; orders: Order[] }> {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error('Error al cargar las órdenes');
    return res.json();
  },

  async getOrderById(id: string): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Orden ${id} no encontrada`);
    return res.json();
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order }> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error al procesar el pedido');
    }
    return res.json();
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Error al actualizar el estado del pedido');
    return res.json();
  },

  // Chatbot
  async sendChatMessage(
    message: string,
    history: Array<{ sender: string; text: string }> = []
  ): Promise<{ success: boolean; reply: string; source: string }> {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history }),
    });
    if (!res.ok) throw new Error('Error en el servicio de chat con Gino Pizzaiolo');
    return res.json();
  },

  // QA Test Suite
  async runQASuite(): Promise<{
    success: boolean;
    report: {
      passed: boolean;
      totalTests: number;
      passedTests: number;
      failedTests: number;
      totalDurationMs: number;
      results: QATestResult[];
    };
  }> {
    const res = await fetch('/api/qa/run');
    if (!res.ok) throw new Error('Error al ejecutar la suite de pruebas QA');
    return res.json();
  },

  // Admin Endpoints
  async getAdminMetrics() {
    const res = await fetch('/api/admin/metrics');
    if (!res.ok) throw new Error('Error al cargar métricas de administración');
    return res.json();
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>) {
    const res = await fetch(`/api/admin/menu/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return res.json();
  },

  async toggleMenuItem(id: string) {
    const res = await fetch(`/api/admin/menu/${encodeURIComponent(id)}/toggle`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Error al alternar disponibilidad del producto');
    return res.json();
  },

  async addMenuItem(item: Partial<MenuItem>) {
    const res = await fetch('/api/admin/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Error al crear nuevo producto');
    return res.json();
  },

  async deleteMenuItem(id: string) {
    const res = await fetch(`/api/admin/menu/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  },

  async getAdminQuotes() {
    const res = await fetch('/api/admin/quotes');
    if (!res.ok) throw new Error('Error al cargar cotizaciones');
    return res.json();
  },

  async getAdminPromos() {
    const res = await fetch('/api/admin/promos');
    if (!res.ok) throw new Error('Error al cargar cupones');
    return res.json();
  },

  // User Auth & Profiles
  async login(username: string, password?: string, extraData?: Partial<UserProfile>): Promise<{
    success: boolean;
    user?: UserProfile;
    message?: string;
  }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, extraData }),
    });
    return res.json();
  },

  async saveProfile(user: UserProfile): Promise<{ success: boolean; user?: UserProfile }> {
    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });
    return res.json();
  },

  // Gerente & Super-Admin User Management
  async getAdminUsers(): Promise<{ success: boolean; users: UserProfile[] }> {
    const res = await fetch('/api/admin/users');
    if (!res.ok) throw new Error('Error al cargar lista de usuarios');
    return res.json();
  },

  async createAdminUser(userData: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al crear usuario');
    }
    return res.json();
  },

  async updateAdminUser(id: string, updates: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar usuario');
    }
    return res.json();
  },

  async deleteAdminUser(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al eliminar usuario');
    }
    return res.json();
  },

  async getAdminActivityLogs(): Promise<{ success: boolean; count: number; logs: any[] }> {
    const res = await fetch('/api/admin/activity-logs');
    if (!res.ok) throw new Error('Error al cargar registro de actividad');
    return res.json();
  },

  // Multi-Tenant SaaS & Membership Integration
  async getTenantInfo(): Promise<{ success: boolean; tenant: TenantConfig }> {
    const res = await fetch('/api/tenant/info');
    if (!res.ok) throw new Error('Error al consultar configuración de la franquicia');
    return res.json();
  },

  async updateTenantConfig(updates: Partial<TenantConfig>): Promise<{ success: boolean; tenant: TenantConfig; message: string }> {
    const res = await fetch('/api/tenant/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Error al actualizar configuración de franquicia');
    }
    return res.json();
  },

  async getMembershipHealth(): Promise<any> {
    const res = await fetch('/api/membership/health');
    if (!res.ok) throw new Error('Error al verificar estado de membresía en red');
    return res.json();
  },

  async verifyMembership(licenseKey?: string): Promise<{
    success: boolean;
    valid: boolean;
    plan: string;
    status: string;
    daysRemaining: number;
    message: string;
    maxOrders: number;
    currentOrders: number;
  }> {
    const res = await fetch('/api/membership/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey }),
    });
    if (!res.ok) throw new Error('Error al validar licencia con plataforma central');
    return res.json();
  },

  async syncPlatformHub(hubUrl?: string, apiKey?: string): Promise<{
    success: boolean;
    syncedAt: string;
    message: string;
    eventsSyncedCount: number;
    tenantId: string;
    metrics: any;
  }> {
    const res = await fetch('/api/membership/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hubUrl, apiKey }),
    });
    if (!res.ok) throw new Error('Error al sincronizar con plataforma central SaaS');
    return res.json();
  },

  async getSaaSManifest(): Promise<Record<string, any>> {
    const res = await fetch('/api/membership/manifest');
    if (!res.ok) throw new Error('Error al generar manifiesto de integración SaaS');
    return res.json();
  },
};

