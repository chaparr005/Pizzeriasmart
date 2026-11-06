/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MenuItem,
  MenuCategory,
  PizzaSize,
  CartItem,
} from '../types/pizzeria';
import {
  Search,
  Clock,
  Star,
  Plus,
  Flame,
  Sparkles,
  Leaf,
  Check,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCOP } from '../utils/format';

interface MenuViewProps {
  items: MenuItem[];
  onAddToCart: (item: CartItem) => void;
  onCustomizeItem?: (item: MenuItem) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  items,
  onAddToCart,
  onCustomizeItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDietFilter, setActiveDietFilter] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PizzaSize>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const categories: Array<{ id: MenuCategory; label: string; icon?: string }> = [
    { id: 'todas', label: '🍕 Toda la Carta' },
    { id: 'colombianas', label: '🇨🇴 Favoritas Colombianas' },
    { id: 'bebidas', label: '🥤 Gaseosas & Bebidas (1.5L y Personales)' },
    { id: 'clasicas', label: 'Pizzas Clásicas' },
    { id: 'gourmet', label: 'Pizzas Gourmet' },
    { id: 'entrantes', label: 'Palitroques & Pasabocas' },
    { id: 'postres', label: 'Postres & Calzones Dulces' },
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'todas' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.italianName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (activeDietFilter === 'veg' && !item.isVegetarian) return false;
    if (activeDietFilter === 'spicy' && !item.isSpicy) return false;
    if (activeDietFilter === 'chef' && !item.isChefPick) return false;
    if (activeDietFilter === 'popular' && !item.isPopular) return false;

    return true;
  });

  const handleSelectSize = (itemId: string, size: PizzaSize) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }));
  };

  const getItemPrice = (item: MenuItem, size: PizzaSize): number => {
    if (item.sizes && item.sizes[size]) {
      return item.sizes[size];
    }
    return item.price;
  };

  const handleAdd = (item: MenuItem) => {
    const size = selectedSizes[item.id] || 'mediana';
    const price = getItemPrice(item, size);

    const cartItem: CartItem = {
      id: `${item.id}-${size}-${Date.now()}`,
      type: 'menu_item',
      menuItemId: item.id,
      name: item.name,
      size,
      price,
      quantity: 1,
      image: item.image,
    };

    onAddToCart(cartItem);

    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 shadow-xl">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por pizza, trufa, burrata..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Dietary and Highlights Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveDietFilter(activeDietFilter === 'veg' ? null : 'veg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              activeDietFilter === 'veg'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vegetariana</span>
          </button>

          <button
            onClick={() => setActiveDietFilter(activeDietFilter === 'spicy' ? null : 'spicy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              activeDietFilter === 'spicy'
                ? 'bg-red-950/80 border-red-500 text-red-300 font-bold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Picante</span>
          </button>

          <button
            onClick={() => setActiveDietFilter(activeDietFilter === 'chef' ? null : 'chef')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              activeDietFilter === 'chef'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Selección Chef</span>
          </button>

          <button
            onClick={() => setActiveDietFilter(activeDietFilter === 'popular' ? null : 'popular')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              activeDietFilter === 'popular'
                ? 'bg-orange-950/80 border-orange-500 text-orange-300 font-bold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Más Pedidas</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-950/50 scale-[1.02]'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">No encontramos productos con ese filtro.</p>
          <button
            onClick={() => {
              setSelectedCategory('todas');
              setSearchQuery('');
              setActiveDietFilter(null);
            }}
            className="mt-3 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-500"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const currentSize = selectedSizes[item.id] || 'mediana';
            const price = getItemPrice(item, currentSize);
            const isAdded = Boolean(addedItemIds[item.id]);
            const isPizza = Boolean(item.sizes);

            return (
              <div
                key={item.id}
                className="group flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-950/20"
              >
                {/* Image & Visual Tags */}
                <div className="relative h-44 overflow-hidden bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />

                  {/* Highlights Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.category === 'colombianas' && (
                      <span className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-md">
                        🇨🇴 Sabor Colombiano
                      </span>
                    )}
                    {item.isAvailable === false && (
                      <span className="bg-zinc-900/90 text-red-300 border border-red-500/50 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-md">
                        Agotado Hoy
                      </span>
                    )}
                    {item.isPopular && (
                      <span className="bg-orange-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-md">
                        Top Ventas
                      </span>
                    )}
                    {item.isChefPick && (
                      <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-md">
                        Chef Pick
                      </span>
                    )}
                    {item.isVegetarian && (
                      <span className="bg-emerald-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <Leaf className="w-2.5 h-2.5" /> Veg
                      </span>
                    )}
                    {item.isSpicy && (
                      <span className="bg-red-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Picante
                      </span>
                    )}
                  </div>

                  {/* Prep Time & Rating */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                    <span className="flex items-center gap-1 bg-zinc-950/80 px-2 py-0.5 rounded-md backdrop-blur border border-zinc-800 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {item.prepTimeMin} min
                    </span>

                    <span className="flex items-center gap-1 bg-zinc-950/80 px-2 py-0.5 rounded-md backdrop-blur border border-zinc-800 text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{item.rating}</span>
                      <span className="text-[10px] text-zinc-400">({item.reviewsCount})</span>
                    </span>
                  </div>
                </div>

                {/* Content Area - Less text, punchy readability */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-sans font-bold text-white group-hover:text-orange-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Interactive Size Selector for Pizzas */}
                  {isPizza && item.sizes && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                        <span>Tamaño seleccionado:</span>
                        <span className="text-amber-400 font-black capitalize">
                          {currentSize === 'personal' && 'Personal (25cm · 4 porc.)'}
                          {currentSize === 'mediana' && 'Mediana (33cm · 8 porc.)'}
                          {currentSize === 'familiar' && 'Familiar (40cm · 12 porc.)'}
                          {currentSize === 'xl' && 'Fiesta XL (45cm · 16 porc.)'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                        {(['personal', 'mediana', 'familiar', 'xl'] as PizzaSize[]).map((sz) => {
                          const isSelected = currentSize === sz;
                          const labels: Record<PizzaSize, { name: string; cm: string }> = {
                            personal: { name: 'Personal', cm: '25cm' },
                            mediana: { name: 'Mediana', cm: '33cm' },
                            familiar: { name: 'Familiar', cm: '40cm' },
                            xl: { name: 'Fiesta XL', cm: '45cm' },
                          };
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => {
                                handleSelectSize(item.id, sz);
                              }}
                              className={`py-1.5 px-1 rounded-xl text-center transition-all border-2 flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-2 ring-orange-500/50 shadow-md scale-105'
                                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900'
                              }`}
                            >
                              <span className="font-bold text-[10px] leading-tight">{labels[sz].name}</span>
                              <span className={`text-[9px] font-mono ${isSelected ? 'text-amber-100' : 'text-zinc-500'}`}>
                                {labels[sz].cm}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Drink Pairings for Pizzas (Including 1.5L and Personal) */}
                  {isPizza && (
                    <div className="pt-2 border-t border-zinc-800/60 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block flex items-center gap-1">
                        <span>🥤 Acompaña con bebida bien fría:</span>
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart({
                              id: `beb-coca-15l-${Date.now()}`,
                              type: 'menu_item',
                              menuItemId: 'beb-coca-15l',
                              name: 'Coca-Cola Familiar 1.5 Litros',
                              size: 'familiar',
                              price: 9500,
                              quantity: 1,
                              image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
                            });
                          }}
                          className="text-[10px] bg-zinc-950 hover:bg-zinc-850 text-zinc-200 hover:text-white px-2.5 py-1 rounded-xl border border-orange-500/40 hover:border-orange-400 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                          title="Añadir Coca-Cola 1.5L para compartir"
                        >
                          <span className="font-bold text-orange-400">Coca-Cola 1.5L</span>
                          <span className="font-mono text-amber-300 font-bold">$9.500</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart({
                              id: `beb-coca-pers-${Date.now()}`,
                              type: 'menu_item',
                              menuItemId: 'beb-coca-personal',
                              name: 'Coca-Cola Personal 400ml',
                              size: 'personal',
                              price: 5500,
                              quantity: 1,
                              image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
                            });
                          }}
                          className="text-[10px] bg-zinc-950 hover:bg-zinc-850 text-zinc-200 hover:text-white px-2 py-1 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1 active:scale-95"
                          title="Añadir Coca-Cola Personal 400ml"
                        >
                          <span>Coca-Cola 400ml</span>
                          <span className="font-mono text-zinc-400 font-bold">$5.500</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart({
                              id: `beb-manz-15l-${Date.now()}`,
                              type: 'menu_item',
                              menuItemId: 'beb-manzana-15l',
                              name: 'Postobón Manzana 1.5 Litros',
                              size: 'familiar',
                              price: 8000,
                              quantity: 1,
                              image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
                            });
                          }}
                          className="text-[10px] bg-zinc-950 hover:bg-zinc-850 text-zinc-200 hover:text-white px-2 py-1 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1 active:scale-95"
                          title="Añadir Postobón Manzana 1.5L"
                        >
                          <span>🍎 Manzana 1.5L</span>
                          <span className="font-mono text-zinc-400 font-bold">$8.000</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart({
                              id: `beb-cuatro-15l-${Date.now()}`,
                              type: 'menu_item',
                              menuItemId: 'beb-cuatro-15l',
                              name: 'Cuatro Toronja 1.5 Litros',
                              size: 'familiar',
                              price: 8500,
                              quantity: 1,
                              image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
                            });
                          }}
                          className="text-[10px] bg-zinc-950 hover:bg-zinc-850 text-zinc-200 hover:text-white px-2 py-1 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center gap-1 active:scale-95"
                          title="Añadir Cuatro Toronja 1.5L"
                        >
                          <span>🍊 Cuatro 1.5L</span>
                          <span className="font-mono text-zinc-400 font-bold">$8.500</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pricing and Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <div>
                      <div className="text-base sm:text-lg font-mono font-black text-white">
                        {formatCOP(price)}
                      </div>
                      <span className="text-[10px] text-zinc-400 block -mt-0.5">
                        Precio en COP
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isPizza && onCustomizeItem && (
                        <button
                          onClick={() => onCustomizeItem(item)}
                          disabled={item.isAvailable === false}
                          className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-amber-400 border border-zinc-800 transition-colors"
                          title="Personalizar masa, salsas y toppings"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleAdd(item)}
                        disabled={item.isAvailable === false}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                          item.isAvailable === false
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-600 text-white scale-105'
                            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white active:scale-95 shadow-md shadow-orange-950/40'
                        }`}
                      >
                        {item.isAvailable === false ? (
                          <span>Agotado</span>
                        ) : isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Añadida!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Añadir</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
