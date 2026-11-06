/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  PizzaSize,
  CartItem,
  DoughOption,
  SauceOption,
  CheeseOption,
  ToppingOption,
  PizzaDivision,
} from '../types/pizzeria';
import {
  Sparkles,
  Flame,
  Check,
  Plus,
  Trash2,
  ChefHat,
  ShoppingBag,
  Zap,
  Split,
  Layers,
  Info,
  Maximize2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Bookmark,
  BookmarkPlus,
  Heart,
  Share2,
  Clock,
  CircleDot,
  Dices,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCOP } from '../utils/format';
import { toast } from 'sonner';

interface PizzaBuilderProps {
  doughs: DoughOption[];
  sauces: SauceOption[];
  cheeses: CheeseOption[];
  toppings: ToppingOption[];
  onAddToCart: (item: CartItem) => void;
  initialTemplate?: {
    name: string;
    doughId?: string;
    sauceId?: string;
    cheeseId?: string;
    toppings?: string[];
  };
}

interface SavedCreation {
  id: string;
  name: string;
  date: string;
  size: PizzaSize;
  division: PizzaDivision;
  doughId: string;
  sauceId: string;
  cheeseId: string;
  crustOption: 'estandar' | 'borde_queso' | 'borde_ajo_parmesano';
  portion1Toppings: string[];
  portion2Toppings: string[];
  portion3Toppings: string[];
  portion4Toppings: string[];
  portion1Name?: string;
  portion2Name?: string;
  totalCOP: number;
}

// Realistic SVG rendering for individual topping slices/pieces
const ToppingPieceSVG: React.FC<{ toppingId: string; name?: string }> = ({ toppingId, name }) => {
  const tid = toppingId.toLowerCase();
  const tname = (name || '').toLowerCase();

  // Pepperoni / Salame Piccante Calabrés
  if (tid.includes('salame') || tid.includes('pepperoni') || tname.includes('salame') || tname.includes('pepperoni')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <circle cx="18" cy="18" r="15" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
        <circle cx="11" cy="13" r="1.8" fill="#fecaca" opacity="0.85" />
        <circle cx="24" cy="12" r="1.5" fill="#fecaca" opacity="0.85" />
        <circle cx="20" cy="22" r="1.6" fill="#7f1d1d" />
        <circle cx="13" cy="24" r="1.4" fill="#fecaca" opacity="0.85" />
        <circle cx="24" cy="23" r="1.5" fill="#7f1d1d" />
        <circle cx="17" cy="16" r="1.3" fill="#7f1d1d" />
        <circle cx="18" cy="18" r="14.5" fill="none" stroke="#f87171" strokeWidth="0.6" strokeDasharray="3,3" />
      </svg>
    );
  }

  // Pineapple / Piña Oro Miel Caramelizada
  if (tid.includes('pina') || tid.includes('piña') || tid.includes('haw') || tname.includes('piña')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <path
          d="M9,9 Q18,6 27,9 L24,26 Q18,29 12,26 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="1.5"
        />
        <line x1="10" y1="14" x2="26" y2="14" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="11" y1="20" x2="25" y2="20" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="18" y1="8" x2="18" y2="27" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2,2" />
        <circle cx="14" cy="11" r="1.2" fill="#eab308" />
        <circle cx="22" cy="17" r="1.2" fill="#eab308" />
      </svg>
    );
  }

  // Bacon / Tocineta Ahumada Crujiente
  if (tid.includes('bacon') || tid.includes('toci') || tid.includes('guanciale') || tname.includes('tocineta')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <path
          d="M5,13 Q12,7 19,14 T31,13 L31,21 Q23,27 17,20 T5,21 Z"
          fill="#991b1b"
          stroke="#7f1d1d"
          strokeWidth="1.4"
        />
        <path
          d="M7,16 Q13,11 19,17 T29,16"
          stroke="#fed7aa"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Sweet Corn / Maíz Tierno Dulce
  if (tid.includes('maiz') || tid.includes('maíz') || tname.includes('maíz')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <circle cx="13" cy="15" r="4.2" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="23" cy="15" r="4.2" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="18" cy="22" r="4.2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="15" cy="14" r="1.2" fill="#fffbeb" opacity="0.7" />
        <circle cx="21" cy="14" r="1.2" fill="#fffbeb" opacity="0.7" />
      </svg>
    );
  }

  // Jalapeño / Mexicano
  if (tid.includes('jalapeno') || tid.includes('jalapeño') || tid.includes('mex') || tname.includes('jalapeño')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <circle cx="18" cy="18" r="14" fill="#15803d" stroke="#14532d" strokeWidth="2" />
        <circle cx="18" cy="18" r="7.5" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="1.5" fill="#fef08a" />
        <circle cx="20" cy="16" r="1.5" fill="#fef08a" />
        <circle cx="18" cy="20.5" r="1.5" fill="#fef08a" />
      </svg>
    );
  }

  // Plantain / Plátano Maduro
  if (tid.includes('maduro') || tid.includes('platano') || tid.includes('plátano') || tname.includes('plátano')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <ellipse cx="18" cy="18" rx="14" ry="9" fill="#eab308" stroke="#854d0e" strokeWidth="1.5" />
        <ellipse cx="18" cy="18" rx="10" ry="6" fill="#ca8a04" />
        <circle cx="18" cy="18" r="2.2" fill="#451a03" />
        <circle cx="13" cy="17" r="1" fill="#78350f" />
        <circle cx="23" cy="17" r="1" fill="#78350f" />
      </svg>
    );
  }

  // Shredded Chicken / Pollo al Ajo
  if (tid.includes('pollo') || tname.includes('pollo')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <path
          d="M7,18 Q14,9 25,13 Q29,20 22,25 Q13,26 7,18 Z"
          fill="#fef08a"
          stroke="#ca8a04"
          strokeWidth="1.4"
        />
        <path d="M11,16 Q17,13 22,17" stroke="#b45309" strokeWidth="1.2" fill="none" />
        <path d="M14,21 Q19,19 23,22" stroke="#b45309" strokeWidth="1.2" fill="none" />
      </svg>
    );
  }

  // Mushrooms / Portobello / Champiñones
  if (tid.includes('portobello') || tid.includes('champ') || tid.includes('funghi') || tid.includes('trufa') || tname.includes('champiñon')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <path d="M15,18 L21,18 L20,30 L16,30 Z" fill="#e7e5e4" stroke="#78716c" strokeWidth="1.2" />
        <path d="M5,19 C5,8 31,8 31,19 C31,21 5,21 5,19 Z" fill="#a8a29e" stroke="#57534e" strokeWidth="1.5" />
        <path d="M9,18 C12,12 24,12 27,18" stroke="#78716c" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  // Basil / Albahaca Fresca & Rúcula
  if (tid.includes('albahaca') || tid.includes('basil') || tid.includes('rucula') || tname.includes('albahaca')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <path
          d="M18,5 C27,11 29,26 18,32 C7,26 9,11 18,5 Z"
          fill="#16a34a"
          stroke="#14532d"
          strokeWidth="1.5"
        />
        <line x1="18" y1="8" x2="18" y2="28" stroke="#86efac" strokeWidth="1.4" />
        <path d="M18,14 Q22,17 24,19" stroke="#86efac" strokeWidth="1" fill="none" />
        <path d="M18,20 Q14,22 12,24" stroke="#86efac" strokeWidth="1" fill="none" />
      </svg>
    );
  }

  // Black Olives / Aceitunas Negras
  if (tid.includes('oliva') || tid.includes('aceituna') || tname.includes('aceituna')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <circle cx="18" cy="18" r="14" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="5.5" fill="#a1a1aa" opacity="0.35" stroke="#27272a" strokeWidth="1" />
        <ellipse cx="13" cy="13" rx="2" ry="1.5" fill="#52525b" />
      </svg>
    );
  }

  // Prosciutto / Jamón Cotto
  if (tid.includes('prosciutto') || tid.includes('cotto') || tid.includes('jamon') || tname.includes('prosciutto') || tname.includes('jamón')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <path
          d="M6,10 C14,6 26,9 31,16 C33,23 24,30 16,29 C9,28 4,21 6,10 Z"
          fill="#f43f5e"
          stroke="#be123c"
          strokeWidth="1.4"
        />
        <path d="M9,13 C14,10 22,12 26,17" stroke="#fecdd3" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M12,23 C18,22 23,24 25,27" stroke="#fecdd3" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  // Sun-dried Tomatoes / Tomates Secos
  if (tid.includes('tomateseco') || tname.includes('seco')) {
    return (
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
        <ellipse cx="18" cy="18" rx="14" ry="9" fill="#991b1b" stroke="#450a0a" strokeWidth="1.5" />
        <path d="M8,18 Q18,12 28,18" stroke="#f87171" strokeWidth="1.2" fill="none" />
        <circle cx="14" cy="16" r="1" fill="#fca5a5" />
        <circle cx="22" cy="19" r="1" fill="#fca5a5" />
      </svg>
    );
  }

  // Default Savory Morsel / Nduja / Carne
  return (
    <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md select-none pointer-events-none">
      <circle cx="18" cy="18" r="12" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
      <circle cx="15" cy="15" r="2" fill="#ea580c" />
      <circle cx="21" cy="20" r="2" fill="#ea580c" />
      <circle cx="19" cy="14" r="1.5" fill="#f97316" />
    </svg>
  );
};

