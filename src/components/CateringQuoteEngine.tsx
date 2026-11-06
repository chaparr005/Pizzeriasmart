/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  QuoteCalculationRequest,
  CateringQuote,
  EventType,
  ServiceType,
  CateringAddon,
} from '../types/pizzeria';
import { api } from '../services/api';
import {
  Calculator,
  Percent,
  Flame,
  Wine,
  UtensilsCrossed,
  Cake,
  Leaf,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCOP } from '../utils/format';

interface CateringQuoteEngineProps {
  onQuoteAccepted?: (quote: CateringQuote) => void;
}

export const CateringQuoteEngine: React.FC<CateringQuoteEngineProps> = ({ onQuoteAccepted }) => {
  const [eventType, setEventType] = useState<EventType>('corporativo');
  const [adultsCount, setAdultsCount] = useState<number>(35);
  const [kidsCount, setKidsCount] = useState<number>(5);
  const [serviceType, setServiceType] = useState<ServiceType>('pizzero_horno_vivo');
  const [eventDate, setEventDate] = useState<string>('2026-11-20');
  const [eventTime, setEventTime] = useState<string>('19:30');
  const [location, setLocation] = useState<string>('Pamplona Centro / Los Árboles, N. de Santander');
  const [distanceKm, setDistanceKm] = useState<number>(8);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'addon-bebidas',
    'addon-antipasti',
  ]);
  const [veganGuests, setVeganGuests] = useState<number>(2);
  const [celiacGuests, setCeliacGuests] = useState<number>(1);
  const [contactName, setContactName] = useState<string>('Santiago Mejía');
  const [contactEmail, setContactEmail] = useState<string>('santiago.mejia@example.com');
  const [contactPhone, setContactPhone] = useState<string>('+57 310 456 7890');

  const [quote, setQuote] = useState<CateringQuote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Available addons with COP pricing
  const addonsList: CateringAddon[] = [
    {
      id: 'addon-bebidas',
      name: 'Barra Libre de Bebidas',
      description: 'Cerveza Moretti, San Pellegrino con gas, refrescos y agua mineral ilimitada.',
      pricePerGuest: 12000,
      icon: 'Wine',
    },
    {
      id: 'addon-antipasti',
      name: 'Mesa de Antipasti & Focaccias',
      description: 'Burrata fresca con pesto, focaccias calientes, embutidos y aceitunas.',
      pricePerGuest: 15000,
      icon: 'UtensilsCrossed',
    },
    {
      id: 'addon-postres',
      name: 'Rincón Dulce Finger-Food',
      description: 'Mini cannoli siciliani y copitas individuales de tiramisú artesanal.',
      pricePerGuest: 9000,
      icon: 'Cake',
    },
    {
      id: 'addon-vajilla',
      name: 'Menaje Compostable Eco',
      description: 'Platos de hoja de palma natural, cubiertos de bambú y servilletas.',
      pricePerGuest: 4000,
      icon: 'Leaf',
    },
  ];

  // Recalculate quote whenever inputs change
  useEffect(() => {
    let isCancelled = false;

    const compute = async () => {
      setIsLoading(true);
      try {
        const payload: QuoteCalculationRequest = {
          eventType,
          adultsCount,
          kidsCount,
          serviceType,
          eventDate,
          eventTime,
          location,
          distanceKm,
          selectedAddons,
          dietaryRequirements: {
            veganGuests,
            celiacGuests,
          },
          contactName,
          contactEmail,
          contactPhone,
        };

        const res = await api.calculateQuote(payload);
        if (!isCancelled && res.success) {
          setQuote(res.quote);
        }
      } catch (err) {
        console.error('Error calculando cotización:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    compute();
    return () => {
      isCancelled = true;
    };
  }, [
    eventType,
    adultsCount,
    kidsCount,
    serviceType,
    eventDate,
    eventTime,
    location,
    distanceKm,
    selectedAddons,
    veganGuests,
    celiacGuests,
    contactName,
    contactEmail,
    contactPhone,
  ]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleSaveQuote = () => {
    if (quote) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      if (onQuoteAccepted) {
        onQuoteAccepted(quote);
      }
    }
  };

  const getAddonIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wine':
        return <Wine className="w-4 h-4 text-orange-400" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4 text-emerald-400" />;
      case 'Cake':
        return <Cake className="w-4 h-4 text-purple-400" />;
      case 'Leaf':
        return <Leaf className="w-4 h-4 text-teal-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-850 to-orange-950/60 p-5 rounded-3xl border border-zinc-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador Interactivo de Eventos & Catering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-black text-white">
              Cotiza Pizzas al Horno en Vivo (COP)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
              Cálculo instantáneo de porciones para adultos y niños, maestro pizzero con horno portátil de piedra volcánica y descuentos por volumen.
            </p>
          </div>

          <div className="bg-zinc-950 px-4 py-2.5 rounded-2xl border border-zinc-800 flex items-center gap-3 shrink-0">
            <Percent className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase font-mono">Descuento Volumen</div>
              <div className="text-xs font-bold text-white">Hasta 20% automático</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Tipo de Evento */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-2.5">
            <span className="text-xs uppercase font-mono font-bold text-orange-400 tracking-wider block">
              1. Tipo de Celebración
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'cumpleanos' as EventType, label: '🎂 Cumpleaños / Fiesta' },
                { id: 'corporativo' as EventType, label: '💼 Corporativo / Empresa' },
                { id: 'boda' as EventType, label: '💍 Boda / Gala' },
                { id: 'fiesta_privada' as EventType, label: '🍕 Fiesta con Amigos' },
                { id: 'graduacion' as EventType, label: '🎓 Graduación' },
              ].map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setEventType(ev.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    eventType === ev.id
                      ? 'bg-orange-600/20 border-orange-500 text-white font-bold shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {ev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Cantidad de Invitados & Sliders */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono font-bold text-orange-400 tracking-wider">
                2. Número de Invitados (5 rebanadas/adulto, 3/niño)
              </span>
              <span className="text-xs text-orange-400 font-mono font-bold">
                {adultsCount + kidsCount} personas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Adults Slider */}
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Adultos:
                  </span>
                  <span className="text-base font-mono font-bold text-orange-400">
                    {adultsCount} personas
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={adultsCount}
                  onChange={(e) => setAdultsCount(parseInt(e.target.value) || 0)}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Kids Slider */}
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Niños:
                  </span>
                  <span className="text-base font-mono font-bold text-emerald-400">
                    {kidsCount} niños
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={kidsCount}
                  onChange={(e) => setKidsCount(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Special Diets */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-zinc-300">Celíacos (Sin gluten):</div>
                  <div className="text-[10px] text-zinc-500">Masa dedicada</div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={adultsCount + kidsCount}
                  value={celiacGuests}
                  onChange={(e) => setCeliacGuests(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-12 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-center font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-zinc-300">Veganos / Vegetarianos:</div>
                  <div className="text-[10px] text-zinc-500">Queso vegetal</div>
                </div>
                <input
                  type="number"
                  min="0"
                  max={adultsCount + kidsCount}
                  value={veganGuests}
                  onChange={(e) => setVeganGuests(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-12 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-center font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Modalidad de Servicio (COP) */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-orange-400 tracking-wider block">
              3. Modalidad del Servicio
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: 'delivery_termico' as ServiceType,
                  title: 'Delivery Térmico',
                  subtitle: 'Pizzas listas en cajas térmicas a 75°C',
                  fee: formatCOP(18000),
                  badge: 'Económico',
                },
                {
                  id: 'pizzero_horno_vivo' as ServiceType,
                  title: 'Horno Móvil en Vivo',
                  subtitle: 'Maestro pizzero con horno portátil a 450°C (3 horas)',
                  fee: formatCOP(350000),
                  badge: 'Favorito',
                },
                {
                  id: 'barra_libre_vip' as ServiceType,
                  title: 'Barra Libre VIP',
                  subtitle: '2 pizzeros, servicio buffet ilimitado (4 horas)',
                  fee: formatCOP(650000),
                  badge: 'VIP All-In',
                },
              ].map((serv) => (
                <button
                  key={serv.id}
                  onClick={() => setServiceType(serv.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    serviceType === serv.id
                      ? 'bg-orange-600/20 border-orange-500 text-white shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{serv.title}</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono font-bold">
                        {serv.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-snug">{serv.subtitle}</p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-zinc-800 font-mono text-xs font-bold text-orange-400">
                    {serv.fee}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Addons */}
          <div className="bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-orange-400 tracking-wider block">
              4. Complementos Opcionales por Invitado
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {addonsList.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-orange-600/20 border-orange-500 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0">
                      {getAddonIcon(addon.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate">{addon.name}</span>
                        <span className="text-xs font-mono font-bold text-orange-400">
                          +{formatCOP(addon.pricePerGuest)}/p
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">{addon.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Quotation Summary Card */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 font-bold block">
                  Presupuesto Automático en COP
                </span>
                <h3 className="text-lg font-sans font-bold text-white">
                  Cotización en Vivo
                </h3>
              </div>
              <span className="font-mono text-xs bg-zinc-950 px-2.5 py-1 rounded-xl text-zinc-300 border border-zinc-800">
                {quote?.id || 'COT-CALC'}
              </span>
            </div>

            {quote && (
              <div className="space-y-4">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">
                      Pizzas Familiares
                    </span>
                    <span className="text-3xl font-mono font-black text-orange-400">
                      {quote.estimatedPizzasNeeded}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      ({quote.totalSlices} porciones)
                    </span>
                  </div>

                  <div className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wide block">
                      Costo por Persona
                    </span>
                    <span className="text-2xl font-mono font-black text-emerald-400">
                      {formatCOP(quote.costPerGuest)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {quote.totalGuests} invitados
                    </span>
                  </div>
                </div>

                {/* Financial Breakdown Table */}
                <div className="space-y-1.5 text-xs text-zinc-300 border-t border-b border-zinc-800 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">
                      {quote.estimatedPizzasNeeded}x Pizzas Familiares (Horno leña):
                    </span>
                    <span className="font-mono font-semibold text-white">
                      {formatCOP(quote.basePizzaCost)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Servicio & Montaje:</span>
                    <span className="font-mono font-semibold text-white">
                      {formatCOP(quote.serviceCost)}
                    </span>
                  </div>

                  {quote.addonsCost > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Complementos por Persona:</span>
                      <span className="font-mono font-semibold text-white">
                        {formatCOP(quote.addonsCost)}
                      </span>
                    </div>
                  )}

                  {quote.logisticsCost > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Desplazamiento Logístico:</span>
                      <span className="font-mono font-semibold text-white">
                        {formatCOP(quote.logisticsCost)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800 font-medium">
                    <span className="text-zinc-400">Subtotal:</span>
                    <span className="font-mono text-white">{formatCOP(quote.subtotal)}</span>
                  </div>

                  {quote.discountPercentage > 0 && (
                    <div className="flex items-center justify-between text-emerald-400 font-bold bg-emerald-950/40 px-2 py-1.5 rounded-lg border border-emerald-800/40">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Descuento Volumen ({quote.discountPercentage}%):
                      </span>
                      <span className="font-mono">-{formatCOP(quote.discountAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Total Final */}
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-sm font-bold text-white">Total en COP:</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-orange-400">
                      {formatCOP(quote.finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Save Quote CTA */}
                <button
                  onClick={handleSaveQuote}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white active:scale-95 shadow-orange-950/60'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Cotización Confirmada con Éxito!</span>
                    </>
                  ) : (
                    <>
                      <span>Aceptar y Guardar Cotización</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
