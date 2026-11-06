/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MenuCategory =
  | 'todas'
  | 'colombianas'
  | 'clasicas'
  | 'gourmet'
  | 'especialidades'
  | 'calzones'
  | 'entrantes'
  | 'bebidas'
  | 'postres';

export type PizzaSize = 'personal' | 'mediana' | 'familiar' | 'xl';

export interface SizePricing {
  personal: number;
  mediana: number;
  familiar: number;
  xl: number;
}

export interface MenuItem {
  id: string;
  name: string;
  italianName: string;
  category: MenuCategory;
  description: string;
  price: number; // Base price (mediana or standard)
  sizes?: SizePricing;
  tags: string[];
  allergens: string[];
  image: string;
  prepTimeMin: number;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isChefPick?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  calories?: number;
}

export interface DoughOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
  fermentationHours: number;
  isGlutenFree?: boolean;
}

export interface SauceOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
  color: string;
}

export interface CheeseOption {
  id: string;
  name: string;
  description: string;
  priceDelta: number;
  color: string;
  isVegan?: boolean;
}

export interface ToppingOption {
  id: string;
  name: string;
  category: 'carnes' | 'vegetales' | 'quesos' | 'especiales';
  price: number;
  color: string;
  iconName?: string;
}

export interface CustomPizzaConfig {
  size: PizzaSize;
  doughId: string;
  sauceId: string;
  cheeseId: string;
  toppings: string[]; // topping ids
  crustOption?: 'estandar' | 'borde_queso' | 'borde_ajo_parmesano';
  notes?: string;
}

export interface CartItem {
  id: string;
  type: 'menu_item' | 'custom_pizza';
  menuItemId?: string;
  name: string;
  size: PizzaSize;
  price: number;
  quantity: number;
  image: string;
  customDetails?: {
    doughName: string;
    sauceName: string;
    cheeseName: string;
    toppingsList: string[];
    crustName?: string;
  };
  notes?: string;
}

export type OrderStatus =
  | 'recibido'
  | 'en_cocina'
  | 'en_horno'
  | 'en_reparto'
  | 'entregado'
  | 'cancelado';

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  label: string;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryType: 'delivery' | 'takeout' | 'dine_in';
  deliveryAddress?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  estimatedMinutes: number;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
  paymentMethod: 'efectivo' | 'tarjeta' | 'bizum_mercadopago';
  notes?: string;
}

export type EventType =
  | 'cumpleanos'
  | 'corporativo'
  | 'boda'
  | 'fiesta_privada'
  | 'graduacion';

export type ServiceType =
  | 'delivery_termico'
  | 'pizzero_horno_vivo'
  | 'barra_libre_vip';

export interface CateringAddon {
  id: string;
  name: string;
  description: string;
  pricePerGuest: number;
  icon: string;
}

export interface QuoteCalculationRequest {
  eventType: EventType;
  adultsCount: number;
  kidsCount: number;
  serviceType: ServiceType;
  eventDate: string;
  eventTime: string;
  location: string;
  distanceKm: number;
  selectedAddons: string[];
  dietaryRequirements?: {
    veganGuests: number;
    celiacGuests: number;
  };
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface CateringQuote {
  id: string;
  createdAt: string;
  request: QuoteCalculationRequest;
  totalGuests: number;
  estimatedPizzasNeeded: number;
  totalSlices: number;
  slicesPerAdult: number;
  slicesPerKid: number;
  basePizzaCost: number;
  serviceCost: number;
  addonsCost: number;
  logisticsCost: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalTotal: number;
  costPerGuest: number;
  recommendedMenu: Array<{
    name: string;
    quantity: number;
    rationale: string;
  }>;
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountFixed?: number;
  minSubtotal: number;
  description: string;
  validUntil: string;
}

export interface QATestResult {
  id: string;
  category: 'database' | 'builder' | 'quotation' | 'promos' | 'orders' | 'chatbot';
  name: string;
  passed: boolean;
  durationMs: number;
  details: string;
  assertion: string;
  error?: string;
}

export type UserRole = 'client' | 'admin' | 'gerente';

export interface UserActivityLog {
  id: string;
  userId: string;
  username: string;
  role: UserRole;
  action: string;
  timestamp: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  savedAt?: string;
  lastOrderCount?: number;
  totalSpentCOP?: number;
  status?: 'activo' | 'suspendido';
  createdAt?: string;
}

export type PizzaDivision = 'entera' | 'mitad_mitad' | 'cuartos';

export interface PortionCombinationConfig {
  division: PizzaDivision;
  portion1Name?: string;
  portion1Toppings?: string[];
  portion2Name?: string;
  portion2Toppings?: string[];
  portion3Name?: string;
  portion3Toppings?: string[];
  portion4Name?: string;
  portion4Toppings?: string[];
}

// --- SaaS Membership & Multi-Tenant Hub Types ---
export type MembershipPlan = 'starter' | 'pro' | 'franchise_enterprise';
export type MembershipStatus = 'active' | 'trial' | 'past_due' | 'expired';

export interface TenantMembershipInfo {
  plan: MembershipPlan;
  status: MembershipStatus;
  startedAt: string;
  expiresAt: string;
  platformHubUrl?: string;
  autoSyncOrders: boolean;
  maxMonthlyOrders: number;
  currentMonthlyOrders: number;
  licenseKey: string;
  ownerEmail: string;
}

export interface TenantWhiteLabelConfig {
  restaurantName?: string;
  slogan?: string;
  city?: string;
  phone?: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  customDomain?: string;
  enabledFeatures: {
    kds: boolean;
    cateringQuotes: boolean;
    customBuilder: boolean;
    aiAssistant: boolean;
    smsNotifications: boolean;
  };
}

export interface TenantConfig {
  tenantId: string;
  tenantSlug: string;
  restaurantName: string;
  slogan: string;
  city: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  currency: string;
  taxRate: number;
  deliveryFeeCOP: number;
  membership: TenantMembershipInfo;
  whiteLabel: TenantWhiteLabelConfig;
  apiKey: string;
  lastSyncTimestamp?: string;
  webhookSecret?: string;
}

export interface PlatformSyncEvent {
  eventId: string;
  tenantId: string;
  eventType: 'order_created' | 'order_delivered' | 'membership_renewed' | 'catalog_updated' | 'ping';
  timestamp: string;
  payload: Record<string, any>;
  status: 'synced' | 'pending' | 'failed';
}