// Deterministic Uniform Distribution Coordinates
function getToppingScatterCoordinates(
  toppingIndex: number,
  mode: PizzaDivision,
  subZone: 1 | 2 | 3 | 4
): Array<{ top: string; left: string; rotate: number; scale: number }> {
  const offsetAngle = (toppingIndex * 37) % 360;

  if (mode === 'entera') {
    const pieces: Array<{ top: string; left: string; rotate: number; scale: number }> = [];

    // Outer ring: 6 pieces at r ~ 35%
    for (let i = 0; i < 6; i++) {
      const angleDeg = (i * 60 + offsetAngle) % 360;
      const angleRad = (angleDeg * Math.PI) / 180;
      const r = 35;
      const x = 50 + r * Math.cos(angleRad);
      const y = 50 + r * Math.sin(angleRad);
      pieces.push({
        left: `${x.toFixed(1)}%`,
        top: `${y.toFixed(1)}%`,
        rotate: (angleDeg + toppingIndex * 15) % 360,
        scale: 0.95 + ((i % 3) * 0.08),
      });
    }

    // Middle ring: 4 pieces at r ~ 21%
    for (let i = 0; i < 4; i++) {
      const angleDeg = (i * 90 + offsetAngle + 30) % 360;
      const angleRad = (angleDeg * Math.PI) / 180;
      const r = 21;
      const x = 50 + r * Math.cos(angleRad);
      const y = 50 + r * Math.sin(angleRad);
      pieces.push({
        left: `${x.toFixed(1)}%`,
        top: `${y.toFixed(1)}%`,
        rotate: (angleDeg + 45) % 360,
        scale: 1.0,
      });
    }

    // Inner center: 2 pieces
    const inAngle = (offsetAngle + 45) % 360;
    const inRad = (inAngle * Math.PI) / 180;
    pieces.push({
      left: `${(50 + 8 * Math.cos(inRad)).toFixed(1)}%`,
      top: `${(50 + 8 * Math.sin(inRad)).toFixed(1)}%`,
      rotate: (inAngle + 90) % 360,
      scale: 1.05,
    });
    pieces.push({
      left: `${(50 - 8 * Math.cos(inRad)).toFixed(1)}%`,
      top: `${(50 - 8 * Math.sin(inRad)).toFixed(1)}%`,
      rotate: (inAngle + 270) % 360,
      scale: 0.95,
    });

    return pieces;
  }

  if (mode === 'mitad_mitad') {
    const isLeft = subZone === 1;
    const baseAngles = isLeft
      ? [110, 140, 180, 220, 250, 150, 210]
      : [290, 320, 0, 40, 70, 340, 30];

    const radii = [34, 32, 35, 33, 34, 18, 20];

    return baseAngles.map((deg, idx) => {
      const jitterAngle = (deg + ((toppingIndex * 13) % 25 - 12)) * (Math.PI / 180);
      const r = radii[idx];
      const x = 50 + r * Math.cos(jitterAngle);
      const y = 50 + r * Math.sin(jitterAngle);

      const clampedX = isLeft ? Math.min(44, Math.max(15, x)) : Math.max(56, Math.min(85, x));
      const clampedY = Math.max(16, Math.min(84, y));

      return {
        left: `${clampedX.toFixed(1)}%`,
        top: `${clampedY.toFixed(1)}%`,
        rotate: (deg + toppingIndex * 20) % 360,
        scale: 0.95 + ((idx % 2) * 0.1),
      };
    });
  }

  // Cuartos
  const quadrantCenters = {
    1: { cx: 30, cy: 30 },
    2: { cx: 70, cy: 30 },
    3: { cx: 30, cy: 70 },
    4: { cx: 70, cy: 70 },
  };

  const center = quadrantCenters[subZone] || quadrantCenters[1];
  const qOffsets = [
    { dx: -7, dy: -6 },
    { dx: 7, dy: -5 },
    { dx: -5, dy: 7 },
    { dx: 6, dy: 6 },
    { dx: 0, dy: 0 },
  ];

  return qOffsets.map((offset, idx) => {
    const rot = (idx * 72 + toppingIndex * 40) % 360;
    return {
      left: `${(center.cx + offset.dx).toFixed(1)}%`,
      top: `${(center.cy + offset.dy).toFixed(1)}%`,
      rotate: rot,
      scale: 0.95 + ((idx % 3) * 0.05),
    };
  });
}

