/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  Pizza,
  Check,
  Calculator,
  Plus,
  Zap,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { formatCOP } from '../utils/format';
import { CartItem, PizzaSize } from '../types/pizzeria';

interface HeroProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenGino: () => void;
  onAddToCart?: (item: CartItem) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenGino, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('mediana');
  const [selectedDough, setSelectedDough] = useState<'48h' | '72h' | 'relleno'>('72h');
  const [addedHeroItem, setAddedHeroItem] = useState(false);

  const heroPizzas = {
    personal: { name: 'Margherita Verace Smart (Personal)', price: 24000, slices: 4, cm: 25 },
    mediana: { name: 'Margherita Verace Smart (Mediana)', price: 32000, slices: 8, cm: 32 },
    familiar: { name: 'Margherita Verace Smart (Familiar)', price: 46000, slices: 10, cm: 38 },
    xl: { name: 'Margherita Verace Smart (XL Fiesta)', price: 59000, slices: 12, cm: 45 },
  };

  const currentPizza = heroPizzas[selectedSize];
  const doughPriceDelta = selectedDough === '72h' ? 4000 : selectedDough === 'relleno' ? 7000 : 0;
  const totalPrice = currentPizza.price + doughPriceDelta;

  const handleHeroQuickOrder = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `hero-margherita-${selectedSize}-${Date.now()}`,
        type: 'menu_item',
        menuItemId: 'piz-01',
        name: `Margherita Verace D.O.P. (${selectedDough === '72h' ? 'Masa Madre 72h' : selectedDough === 'relleno' ? 'Borde Queso' : 'Tradicional'})`,
        size: selectedSize,
        price: totalPrice,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
      });
      setAddedHeroItem(true);
      setTimeout(() => setAddedHeroItem(false), 2000);
    } else {
      onNavigate('menu');
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 border-b border-zinc-800">
      {/* Dynamic Ambient Glow */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-orange-600/40 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] rounded-full bg-red-600/30 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual & Interactive Headline (Less text, more punch) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Live Indicator Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-orange-500/30 text-xs font-semibold shadow-inner">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
              </span>
              <span className="text-orange-400 font-bold">PIZZASMART PAMPLONA</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">Horno a 450°C</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-mono">90s cocción</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white leading-tight">
              Pizzas a la leña,{' '}
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-amber-300 bg-clip-text text-transparent">
                diseñadas en vivo.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-normal leading-relaxed">
              Masa viva de 72h con harina italiana 00, queso fresco de búfala y salsa San Marzano. Pide al instante en COP o cotiza tu evento.
            </p>

            {/* Quick Interactive Selector (Size & Dough live playground) */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Tamaño interactivo:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {currentPizza.slices} porciones · {currentPizza.cm} cm
                </span>
              </div>

              {/* Size Buttons */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(['personal', 'mediana', 'familiar', 'xl'] as PizzaSize[]).map((sz) => {
                  const labels: Record<PizzaSize, { short: string; sub: string }> = {
                    personal: { short: 'Personal', sub: '25 cm' },
                    mediana: { short: 'Mediana', sub: '32 cm' },
                    familiar: { short: 'Familiar', sub: '38 cm' },
                    xl: { short: 'XL Fiesta', sub: '45 cm' },
                  };
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`p-2 rounded-xl text-center transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold shadow-md shadow-orange-950/60 scale-[1.02]'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="leading-tight">{labels[sz].short}</div>
                      <div className="text-[10px] opacity-75 font-mono">{labels[sz].sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* Dough Pills */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-zinc-400 text-[11px]">Masa:</span>
                <button
                  onClick={() => setSelectedDough('48h')}
                  className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                    selectedDough === '48h'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Tradicional 48h
                </button>
                <button
                  onClick={() => setSelectedDough('72h')}
                  className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                    selectedDough === '72h'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Masa Madre 72h (+{formatCOP(4000)})
                </button>
                <button
                  onClick={() => setSelectedDough('relleno')}
                  className={`px-2.5 py-1 rounded-lg border transition-all text-[11px] ${
                    selectedDough === 'relleno'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Borde Queso (+{formatCOP(7000)})
                </button>
              </div>

              {/* Live Price & 1-Click Order */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                <div>
                  <div className="text-[11px] text-zinc-400">Total en COP:</div>
                  <div className="text-xl font-bold font-mono text-white">
                    {formatCOP(totalPrice)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleHeroQuickOrder}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                      addedHeroItem
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-orange-950/60 active:scale-95'
                    }`}
                  >
                    {addedHeroItem ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Agregada al Carrito!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Pedir Esta Pizza</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('builder')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all hover:border-amber-400 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Constructor Interactivo 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('quotation')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-semibold transition-all hover:text-white"
              >
                <Calculator className="w-4 h-4 text-orange-400" />
                <span>Cotizador de Eventos</span>
              </button>

              <button
                onClick={onOpenGino}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 text-xs font-semibold transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chat Pizzaiolo AI</span>
              </button>
            </div>
          </div>

          {/* Right Visual Hero Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-3xl p-3 bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 border border-zinc-700/80 shadow-2xl overflow-hidden group">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-zinc-950">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
                  alt="PizzaSmart Horno a la Leña"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                {/* Floating Tech Badges */}
                <div className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur-md border border-zinc-700 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    Horno de Piedra: 450°C
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-orange-600/90 backdrop-blur-md text-white font-mono font-bold text-[11px] px-2.5 py-1 rounded-xl shadow-lg border border-orange-400/30">
                  90 Segundos
                </div>

                {/* Bottom Overlay Featured Item */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                        Especialidad Recomendada
                      </div>
                      <div className="text-sm font-bold">
                        Tartufo Nero & Funghi Porcini
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Crema de trufa, boletus salteados y rúcula
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white font-mono">
                        {formatCOP(44000)}
                      </div>
                      <button
                        onClick={() => {
                          if (onAddToCart) {
                            onAddToCart({
                              id: `quick-tartufo-${Date.now()}`,
                              type: 'menu_item',
                              menuItemId: 'piz-04',
                              name: 'Tartufo Nero & Funghi Porcini',
                              size: 'mediana',
                              price: 44000,
                              quantity: 1,
                              image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
                            });
                          } else {
                            onNavigate('menu');
                          }
                        }}
                        className="mt-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 underline underline-offset-2 flex items-center gap-1 justify-end"
                      >
                        <span>Pedir Ya</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Feature Bar under Hero Image */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> 450°C
                </div>
                <div className="text-[10px] text-zinc-400">Fuego de leña</div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> 72h
                </div>
                <div className="text-[10px] text-zinc-400">Masa fermentada</div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div className="text-xs font-bold text-white flex items-center justify-center gap-1">
                  <Pizza className="w-3.5 h-3.5 text-amber-400" /> D.O.P.
                </div>
                <div className="text-[10px] text-zinc-400">San Marzano</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
