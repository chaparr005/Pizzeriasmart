/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartItem, Order } from '../types/pizzeria';
import { api } from '../services/api';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Percent,
  CheckCircle2,
  Bike,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCOP } from '../utils/format';
import { UserProfile } from '../types/pizzeria';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  onOpenAuth,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderPlaced,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
    message: string;
  } | null>({
    code: 'SMART10',
    discount: 0,
    message: '',
  });
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  // Checkout form fields (Autofilled from currentUser if logged in)
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Santiago Mejía');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+57 310 456 7890');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'santiago.mejia@example.com');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeout'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || 'Carrera 6 # 5 - 20, Centro Histórico, Pamplona'
  );
  const [notes, setNotes] = useState('Portería, tostar los bordes');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta' | 'bizum_mercadopago'>('tarjeta');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when currentUser is updated
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
      if (currentUser.address) setDeliveryAddress(currentUser.address);
    }
  }, [currentUser]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? (subtotal > 0 ? 6000 : 0) : 0;

  // Compute discount with applied promo in COP
  let discount = 0;
  if (appliedPromo && appliedPromo.code) {
    if (appliedPromo.code === 'SMART10' && subtotal >= 60000) {
      discount = Math.round(subtotal * 0.1);
    } else if (appliedPromo.code === 'FIESTA20' && subtotal >= 250000) {
      discount = Math.round(subtotal * 0.2);
    } else if (appliedPromo.code === 'BIENVENIDO' && subtotal >= 60000) {
      discount = 10000;
    } else if (appliedPromo.code === 'PIZZALOVER' && subtotal >= 75000) {
      discount = Math.round(subtotal * 0.15);
    }
  }

  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setIsCheckingPromo(true);
    setPromoError(null);
    try {
      const res = await api.validatePromo(promoCodeInput.trim(), subtotal);
      if (res.valid) {
        setAppliedPromo({
          code: promoCodeInput.trim().toUpperCase(),
          discount: res.discount,
          message: res.message,
        });
        setPromoCodeInput('');
      } else {
        setPromoError(res.message);
      }
    } catch (err: any) {
      setPromoError('Error validando el cupón');
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress.trim() : undefined,
        items,
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        promoCode: discount > 0 ? appliedPromo?.code : undefined,
        deliveryFee,
        total: Math.round(finalTotal),
        estimatedMinutes: deliveryType === 'delivery' ? 32 : 18,
        paymentMethod,
        notes: notes.trim() || undefined,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });

        onOrderPlaced(res.order);
        onClearCart();
        onClose();
      }
    } catch (err: any) {
      alert('Error creando la orden: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col text-zinc-100">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-white">Tu Pedido PIZZASMART</h3>
                <span className="text-xs text-zinc-400">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'} · Precios en COP
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-zinc-400">Tu carrito está vacío.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-500"
                >
                  Ver Menú
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 bg-zinc-950"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <div className="text-[11px] text-orange-400 capitalize">
                        Tamaño: {item.size}
                      </div>

                      {item.customDetails && (
                        <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                          {item.customDetails.doughName} · {item.customDetails.sauceName} · {item.customDetails.cheeseName}
                        </div>
                      )}

                      <div className="text-xs font-mono font-bold text-white mt-1">
                        {formatCOP(item.price)} COP
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-1"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                    <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded-xl border border-zinc-800">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-zinc-400 hover:text-white p-0.5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-xs w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-zinc-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-sm text-white">
                      {formatCOP(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}

            {items.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={onClearCart}
                  className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1 mx-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar todo el carrito</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Module */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 space-y-4">
              {/* Promo Code Input */}
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="Cupón: SMART10 / BIENVENIDO"
                      className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 uppercase font-mono"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    disabled={isCheckingPromo || !promoCodeInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 disabled:opacity-40"
                  >
                    Aplicar
                  </button>
                </div>

                {appliedPromo && discount > 0 && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      Cupón {appliedPromo.code} activo (-{formatCOP(discount)})
                    </span>
                  </div>
                )}
                {promoError && (
                  <div className="text-[11px] text-red-400">{promoError}</div>
                )}
              </div>

              {/* Delivery Type Selector */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryType('delivery')}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-medium ${
                    deliveryType === 'delivery'
                      ? 'bg-orange-600/20 border-orange-500 text-orange-400 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Bike className="w-4 h-4" />
                  <span>Domicilio (+{formatCOP(6000)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('takeout')}
                  className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-medium ${
                    deliveryType === 'takeout'
                      ? 'bg-orange-600/20 border-orange-500 text-orange-400 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Para Recoger ($0)</span>
                </button>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-zinc-200">{formatCOP(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento cupón:</span>
                    <span className="font-mono">-{formatCOP(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Entrega:</span>
                  <span className="font-mono text-zinc-200">
                    {deliveryFee > 0 ? formatCOP(deliveryFee) : 'Gratis'}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total en COP:</span>
                  <span className="font-mono text-orange-400 text-lg">
                    {formatCOP(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-2">
                {/* Saved Data / Quick Transaction Notice */}
                {currentUser ? (
                  <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-600/30 text-[11px] text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        Datos cargados de <strong>{currentUser.name}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-900/60 px-1.5 py-0.5 rounded text-emerald-200 font-mono shrink-0">
                      Transacción Rápida
                    </span>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>Guarda tus datos para compras futuras</span>
                    {onOpenAuth && (
                      <button
                        type="button"
                        onClick={onOpenAuth}
                        className="text-orange-400 hover:text-orange-300 font-bold underline ml-1 shrink-0"
                      >
                        Iniciar Sesión
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu Nombre"
                    className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Teléfono móvil"
                    className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Dirección exacta en Pamplona (ej: Carrera 6 # 5 - 20)"
                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-orange-950/60 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Confirmar Pedido · {formatCOP(finalTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
