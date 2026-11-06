/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types/pizzeria';
import { api } from '../services/api';
import { formatCOP } from '../utils/format';
import {
  UtensilsCrossed,
  Flame,
  ChefHat,
  Bike,
  PackageCheck,
  RotateCw,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export const KitchenDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Error fetching orders for kitchen:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await api.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? res.order : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const activeOrders = orders.filter((o) => o.status !== 'entregado' && o.status !== 'cancelado');
  const totalSales = orders.reduce((acc, o) => acc + (o.status !== 'cancelado' ? o.total : 0), 0);
  const inOvenCount = orders.filter((o) => o.status === 'en_horno').length;

  const columns: Array<{
    id: OrderStatus;
    title: string;
    icon: any;
    color: string;
    nextStatus?: OrderStatus;
    nextLabel?: string;
  }> = [
    {
      id: 'recibido',
      title: 'Nuevos / Pendientes',
      icon: Clock,
      color: 'border-blue-500/50 text-blue-400',
      nextStatus: 'en_cocina',
      nextLabel: 'Amasar & Salsa',
    },
    {
      id: 'en_cocina',
      title: 'En Preparación',
      icon: ChefHat,
      color: 'border-amber-500/50 text-amber-400',
      nextStatus: 'en_horno',
      nextLabel: 'Meter al Horno (450°C)',
    },
    {
      id: 'en_horno',
      title: 'En Horno a Leña',
      icon: Flame,
      color: 'border-red-500/50 text-red-400',
      nextStatus: 'en_reparto',
      nextLabel: 'Despachar a Repartidor',
    },
    {
      id: 'en_reparto',
      title: 'En Reparto / Listo',
      icon: Bike,
      color: 'border-purple-500/50 text-purple-400',
      nextStatus: 'entregado',
      nextLabel: 'Marcar Entregado',
    },
    {
      id: 'entregado',
      title: 'Entregados',
      icon: PackageCheck,
      color: 'border-emerald-500/50 text-emerald-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner and Kitchen Metrics */}
      <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>PIZZASMART · Control de Cocina en Vivo</span>
          </div>
          <h2 className="text-2xl font-sans font-black text-white">
            Tablero Kanban de Despacho
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Comandas en tiempo real, 450°C de horneado y control de repartidores.
          </p>
        </div>

        {/* Top Controls & Metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">Órdenes Activas:</span>
            <span className="text-lg font-mono font-bold text-orange-400">
              {activeOrders.length}
            </span>
          </div>

          <div className="bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">En Horno Ahora:</span>
            <span className="text-lg font-mono font-bold text-red-400">
              {inOvenCount}
            </span>
          </div>

          <div className="bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">Ventas Turno:</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {formatCOP(totalSales)}
            </span>
          </div>

          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700"
            title="Refrescar órdenes"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const Icon = col.icon;
          const colOrders = orders.filter((o) => o.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-stone-900/70 rounded-2xl border border-stone-800 p-4 space-y-3 min-h-[500px] flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${col.color.split(' ')[1]}`} />
                  <span className="text-xs font-bold text-white">{col.title}</span>
                </div>
                <span className="text-xs font-mono font-bold bg-stone-950 px-2 py-0.5 rounded-md text-stone-300">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                {colOrders.length === 0 ? (
                  <div className="text-center py-8 text-stone-600 text-xs italic">
                    Sin comandas
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const isUpdating = updatingId === order.id;

                    return (
                      <div
                        key={order.id}
                        className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-3 hover:border-amber-500/40 transition-colors shadow-sm"
                      >
                        {/* Header ID & Time */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-400">
                            #{order.id}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        {/* Customer */}
                        <div className="text-xs">
                          <div className="font-semibold text-white">{order.customerName}</div>
                          <div className="text-[10px] text-stone-400 truncate">
                            {order.deliveryAddress || 'Retiro en mostrador'}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1 text-xs border-t border-b border-stone-900 py-2">
                          {order.items.map((it, i) => (
                            <div key={i} className="flex justify-between text-stone-300 text-[11px]">
                              <span className="truncate max-w-[140px]">
                                <span className="font-bold text-amber-400">{it.quantity}x</span> {it.name}
                              </span>
                              <span className="font-mono text-[10px] text-stone-500 uppercase">
                                {it.size}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="text-[10px] text-amber-300/90 italic bg-amber-950/20 p-1.5 rounded">
                            "{order.notes}"
                          </div>
                        )}

                        {/* Action advance button */}
                        {col.nextStatus && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, col.nextStatus!)}
                            disabled={isUpdating}
                            className="w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-amber-600 text-stone-200 hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 border border-stone-800 hover:border-amber-500"
                          >
                            <span>{col.nextLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