export const PizzaBuilder: React.FC<PizzaBuilderProps> = ({
  doughs,
  sauces,
  cheeses,
  toppings,
  onAddToCart,
  initialTemplate,
}) => {
  // Gamified Step Navigation (1 to 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [size, setSize] = useState<PizzaSize>('mediana');
  const [doughId, setDoughId] = useState<string>(initialTemplate?.doughId || 'dough-masamadre');
  const [sauceId, setSauceId] = useState<string>(initialTemplate?.sauceId || 'sauce-sanmarzano');
  const [cheeseId, setCheeseId] = useState<string>(initialTemplate?.cheeseId || 'cheese-bufala');
  const [crustOption, setCrustOption] = useState<'estandar' | 'borde_queso' | 'borde_ajo_parmesano'>('estandar');

  // Divisions & Portions State
  const [division, setDivision] = useState<PizzaDivision>('entera');
  const [activePortionTarget, setActivePortionTarget] = useState<1 | 2 | 3 | 4>(1);

  // Portion toppings lists
  const [portion1Toppings, setPortion1Toppings] = useState<string[]>(
    initialTemplate?.toppings || ['top-salame', 'top-albahaca']
  );
  const [portion2Toppings, setPortion2Toppings] = useState<string[]>(['top-pina', 'top-tocineta']);
  const [portion3Toppings, setPortion3Toppings] = useState<string[]>(['top-jalapeno', 'top-maiz']);
  const [portion4Toppings, setPortion4Toppings] = useState<string[]>(['top-portobello', 'top-albahaca']);

  // Portion titles
  const [portion1Name, setPortion1Name] = useState<string>('Mitad 1: Hawaiana');
  const [portion2Name, setPortion2Name] = useState<string>('Mitad 2: Criolla');
  const [portion3Name, setPortion3Name] = useState<string>('Cuarto C: Mexicana');
  const [portion4Name, setPortion4Name] = useState<string>('Cuarto D: Champiñones');

  // Slice grid visualizer overlay toggle
  const [showSliceGuide, setShowSliceGuide] = useState<boolean>(true);

  // Saved creations from localStorage
  const [savedCreations, setSavedCreations] = useState<SavedCreation[]>([]);
  const [customPizzaName, setCustomPizzaName] = useState<string>('');
  const [isSavingModalOpen, setIsSavingModalOpen] = useState<boolean>(false);

  const [notes, setNotes] = useState('');
  const [toppingCategory, setToppingCategory] = useState<'todas' | 'carnes' | 'vegetales' | 'especiales'>('todas');
  const [justAdded, setJustAdded] = useState(false);

  // Load saved creations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pizzasmart_saved_creations');
      if (stored) {
        setSavedCreations(JSON.parse(stored));
      } else {
        const demoSaved: SavedCreation[] = [
          {
            id: 'saved-carlos-1',
            name: 'La Consentida de Pamplona (Tocineta & Maduritos)',
            date: 'Creación anterior',
            size: 'mediana',
            division: 'entera',
            doughId: 'dough-masamadre',
            sauceId: 'sauce-sanmarzano',
            cheeseId: 'cheese-bufala',
            crustOption: 'borde_queso',
            portion1Toppings: ['top-tocineta', 'top-maduro', 'top-maiz'],
            portion2Toppings: [],
            portion3Toppings: [],
            portion4Toppings: [],
            totalCOP: 47000,
          },
        ];
        setSavedCreations(demoSaved);
        localStorage.setItem('pizzasmart_saved_creations', JSON.stringify(demoSaved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save creation to localStorage
  const handleSaveCurrentRecipe = () => {
    const finalName = customPizzaName.trim() || `Mi Creación Smart #${savedCreations.length + 1}`;
    const newCreation: SavedCreation = {
      id: `saved-${Date.now()}`,
      name: finalName,
      date: new Date().toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
      size,
      division,
      doughId,
      sauceId,
      cheeseId,
      crustOption,
      portion1Toppings,
      portion2Toppings,
      portion3Toppings,
      portion4Toppings,
      portion1Name,
      portion2Name,
      totalCOP: priceCalculation.total,
    };

    const updated = [newCreation, ...savedCreations.slice(0, 7)];
    setSavedCreations(updated);
    try {
      localStorage.setItem('pizzasmart_saved_creations', JSON.stringify(updated));
    } catch {
      // ignore
    }

    toast.success(`¡Receta "${finalName}" guardada en tus creaciones!`);
    setIsSavingModalOpen(false);
    setCustomPizzaName('');
  };

  // Load a saved creation
  const handleLoadSavedCreation = (recipe: SavedCreation) => {
    setSize(recipe.size);
    setDivision(recipe.division);
    setDoughId(recipe.doughId);
    setSauceId(recipe.sauceId);
    setCheeseId(recipe.cheeseId);
    setCrustOption(recipe.crustOption || 'estandar');
    setPortion1Toppings(recipe.portion1Toppings || []);
    setPortion2Toppings(recipe.portion2Toppings || []);
    setPortion3Toppings(recipe.portion3Toppings || []);
    setPortion4Toppings(recipe.portion4Toppings || []);
    if (recipe.portion1Name) setPortion1Name(recipe.portion1Name);
    if (recipe.portion2Name) setPortion2Name(recipe.portion2Name);

    toast.success(`¡Cargada la receta "${recipe.name}" en la mesa!`);
    setCurrentStep(5);
  };

  const handleDeleteSavedCreation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedCreations.filter((c) => c.id !== id);
    setSavedCreations(updated);
    try {
      localStorage.setItem('pizzasmart_saved_creations', JSON.stringify(updated));
    } catch {
      // ignore
    }
    toast.info('Receta eliminada de tu lista.');
  };

  // Current active portion toppings list
  const currentActiveToppings = useMemo(() => {
    if (division === 'entera') return portion1Toppings;
    if (activePortionTarget === 1) return portion1Toppings;
    if (activePortionTarget === 2) return portion2Toppings;
    if (activePortionTarget === 3) return portion3Toppings;
    return portion4Toppings;
  }, [division, activePortionTarget, portion1Toppings, portion2Toppings, portion3Toppings, portion4Toppings]);

  // All unique toppings across the whole pizza for pricing & summary
  const allSelectedToppingsUnique = useMemo(() => {
    if (division === 'entera') return Array.from(new Set(portion1Toppings));
    if (division === 'mitad_mitad') return Array.from(new Set([...portion1Toppings, ...portion2Toppings]));
    return Array.from(new Set([...portion1Toppings, ...portion2Toppings, ...portion3Toppings, ...portion4Toppings]));
  }, [division, portion1Toppings, portion2Toppings, portion3Toppings, portion4Toppings]);

  // Selected object references
  const currentDough = doughs.find((d) => d.id === doughId) || doughs[0];
  const currentSauce = sauces.find((s) => s.id === sauceId) || sauces[0];
  const currentCheese = cheeses.find((c) => c.id === cheeseId) || cheeses[0];

  // Price calculations in COP
  const priceCalculation = useMemo(() => {
    const sizeBaseMap: Record<PizzaSize, number> = {
      personal: 24000,
      mediana: 32000,
      familiar: 46000,
      xl: 58000,
    };
    const basePrice = sizeBaseMap[size] || 32000;
    const doughPrice = currentDough?.priceDelta || 0;
    const saucePrice = currentSauce?.priceDelta || 0;
    const cheesePrice = currentCheese?.priceDelta || 0;

    let crustPrice = 0;
    if (crustOption === 'borde_queso') crustPrice = 7000;
    if (crustOption === 'borde_ajo_parmesano') crustPrice = 5000;

    let toppingsPrice = 0;
    allSelectedToppingsUnique.forEach((topId) => {
      const top = toppings.find((t) => t.id === topId);
      if (top) toppingsPrice += top.price;
    });

    let divisionFee = 0;
    if (division === 'mitad_mitad') divisionFee = 2500;
    if (division === 'cuartos') divisionFee = 4500;

    const total = Math.round(basePrice + doughPrice + saucePrice + cheesePrice + crustPrice + toppingsPrice + divisionFee);

    return {
      basePrice,
      doughPrice,
      saucePrice,
      cheesePrice,
      crustPrice,
      toppingsPrice,
      divisionFee,
      total,
    };
  }, [size, currentDough, currentSauce, currentCheese, crustOption, allSelectedToppingsUnique, toppings, division]);

  // Toggle topping on active portion
  const handleToggleTopping = (topId: string) => {
    const top = toppings.find((t) => t.id === topId);
    const updateList = (prev: string[]) => {
      const exists = prev.includes(topId);
      if (exists) {
        toast.info(`Quitaste ${top?.name || 'ingrediente'}`);
        return prev.filter((id) => id !== topId);
      } else {
        toast.success(`Agregaste ${top?.name || 'ingrediente'}`);
        return [...prev, topId];
      }
    };

    if (division === 'entera') {
      setPortion1Toppings(updateList);
    } else if (activePortionTarget === 1) {
      setPortion1Toppings(updateList);
    } else if (activePortionTarget === 2) {
      setPortion2Toppings(updateList);
    } else if (activePortionTarget === 3) {
      setPortion3Toppings(updateList);
    } else {
      setPortion4Toppings(updateList);
    }
  };

  const handleClearCurrentToppings = () => {
    if (division === 'entera') {
      setPortion1Toppings([]);
    } else if (activePortionTarget === 1) {
      setPortion1Toppings([]);
    } else if (activePortionTarget === 2) {
      setPortion2Toppings([]);
    } else if (activePortionTarget === 3) {
      setPortion3Toppings([]);
    } else {
      setPortion4Toppings([]);
    }
    toast.info('Se limpiaron los ingredientes de esta sección.');
  };

  // Quick Random Pizza ("Sorpréndeme 🎲")
  const handleRandomPizza = () => {
    const randomSize: PizzaSize = 'mediana';
    const randomDough = doughs[Math.floor(Math.random() * doughs.length)]?.id || 'dough-masamadre';
    const randomSauce = sauces[Math.floor(Math.random() * sauces.length)]?.id || 'sauce-sanmarzano';
    const randomCheese = cheeses[Math.floor(Math.random() * cheeses.length)]?.id || 'cheese-bufala';

    const shuffledToppings = [...toppings].sort(() => 0.5 - Math.random());
    const pickedToppings = shuffledToppings.slice(0, 3).map((t) => t.id);

    setSize(randomSize);
    setDoughId(randomDough);
    setSauceId(randomSauce);
    setCheeseId(randomCheese);
    setDivision('entera');
    setPortion1Toppings(pickedToppings);

    toast.success('¡El Maestro Pizzaiolo creó una combinación sorpresa especial!');
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  // Predesigned Popular Combinations (1-Clic)
  const loadPredesignedPizza = (type: 'hawaiana_smart' | 'mexicana_pamplona' | 'criolla_santander' | 'pollo_setas' | 'duo_mitad' | 'cuatro_estaciones') => {
    if (type === 'hawaiana_smart') {
      setDivision('entera');
      setSize('mediana');
      setDoughId('dough-masamadre');
      setSauceId('sauce-sanmarzano');
      setCheeseId('cheese-bufala');
      setCrustOption('borde_queso');
      setPortion1Toppings(['top-cotto', 'top-pina', 'top-maiz']);
      toast.success('¡Cargada la Hawaiana Especial!');
    } else if (type === 'mexicana_pamplona') {
      setDivision('entera');
      setSize('mediana');
      setDoughId('dough-tradicional');
      setSauceId('sauce-piccante');
      setCheeseId('cheese-bufala');
      setCrustOption('estandar');
      setPortion1Toppings(['top-salame', 'top-jalapeno', 'top-maiz']);
      toast.success('¡Cargada la Mexicana Piccantita!');
    } else if (type === 'criolla_santander') {
      setDivision('entera');
      setSize('mediana');
      setDoughId('dough-masamadre');
      setSauceId('sauce-sanmarzano');
      setCheeseId('cheese-doblecrema');
      setCrustOption('borde_ajo_parmesano');
      setPortion1Toppings(['top-tocineta', 'top-maduro', 'top-maiz']);
      toast.success('¡Cargada la Criolla Santandereana!');
    } else if (type === 'pollo_setas') {
      setDivision('entera');
      setSize('mediana');
      setDoughId('dough-masamadre');
      setSauceId('sauce-sanmarzano');
      setCheeseId('cheese-bufala');
      setCrustOption('estandar');
      setPortion1Toppings(['top-pollo', 'top-portobello', 'top-albahaca']);
      toast.success('¡Cargada la Pizza de Pollo con Champiñones!');
    } else if (type === 'duo_mitad') {
      setDivision('mitad_mitad');
      setSize('familiar');
      setPortion1Name('Mitad Hawaiana Especial');
      setPortion2Name('Mitad Mexicana Piccante');
      setDoughId('dough-masamadre');
      setSauceId('sauce-sanmarzano');
      setCheeseId('cheese-bufala');
      setCrustOption('borde_queso');
      setPortion1Toppings(['top-cotto', 'top-pina']);
      setPortion2Toppings(['top-salame', 'top-jalapeno', 'top-maiz']);
      toast.success('¡Cargado el Dúo Mitad Hawaiana + Mitad Mexicana!');
    } else if (type === 'cuatro_estaciones') {
      setDivision('cuartos');
      setSize('familiar');
      setPortion1Name('Q1: Hawaiana');
      setPortion2Name('Q2: Criolla');
      setPortion3Name('Q3: Mexicana');
      setPortion4Name('Q4: Portobello Trufa');
      setDoughId('dough-masamadre');
      setSauceId('sauce-sanmarzano');
      setCheeseId('cheese-bufala');
      setCrustOption('estandar');
      setPortion1Toppings(['top-cotto', 'top-pina']);
      setPortion2Toppings(['top-tocineta', 'top-maduro']);
      setPortion3Toppings(['top-salame', 'top-jalapeno']);
      setPortion4Toppings(['top-portobello', 'top-albahaca']);
      toast.success('¡Cargada la Pizza Cuatro Estaciones Pamplona!');
    }

    setCurrentStep(5);
  };

  const handleAddToCart = () => {
    let nameFormatted = `Pizza Smart Artesanal (${size.toUpperCase()})`;
    if (division === 'mitad_mitad') {
      nameFormatted = `Pizza Mitad y Mitad (${portion1Name} / ${portion2Name})`;
    } else if (division === 'cuartos') {
      nameFormatted = `Pizza Cuatro Estaciones Pamplona (${size.toUpperCase()})`;
    }

    const crustNames: Record<string, string> = {
      estandar: 'Borde Tradicional al Horno',
      borde_queso: 'Borde Relleno de Queso Fundente (+ $7.000 COP)',
      borde_ajo_parmesano: 'Borde Ajo Asado & Parmesano (+ $5.000 COP)',
    };

    const cartItem: CartItem = {
      id: `custom-pizza-${Date.now()}`,
      type: 'custom_pizza',
      name: nameFormatted,
      size,
      price: priceCalculation.total,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      customDetails: {
        doughName: currentDough?.name || 'Masa Madre 72h',
        sauceName: currentSauce?.name || 'San Marzano',
        cheeseName: currentCheese?.name || 'Fior di Latte D.O.P.',
        toppingsList: allSelectedToppingsUnique.map(
          (id) => toppings.find((t) => t.id === id)?.name || id
        ),
        crustName: crustNames[crustOption],
      },
      notes: notes.trim()
        ? `${notes.trim()} | División: ${division}`
        : `División: ${division}`,
    };

    // Auto-save this order into saved creations history
    try {
      const autoSave: SavedCreation = {
        id: `auto-${Date.now()}`,
        name: nameFormatted,
        date: new Date().toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
        size,
        division,
        doughId,
        sauceId,
        cheeseId,
        crustOption,
        portion1Toppings,
        portion2Toppings,
        portion3Toppings,
        portion4Toppings,
        portion1Name,
        portion2Name,
        totalCOP: priceCalculation.total,
      };
      const updated = [autoSave, ...savedCreations.slice(0, 6)];
      setSavedCreations(updated);
      localStorage.setItem('pizzasmart_saved_creations', JSON.stringify(updated));
    } catch {
      // ignore
    }

    onAddToCart(cartItem);

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ea580c', '#dc2626', '#eab308', '#16a34a', '#f97316'],
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2400);
  };

  const filteredToppings = toppings.filter((top) => {
    if (toppingCategory === 'todas') return true;
    return top.category === toppingCategory;
  });

  // Steps Definition for the Gamified Wizard
  const stepsList = [
    { num: 1, title: 'Masa & Tamaño', icon: '🫓' },
    { num: 2, title: 'Salsa', icon: '🍅' },
    { num: 3, title: 'Queso', icon: '🧀' },
    { num: 4, title: 'División', icon: '🍕' },
    { num: 5, title: 'Toppings', icon: '🥓' },
    { num: 6, title: 'Borde & Horno', icon: '🥖' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Gamified Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-950/70 p-5 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold mb-2 shadow-sm">
            <ChefHat className="w-4 h-4 text-orange-400" />
            <span>Taller Interactivo del Maestro Pizzaiolo · PIZZASMART</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Arma tu Pizza en Vivo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
            Toca las opciones para elegirlas. Los botones cambian con colores vivos e indicadores claros de selección al instante.
          </p>
        </div>

        {/* Live Total Badge & Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRandomPizza}
            title="Sorpréndeme con una receta artesanal aleatoria"
            className="p-3 bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Sorpréndeme 🎲</span>
          </button>

          <button
            onClick={() => setIsSavingModalOpen(true)}
            title="Guardar esta receta en mis creaciones favoritas"
            className="p-3 bg-zinc-900 hover:bg-zinc-800 text-orange-300 hover:text-orange-200 border border-orange-500/30 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <BookmarkPlus className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Guardar Receta</span>
          </button>

          <div className="bg-zinc-950 px-4 py-3 rounded-2xl border-2 border-orange-500/40 text-right shadow-inner">
            <span className="text-[10px] text-zinc-400 block font-semibold uppercase tracking-wider">
              Total Actual COP
            </span>
            <span className="text-xl sm:text-2xl font-mono font-black text-orange-400">
              {formatCOP(priceCalculation.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Sugerencias Rápidas Predeterminadas (1-Clic) */}
      <div className="bg-zinc-900/90 p-4 rounded-3xl border border-zinc-800 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Pizzas Sugeridas Rápidas (1 Clic para modelar):</span>
          </span>
          <span className="text-[11px] text-zinc-400 hidden sm:inline">
            Configuran salsa, masa y toppings al instante
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => loadPredesignedPizza('hawaiana_smart')}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-amber-500/30 hover:border-amber-400 text-amber-200 font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🍍 Hawaiana Especial (Piña Caramelizada)</span>
          </button>

          <button
            onClick={() => loadPredesignedPizza('mexicana_pamplona')}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-red-500/30 hover:border-red-400 text-red-200 font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🌶️ Mexicana Pamplona (Jalapeño & Salame)</span>
          </button>

          <button
            onClick={() => loadPredesignedPizza('criolla_santander')}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-yellow-500/30 hover:border-yellow-400 text-yellow-200 font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🇨🇴 Criolla Santandereana (Maduritos & Tocineta)</span>
          </button>

          <button
            onClick={() => loadPredesignedPizza('pollo_setas')}
            className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-orange-500/30 hover:border-orange-400 text-orange-200 font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🍗 Pollo con Champiñones al Ajillo</span>
          </button>

          <button
            onClick={() => loadPredesignedPizza('duo_mitad')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-950/80 to-red-950/80 hover:from-amber-900/80 hover:to-red-900/80 border border-amber-500/40 text-amber-100 font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🌓 Dúo Mitad Hawaiana + Mitad Mexicana</span>
          </button>

          <button
            onClick={() => loadPredesignedPizza('cuatro_estaciones')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 hover:from-purple-900/80 hover:to-indigo-900/80 border border-purple-500/40 text-purple-100 font-bold whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>🍀 Cuatro Estaciones Pamplona (4 Cuartos)</span>
          </button>
        </div>
      </div>

      {/* Mis Creaciones de Veces Anteriores (Historial & Guardadas) */}
      {savedCreations.length > 0 && (
        <div className="bg-zinc-900/70 p-3.5 rounded-2xl border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-orange-400" />
              <span>Mis Creaciones Anteriores ({savedCreations.length}):</span>
            </span>
            <span className="text-[10px] text-zinc-500">Toca para cargar de nuevo</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {savedCreations.map((creation) => (
              <div
                key={creation.id}
                onClick={() => handleLoadSavedCreation(creation)}
                className="group px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-orange-500/50 text-zinc-200 font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                <span className="font-bold text-orange-400">{creation.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">({formatCOP(creation.totalCOP)})</span>
                <button
                  onClick={(e) => handleDeleteSavedCreation(creation.id, e)}
                  title="Eliminar de guardadas"
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity p-0.5"
                >
                  <Trash2 className="w-3 h-3 text-zinc-500 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gamified Sequential Progress Bar Tabs */}
      <div className="bg-zinc-900 p-2.5 rounded-2xl border border-zinc-800 shadow-md">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {stepsList.map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`py-2.5 px-2 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 relative border-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-lg shadow-orange-950/60 scale-[1.03]'
                    : isCompleted
                    ? 'bg-zinc-950 hover:bg-zinc-850 text-emerald-400 border-emerald-500/40'
                    : 'bg-zinc-950/80 hover:bg-zinc-850 text-zinc-400 border-zinc-800'
                }`}
              >
                <div className="flex items-center gap-1 text-xs">
                  <span>{st.icon}</span>
                  <span className="font-bold text-[11px] truncate">{st.title}</span>
                  {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                </div>
                <div className="text-[9px] font-mono opacity-90">Paso {st.num} de 6</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout: Fixed/Sticky Left Visual Pizza & Right Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Sticky Realistic Pizza Disc & Live Summary */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800 shadow-2xl flex flex-col items-center">
            {/* Pizza Canvas Header */}
            <div className="flex items-center justify-between w-full mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs uppercase font-mono tracking-widest text-orange-400 font-bold">
                  Mesa del Pizzaiolo
                </span>
              </div>
              <button
                onClick={() => setShowSliceGuide(!showSliceGuide)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors flex items-center gap-1 ${
                  showSliceGuide
                    ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span>Guía de Cortes</span>
              </button>
            </div>

            {/* REALISTIC PIZZA DISC */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-84 md:h-84 rounded-full p-4 bg-gradient-to-br from-amber-900 via-amber-950 to-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-4 border-amber-600/70 flex items-center justify-center select-none transition-all duration-300">
              {/* Outer Wood-fired Crust */}
              <div
                className="w-full h-full rounded-full flex items-center justify-center relative shadow-inner overflow-hidden"
                style={{
                  backgroundColor:
                    currentDough?.id === 'dough-singluten'
                      ? '#d97706'
                      : currentDough?.id === 'dough-masamadre'
                      ? '#b45309'
                      : '#c2410c',
                  backgroundImage:
                    'radial-gradient(circle at 18% 24%, rgba(69, 26, 3, 0.7) 3%, transparent 4%), radial-gradient(circle at 78% 18%, rgba(69, 26, 3, 0.6) 4%, transparent 5%), radial-gradient(circle at 82% 80%, rgba(69, 26, 3, 0.7) 4%, transparent 5%), radial-gradient(circle at 20% 75%, rgba(69, 26, 3, 0.65) 3.5%, transparent 4.5%), radial-gradient(circle at 50% 92%, rgba(69, 26, 3, 0.8) 3%, transparent 4%)',
                  boxShadow: 'inset 0 0 22px rgba(0,0,0,0.85)',
                }}
              >
                {/* Sauce Layer */}
                <div
                  className="w-[83%] h-[83%] rounded-full relative flex items-center justify-center transition-colors duration-500 shadow-md"
                  style={{
                    backgroundColor: currentSauce?.color || '#dc2626',
                    boxShadow: 'inset 0 0 16px rgba(0,0,0,0.4)',
                  }}
                >
                  {/* Cheese Melt Layer with bubbly toasted accents */}
                  <div
                    className="w-[91%] h-[91%] rounded-full relative overflow-hidden transition-colors duration-500"
                    style={{
                      backgroundColor: currentCheese?.color || '#fffbeb',
                      backgroundImage:
                        'radial-gradient(circle, rgba(245, 158, 11, 0.5) 15%, transparent 18%), radial-gradient(circle, rgba(217, 119, 6, 0.4) 14%, transparent 18%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 10px 10px',
                    }}
                  >
                    {/* Interactive Clickable Halves when in Mitad y Mitad */}
                    {division === 'mitad_mitad' && (
                      <>
                        <div
                          onClick={() => {
                            setActivePortionTarget(1);
                            toast.info(`Editando Mitad 1: ${portion1Name}`);
                          }}
                          className={`absolute inset-y-0 left-0 w-1/2 z-20 cursor-pointer transition-colors ${
                            activePortionTarget === 1
                              ? 'bg-amber-400/15 ring-2 ring-inset ring-amber-400/60'
                              : 'hover:bg-white/5'
                          }`}
                          title="Toca para editar Mitad 1"
                        />
                        <div
                          onClick={() => {
                            setActivePortionTarget(2);
                            toast.info(`Editando Mitad 2: ${portion2Name}`);
                          }}
                          className={`absolute inset-y-0 right-0 w-1/2 z-20 cursor-pointer transition-colors ${
                            activePortionTarget === 2
                              ? 'bg-amber-400/15 ring-2 ring-inset ring-amber-400/60'
                              : 'hover:bg-white/5'
                          }`}
                          title="Toca para editar Mitad 2"
                        />
                      </>
                    )}

                    {/* Visual Division Divider Lines */}
                    {division === 'mitad_mitad' && (
                      <div className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-gradient-to-b from-amber-300 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(251,146,60,1)] z-25 pointer-events-none" />
                    )}

                    {division === 'cuartos' && (
                      <>
                        <div className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-gradient-to-b from-amber-300 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(251,146,60,1)] z-25 pointer-events-none" />
                        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 shadow-[0_0_12px_rgba(251,146,60,1)] z-25 pointer-events-none" />
                      </>
                    )}

                    {/* Slices guide overlay (4, 8, 12 slices) */}
                    {showSliceGuide && (
                      <div className="absolute inset-0 pointer-events-none opacity-25 z-10 flex items-center justify-center">
                        <div className="w-full h-px bg-zinc-900 border-t border-dashed border-zinc-950" />
                        <div className="absolute w-px h-full bg-zinc-900 border-l border-dashed border-zinc-950" />
                        <div className="absolute w-full h-px bg-zinc-900 border-t border-dashed border-zinc-950 rotate-45" />
                        <div className="absolute w-full h-px bg-zinc-900 border-t border-dashed border-zinc-950 -rotate-45" />
                      </div>
                    )}

                    {/* Portion 1 Toppings */}
                    {portion1Toppings.map((topId, topIdx) => {
                      const top = toppings.find((t) => t.id === topId);
                      const coords = getToppingScatterCoordinates(topIdx, division, 1);

                      return coords.map((pos, pIdx) => (
                        <div
                          key={`p1-${topId}-${pIdx}`}
                          className="absolute w-6 h-6 sm:w-7 sm:h-7 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125 z-15 cursor-pointer"
                          style={{
                            top: pos.top,
                            left: pos.left,
                            transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                          }}
                          onClick={() => handleToggleTopping(topId)}
                          title={`${top?.name || topId} (Toca para remover)`}
                        >
                          <ToppingPieceSVG toppingId={topId} name={top?.name} />
                        </div>
                      ));
                    })}

                    {/* Portion 2 Toppings */}
                    {(division === 'mitad_mitad' || division === 'cuartos') &&
                      portion2Toppings.map((topId, topIdx) => {
                        const top = toppings.find((t) => t.id === topId);
                        const coords = getToppingScatterCoordinates(topIdx, division, 2);

                        return coords.map((pos, pIdx) => (
                          <div
                            key={`p2-${topId}-${pIdx}`}
                            className="absolute w-6 h-6 sm:w-7 sm:h-7 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125 z-15 cursor-pointer"
                            style={{
                              top: pos.top,
                              left: pos.left,
                              transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                            }}
                            onClick={() => handleToggleTopping(topId)}
                            title={`${top?.name || topId} (Toca para remover)`}
                          >
                            <ToppingPieceSVG toppingId={topId} name={top?.name} />
                          </div>
                        ));
                      })}

                    {/* Portion 3 Toppings */}
                    {division === 'cuartos' &&
                      portion3Toppings.map((topId, topIdx) => {
                        const top = toppings.find((t) => t.id === topId);
                        const coords = getToppingScatterCoordinates(topIdx, division, 3);

                        return coords.map((pos, pIdx) => (
                          <div
                            key={`p3-${topId}-${pIdx}`}
                            className="absolute w-6 h-6 sm:w-7 sm:h-7 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125 z-15 cursor-pointer"
                            style={{
                              top: pos.top,
                              left: pos.left,
                              transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                            }}
                            onClick={() => handleToggleTopping(topId)}
                            title={`${top?.name || topId} (Toca para remover)`}
                          >
                            <ToppingPieceSVG toppingId={topId} name={top?.name} />
                          </div>
                        ));
                      })}

                    {/* Portion 4 Toppings */}
                    {division === 'cuartos' &&
                      portion4Toppings.map((topId, topIdx) => {
                        const top = toppings.find((t) => t.id === topId);
                        const coords = getToppingScatterCoordinates(topIdx, division, 4);

                        return coords.map((pos, pIdx) => (
                          <div
                            key={`p4-${topId}-${pIdx}`}
                            className="absolute w-6 h-6 sm:w-7 sm:h-7 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-125 z-15 cursor-pointer"
                            style={{
                              top: pos.top,
                              left: pos.left,
                              transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
                            }}
                            onClick={() => handleToggleTopping(topId)}
                            title={`${top?.name || topId} (Toca para remover)`}
                          >
                            <ToppingPieceSVG toppingId={topId} name={top?.name} />
                          </div>
                        ));
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Division Switcher Bar when split */}
            {division !== 'entera' && (
              <div className="w-full mt-4 bg-zinc-950 p-3 rounded-2xl border-2 border-amber-500/40 space-y-1.5 shadow-lg">
                <span className="text-[10px] uppercase font-black text-amber-300 block tracking-wider">
                  🎯 Sección Activa en el Horno:
                </span>
                <div className={`grid ${division === 'mitad_mitad' ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                  <button
                    onClick={() => {
                      setActivePortionTarget(1);
                      toast.info(`Editando Mitad 1: ${portion1Name}`);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center ${
                      activePortionTarget === 1
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-2 ring-orange-500/50 shadow-md scale-[1.02]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{portion1Name}</span>
                    <span className="text-[9px] font-mono opacity-80">({portion1Toppings.length} tops)</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivePortionTarget(2);
                      toast.info(`Editando Mitad 2: ${portion2Name}`);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center ${
                      activePortionTarget === 2
                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-2 ring-orange-500/50 shadow-md scale-[1.02]'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{portion2Name}</span>
                    <span className="text-[9px] font-mono opacity-80">({portion2Toppings.length} tops)</span>
                  </button>
                  {division === 'cuartos' && (
                    <>
                      <button
                        onClick={() => setActivePortionTarget(3)}
                        className={`py-2 px-2 rounded-xl text-xs font-black transition-all border-2 ${
                          activePortionTarget === 3
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-2 ring-orange-500/50 shadow-md'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {portion3Name}
                      </button>
                      <button
                        onClick={() => setActivePortionTarget(4)}
                        className={`py-2 px-2 rounded-xl text-xs font-black transition-all border-2 ${
                          activePortionTarget === 4
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-2 ring-orange-500/50 shadow-md'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {portion4Name}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Live Specs Legend */}
            <div className="w-full mt-4 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-zinc-300 py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Tamaño:</span>
                <span className="font-bold text-white capitalize">
                  {size === 'personal'
                    ? 'Personal (25cm · 4 porciones)'
                    : size === 'mediana'
                    ? 'Mediana (33cm · 8 porciones)'
                    : size === 'familiar'
                    ? 'Familiar (40cm · 12 porciones)'
                    : 'Fiesta XL (45cm · 16 porciones)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Base:</span>
                <span className="font-bold text-white truncate max-w-[200px]">
                  {currentDough?.name} + {currentSauce?.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Queso & Borde:</span>
                <span className="font-bold text-white truncate max-w-[200px]">
                  {currentCheese?.name}
                  {crustOption !== 'estandar' && ' · Borde Relleno'}
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 py-1">
                <span className="text-zinc-400">Ingredientes ({allSelectedToppingsUnique.length}):</span>
                <span className="font-bold text-orange-400 truncate max-w-[200px]">
                  {allSelectedToppingsUnique.length === 0
                    ? 'Solo Queso Clásico'
                    : allSelectedToppingsUnique
                        .map((id) => toppings.find((t) => t.id === id)?.name || id)
                        .join(', ')}
                </span>
              </div>
            </div>

            {/* Big Celebratory Add-To-Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full mt-5 py-3.5 px-6 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl transition-all duration-300 ${
                justAdded
                  ? 'bg-emerald-600 scale-95'
                  : 'bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 hover:shadow-orange-950/60 active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-5 h-5 animate-bounce stroke-[3]" />
                  <span>¡Pizza Agregada al Pedido!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Pedir Esta Pizza · {formatCOP(priceCalculation.total)}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Step Controls (Gamified Sections) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Masa & Tamaño */}
          {currentStep === 1 && (
            <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                    Paso 1 de 6 · Base de la Pizza
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Elige el Tamaño y la Masa Artesanal
                  </h3>
                </div>
                <span className="text-2xl">🫓</span>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">1.1 Tamaño & Porciones:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'personal' as PizzaSize, label: 'Personal 25cm', slices: '4 porciones', base: 24000 },
                    { id: 'mediana' as PizzaSize, label: 'Mediana 33cm', slices: '8 porciones', base: 32000 },
                    { id: 'familiar' as PizzaSize, label: 'Familiar 40cm', slices: '12 porciones', base: 46000 },
                    { id: 'xl' as PizzaSize, label: 'Fiesta XL 45cm', slices: '16 porciones', base: 58000 },
                  ].map((sz) => {
                    const isSelected = size === sz.id;
                    return (
                      <button
                        key={sz.id}
                        onClick={() => {
                          setSize(sz.id);
                          toast.success(`Tamaño cambiado a ${sz.label}`);
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-xl shadow-orange-950/70 scale-[1.03]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{sz.label}</span>
                          {isSelected ? (
                            <span className="inline-flex items-center gap-0.5 bg-white text-orange-700 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-3 h-3 rounded-full border border-zinc-700" />
                          )}
                        </div>
                        <div className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-zinc-500'}`}>
                          {sz.slices}
                        </div>
                        <div className={`text-xs font-mono font-bold mt-1.5 ${isSelected ? 'text-white' : 'text-orange-400'}`}>
                          {formatCOP(sz.base)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dough options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">1.2 Tipo de Masa & Fermentación:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {doughs.map((d) => {
                    const isSelected = doughId === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => {
                          setDoughId(d.id);
                          toast.success(`Masa cambiada a ${d.name}`);
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-xl shadow-orange-950/70 scale-[1.02]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{d.name}</span>
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 bg-white text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                              <Check className="w-3 h-3 stroke-[3]" /> Activa
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-mono">
                              {d.fermentationHours}h levado
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-zinc-400'}`}>
                          {d.description}
                        </p>
                        <div className={`text-xs font-mono mt-1.5 font-bold ${isSelected ? 'text-white' : 'text-orange-400'}`}>
                          {d.priceDelta === 0 ? 'Sin costo adicional' : `+${formatCOP(d.priceDelta)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Salsa Artesanal */}
          {currentStep === 2 && (
            <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                    Paso 2 de 6 · Salsa de la Casa
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Elige la Salsa Artesanal Base
                  </h3>
                </div>
                <span className="text-2xl">🍅</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sauces.map((s) => {
                  const isSelected = sauceId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSauceId(s.id);
                        toast.success(`Salsa cambiada a ${s.name}`);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-xl shadow-orange-950/70 scale-[1.02]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-white/40 shrink-0 shadow-sm"
                            style={{ backgroundColor: s.color }}
                          />
                          <span className="font-bold text-xs">{s.name}</span>
                        </div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 bg-white text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-zinc-400'}`}>
                        {s.description}
                      </p>
                      <div className={`text-xs font-mono mt-1.5 font-bold ${isSelected ? 'text-white' : 'text-orange-400'}`}>
                        {s.priceDelta === 0 ? 'Incluida en la base' : `+${formatCOP(s.priceDelta)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Quesos Fundentes */}
          {currentStep === 3 && (
            <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                    Paso 3 de 6 · Fundente & Cremoso
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Selecciona el Queso Fundente
                  </h3>
                </div>
                <span className="text-2xl">🧀</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cheeses.map((c) => {
                  const isSelected = cheeseId === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCheeseId(c.id);
                        toast.success(`Queso cambiado a ${c.name}`);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-xl shadow-orange-950/70 scale-[1.02]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{c.name}</span>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 bg-white text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                            <Check className="w-3 h-3 stroke-[3]" /> Activo
                          </span>
                        ) : c.isVegan ? (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                            Vegano
                          </span>
                        ) : null}
                      </div>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-zinc-400'}`}>
                        {c.description}
                      </p>
                      <div className={`text-xs font-mono mt-1.5 font-bold ${isSelected ? 'text-white' : 'text-orange-400'}`}>
                        {c.priceDelta === 0 ? 'Incluido en la base' : `+${formatCOP(c.priceDelta)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: División & Mitades */}
          {currentStep === 4 && (
            <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                    Paso 4 de 6 · Porciones & Combinación
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    ¿Quieres una pizza de un solo sabor o combinada?
                  </h3>
                </div>
                <span className="text-2xl">🍕</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'entera' as PizzaDivision,
                    title: '🍕 Entera Tradicional',
                    desc: 'Mismo sabor uniforme en el 100% de la pizza.',
                    extra: 'Sin recargo',
                  },
                  {
                    id: 'mitad_mitad' as PizzaDivision,
                    title: '🌓 Mitad y Mitad',
                    desc: '2 sabores diferentes divididos al centro en tiempo real.',
                    extra: '+ $2.500 COP',
                  },
                  {
                    id: 'cuartos' as PizzaDivision,
                    title: '🍀 Cuatro Estaciones',
                    desc: '4 cuadrantes con ingredientes totalmente independientes.',
                    extra: '+ $4.500 COP',
                  },
                ].map((divOpt) => {
                  const isSelected = division === divOpt.id;
                  return (
                    <button
                      key={divOpt.id}
                      onClick={() => {
                        setDivision(divOpt.id);
                        toast.success(`Modo de división: ${divOpt.title}`);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-xl shadow-orange-950/70 scale-[1.02]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-sm">{divOpt.title}</div>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 bg-white text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                            <Check className="w-3 h-3 stroke-[3]" /> Activo
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 ${isSelected ? 'text-amber-100' : 'text-zinc-400'}`}>
                        {divOpt.desc}
                      </p>
                      <div className={`text-xs font-mono mt-2 font-bold ${isSelected ? 'text-white' : 'text-amber-400'}`}>
                        {divOpt.extra}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Nombres personalizados para las mitades */}
              {division === 'mitad_mitad' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-3">
                  <span className="text-xs font-bold text-zinc-300 block">
                    Nombra tus dos mitades (Opcional):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Nombre Mitad 1:</label>
                      <input
                        type="text"
                        value={portion1Name}
                        onChange={(e) => setPortion1Name(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        placeholder="Ej. Mitad 1: Hawaiana"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Nombre Mitad 2:</label>
                      <input
                        type="text"
                        value={portion2Name}
                        onChange={(e) => setPortion2Name(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                        placeholder="Ej. Mitad 2: Criolla"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Toppings & Ingredientes Uniformes */}
          {currentStep === 5 && (
            <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                    Paso 5 de 6 · Taller de Ingredientes
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {division === 'entera'
                      ? 'Agrega Toppings a Toda la Pizza'
                      : `Agregando a: ${activePortionTarget === 1 ? portion1Name : activePortionTarget === 2 ? portion2Name : activePortionTarget === 3 ? portion3Name : portion4Name}`}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Toca cualquier ingrediente para ponerlo o quitarlo. La gráfica genera una distribución uniforme realista.
                  </p>
                </div>
                {currentActiveToppings.length > 0 && (
                  <button
                    onClick={handleClearCurrentToppings}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 bg-red-950/40 border border-red-900/60 px-3 py-1.5 rounded-xl transition-colors font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpiar ({currentActiveToppings.length})</span>
                  </button>
                )}
              </div>

              {/* HIGH-VISIBILITY PORTION SWITCHER INSIDE STEP 5 */}
              {division !== 'entera' && (
                <div className="p-4 bg-zinc-950 rounded-2xl border-2 border-amber-500/40 shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-400" />
                      Elige a qué mitad estás agregando ingredientes:
                    </span>
                    <span className="text-[10px] text-zinc-400">Toca para cambiar</span>
                  </div>

                  <div className={`grid ${division === 'mitad_mitad' ? 'grid-cols-2' : 'grid-cols-4'} gap-2`}>
                    <button
                      onClick={() => {
                        setActivePortionTarget(1);
                        toast.info(`Cambiado a ${portion1Name}`);
                      }}
                      className={`p-3 rounded-xl font-black text-xs transition-all border-2 flex flex-col items-center justify-center gap-0.5 ${
                        activePortionTarget === 1
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-4 ring-orange-500/50 shadow-xl scale-[1.02]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span>🌓 {portion1Name}</span>
                      <span className="text-[10px] font-mono opacity-85">
                        {portion1Toppings.length} ingredientes puestos
                      </span>
                      {activePortionTarget === 1 && (
                        <span className="mt-1 bg-white text-orange-700 text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                          ✓ EDITANDO ESTA MITAD
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActivePortionTarget(2);
                        toast.info(`Cambiado a ${portion2Name}`);
                      }}
                      className={`p-3 rounded-xl font-black text-xs transition-all border-2 flex flex-col items-center justify-center gap-0.5 ${
                        activePortionTarget === 2
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-4 ring-orange-500/50 shadow-xl scale-[1.02]'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span>🌓 {portion2Name}</span>
                      <span className="text-[10px] font-mono opacity-85">
                        {portion2Toppings.length} ingredientes puestos
                      </span>
                      {activePortionTarget === 2 && (
                        <span className="mt-1 bg-white text-orange-700 text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                          ✓ EDITANDO ESTA MITAD
                        </span>
                      )}
                    </button>

                    {division === 'cuartos' && (
                      <>
                        <button
                          onClick={() => setActivePortionTarget(3)}
                          className={`p-3 rounded-xl font-black text-xs transition-all border-2 flex flex-col items-center justify-center gap-0.5 ${
                            activePortionTarget === 3
                              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-4 ring-orange-500/50 shadow-xl'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>{portion3Name}</span>
                          <span className="text-[10px] font-mono">({portion3Toppings.length} tops)</span>
                        </button>
                        <button
                          onClick={() => setActivePortionTarget(4)}
                          className={`p-3 rounded-xl font-black text-xs transition-all border-2 flex flex-col items-center justify-center gap-0.5 ${
                            activePortionTarget === 4
                              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-300 ring-4 ring-orange-500/50 shadow-xl'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span>{portion4Name}</span>
                          <span className="text-[10px] font-mono">({portion4Toppings.length} tops)</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                {(['todas', 'carnes', 'vegetales', 'especiales'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setToppingCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors ${
                      toppingCategory === cat
                        ? 'bg-orange-600 text-white font-bold shadow'
                        : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat === 'todas'
                      ? '🌟 Todos los Toppings'
                      : cat === 'carnes'
                      ? '🥩 Carnes & Embutidos'
                      : cat === 'vegetales'
                      ? '🥗 Huerta & Vegetales'
                      : '🍍 Sabor Colombiano & Especiales'}
                  </button>
                ))}
              </div>

              {/* Toppings Grid with Live High-Contrast Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredToppings.map((top) => {
                  const isSelected = currentActiveToppings.includes(top.id);
                  return (
                    <button
                      key={top.id}
                      onClick={() => handleToggleTopping(top.id)}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between select-none active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-bold border-amber-300 ring-2 ring-orange-400/50 shadow-lg scale-[1.02]'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        <div className="w-7 h-7 shrink-0">
                          <ToppingPieceSVG toppingId={top.id} name={top.name} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{top.name}</div>
                          <div className={`text-[10px] font-mono font-semibold ${isSelected ? 'text-amber-100' : 'text-orange-400'}`}>
                            +{formatCOP(top.price)}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-white text-orange-700 border-white font-black'
                            : 'bg-zinc-900 border-zinc-800 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Borde Relleno & Notas al Horno */}
          {currentStep === 6 && (
            <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
                    Paso 6 de 6 · Toque Final del Horno
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    Borde Relleno (Crust) & Especificaciones
                  </h3>
                </div>
                <span className="text-2xl">🥖</span>
              </div>

              {/* Crust options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">Borde de la Masa:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'estandar', label: 'Borde Tradicional', price: 0, sub: 'Crujiente y aireado' },
                    { id: 'borde_queso', label: 'Relleno de Queso Fundente', price: 7000, sub: 'Borde repleto de mozzarella caliente' },
                    { id: 'borde_ajo_parmesano', label: 'Ajo Asado & Parmesano', price: 5000, sub: 'Glaseado aromático artesanal' },
                  ].map((c) => {
                    const isSelected = crustOption === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCrustOption(c.id as any);
                          toast.success(`Borde cambiado a ${c.label}`);
                        }}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black border-amber-300 ring-4 ring-orange-500/40 shadow-xl shadow-orange-950/70 scale-[1.02]'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs">{c.label}</div>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 bg-white text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                              <Check className="w-3 h-3 stroke-[3]" /> Activo
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-amber-100' : 'text-zinc-500'}`}>
                          {c.sub}
                        </div>
                        <div className={`text-xs font-mono mt-1 font-bold ${isSelected ? 'text-white' : 'text-orange-400'}`}>
                          {c.price === 0 ? 'Sin costo' : `+${formatCOP(c.price)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes to the oven */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 block">
                  Instrucciones especiales para el pizzaiolo:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Masa bien tostada, cortar en 8 porciones iguales, salsa extra al centro..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none h-20"
                />
              </div>
            </div>
          )}

          {/* Gamified Step Navigation Buttons (Prev / Next) */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                currentStep === 1
                  ? 'opacity-40 cursor-not-allowed text-zinc-600 bg-zinc-950'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Etapa Anterior</span>
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white flex items-center gap-2 shadow-lg shadow-orange-950/40 active:scale-95 transition-all"
              >
                <span>Siguiente: {stepsList[currentStep]?.title || 'Paso'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>¡Listo! Agregar al Carrito</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save Recipe Modal */}
      {isSavingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono font-bold text-orange-400">
                Guardar Creación
              </span>
              <button
                onClick={() => setIsSavingModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-white">Guarda esta Pizza en tus Favoritas</h3>
            <p className="text-xs text-zinc-400">
              Podrás reordenarla en cualquier momento con un solo clic desde la barra superior.
            </p>

            <input
              type="text"
              value={customPizzaName}
              onChange={(e) => setCustomPizzaName(e.target.value)}
              placeholder="Ej. La Especial de Viernes"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500"
              autoFocus
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSavingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCurrentRecipe}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-md"
              >
                Guardar Receta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
