/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/pizzeria';
import { api } from '../services/api';
import { formatCOP } from '../utils/format';
import {
  Compass,
  Search,
  Clock,
  MapPin,
  CheckCircle2,
  Flame,
  ChefHat,
  Bike,
  PackageCheck,
  AlertCircle,
  RotateCw,
} from 'lucide-react';

interface OrderTrackerProps {
  initialOrderId?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ initialOrderId }) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || 'ORD-8492');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getOrderById(id.trim());
      if (res.success && res.order) {
        setCurrentOrder(res.order);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'No pudimos encontrar esa orden');
      setCurrentOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      fetchOrder(initialOrderId);
    } else {
      fetchOrder('ORD-8492');
    }
  }, [initialOrderId]);

  // Order status steps config
  const steps: Array<{
    status: OrderStatus;
    label: string;
    sub: string;
    icon: any;
  }> = [
    {
      status: 'recibido',
      label: 'Recibido',
      sub: 'En cola de cocina',
      icon: CheckCircle2,
    },
    {
      status: 'en_cocina',
      label: 'Masa & Salsa',
      sub: 'Estirado artesanal',
      icon: ChefHat,
    },
    {
      status: 'en_horno',
      label: 'En Horno 450°C',
      sub: '90s en piedra volcánica',
      icon: Flame,
    },
    {
      status: 'en_reparto',
      label: 'En Camino',
      sub: 'Mochila térmica 75°C',
      icon: Bike,
    },
    {
      status: 'entregado',
      label: '¡Entregado!',
      sub: 'A disfrutar caliente',
      icon: PackageCheck,
    },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'recibido':
        return 0;
      case 'en_cocina':
        return 1;
      case 'en_horno':
        return 2;
      case 'en_reparto':
        return 3;
      case 'entregado':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.status) : 0;

  // Auto-sync polling every 3.5 seconds to track real kitchen Kanban moves
  useEffect(() => {
    const activeId = orderIdInput.trim();
    if (!activeId) return;

    const interval = setInterval(() => {
      api.getOrderById(activeId)
        .then((res) => {
          if (res.success && res.order) {
            setCurrentOrder(res.order);
          }
        })
        .catch(() => {});
    }, 3500);

    return () => clearInterval(interval);
  }, [orderIdInput]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="bg-stone-900/90 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Rastreo GPS & Estado de Cocina</span>
            </div>
            <h2 className="text-2xl font-serif font-black text-white">
              Sigue tu Pizza en Tiempo Real
            </h2>
          </div>

          {/* Quick Demo Order Chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400">Ver Demo:</span>
            {['ORD-8492', 'ORD-8491', 'ORD-8488'].map((id) => (
              <button
                key={id}
                onClick={() => {
                  setOrderIdInput(id);
                  fetchOrder(id);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  orderIdInput === id
                    ? 'bg-amber-600 border-amber-500 text-white font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Ingresa tu código de pedido (ej: ORD-8492)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            onClick={() => fetchOrder(orderIdInput)}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            {isLoading ? <RotateCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Rastrear</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Order Details Card */}
      {currentOrder && (
        <div className="space-y-6">
          {/* Estimated Arrival Banner */}
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Clock className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-bold block">
                  Estado Actual de Entrega
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {currentOrder.status === 'entregado'
                    ? '¡Pedido Entregado con Éxito!'
                    : `Tiempo Estimado: ~${currentOrder.estimatedMinutes} minutos`}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Pedido #{currentOrder.id} • Cliente: {currentOrder.customerName}
                </p>
              </div>
            </div>

            {/* Real Kitchen State - Controlled by staff on Kanban board */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>En vivo: Tablero de Cocina KDS</span>
              </div>
              <button
                onClick={() => fetchOrder(orderIdInput)}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Actualizar estado manualmente"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refrescar</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="bg-stone-900/90 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.status}
                    className={`relative p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-600/20 border-amber-500 shadow-lg shadow-amber-950/60 scale-105'
                        : isPassed
                        ? 'bg-emerald-950/30 border-emerald-600/60 text-emerald-300'
                        : 'bg-stone-950/60 border-stone-800/80 text-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isCurrent
                            ? 'bg-amber-500 text-stone-950'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold">
                        Paso {idx + 1}
                      </span>
                    </div>
                    <div
                      className={`font-bold text-xs ${
                        isCurrent ? 'text-amber-400' : isPassed ? 'text-white' : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{step.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Status History Audit Trail */}
            <div className="border-t border-stone-800 pt-5 space-y-3">
              <span className="text-xs uppercase font-mono font-bold text-stone-400 tracking-wider block">
                Historial Auditado de Eventos
              </span>
              <div className="space-y-2">
                {currentOrder.statusHistory.map((hist, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-xs bg-stone-950 p-3 rounded-xl border border-stone-800/80"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{hist.label}</span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {new Date(hist.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-stone-400 text-[11px] mt-0.5">{hist.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details & Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Info */}
            <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs">
              <span className="uppercase font-mono font-bold text-amber-400 tracking-wider block">
                Datos de Entrega
              </span>
              <div className="space-y-2 text-stone-300">
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">Modalidad:</span>
                  <span className="font-semibold text-white uppercase">{currentOrder.deliveryType}</span>
                </div>
                {currentOrder.deliveryAddress && (
                  <div className="flex items-start justify-between py-1 border-b border-stone-800 gap-2">
                    <span className="text-stone-400 shrink-0">Dirección:</span>
                    <span className="font-semibold text-white text-right">
                      {currentOrder.deliveryAddress}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-1 border-b border-stone-800">
                  <span className="text-stone-400">Teléfono:</span>
                  <span className="font-semibold text-white">{currentOrder.customerPhone}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-stone-400">Método de Pago:</span>
                  <span className="font-semibold text-emerald-400 uppercase">
                    {currentOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Items Receipt */}
            <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-3 text-xs">
              <span className="uppercase font-mono font-bold text-amber-400 tracking-wider block">
                Artículos de la Orden
              </span>
              <div className="space-y-2">
                {currentOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 border-b border-stone-800 text-stone-300"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {item.quantity}x {item.name}
                      </div>
                      <div className="text-[10px] text-stone-400 capitalize">{item.size}</div>
                    </div>
                    <span className="font-mono text-white font-bold">
                      {formatCOP(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="pt-2 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span>{formatCOP(currentOrder.subtotal)}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento ({currentOrder.promoCode}):</span>
                    <span>-{formatCOP(currentOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Envío:</span>
                  <span>{currentOrder.deliveryFee > 0 ? formatCOP(currentOrder.deliveryFee) : 'Gratis'}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-zinc-800">
                  <span>Total en COP:</span>
                  <span className="text-orange-400">{formatCOP(currentOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
