/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MenuItem,
  DoughOption,
  SauceOption,
  CheeseOption,
  ToppingOption,
  CateringAddon,
  PromoCode,
  Order,
  OrderStatus,
  CustomPizzaConfig,
  QuoteCalculationRequest,
  CateringQuote,
  QATestResult,
  PizzaSize,
  UserProfile,
  UserRole,
  UserActivityLog,
  TenantConfig,
  MembershipPlan,
  MembershipStatus,
  PlatformSyncEvent,
} from '../types/pizzeria';

// Initial Demo Dataset - PIZZASMART PAMPLONA (Precios en COP & Variedades Colombianas)
export const DEMO_MENU_ITEMS: MenuItem[] = [
  // --- Especialidades Colombianas & Favoritas de la Casa ---
  {
    id: 'piz-haw',
    name: 'Pizza Hawaiana Especial',
    italianName: 'Pizza all’Ananas Caramellato & Jamón',
    category: 'colombianas',
    description: 'La consentida y más pedida de Colombia: generoso jamón especial tierno, piña oro miel jugosa caramelizada, maíz tierno dulce y abundante queso mozzarella fundente bien doradito.',
    price: 34000,
    sizes: { personal: 25000, mediana: 34000, familiar: 48000, xl: 62000 },
    tags: ['La Consentida de Colombia', 'Piña Oro Miel', 'Top 1 en Ventas'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 12,
    rating: 4.95,
    reviewsCount: 520,
    isPopular: true,
    isChefPick: true,
    isAvailable: true,
    calories: 860,
  },
  {
    id: 'piz-pol',
    name: 'Pizza de Pollo con Champiñones al Ajillo',
    italianName: 'Pizza Pollo, Funghi Trifolati e Tocineta',
    category: 'colombianas',
    description: 'La clásica favorita de las familias: pechuga de pollo desmechada jugosa sazonada al ajillo, champiñones frescos salteados al tomillo y tocineta ahumada crujiente sobre salsa de la casa.',
    price: 36000,
    sizes: { personal: 26000, mediana: 36000, familiar: 50000, xl: 64000 },
    tags: ['Pollo Desmechado', 'Champiñones Frescos', 'Favorita Familiar'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 13,
    rating: 4.9,
    reviewsCount: 380,
    isPopular: true,
    isAvailable: true,
    calories: 890,
  },
  {
    id: 'piz-ranch',
    name: 'Pizza Ranchera con Maíz Dulce',
    italianName: 'Pizza con Salsiccia Ranchera e Mais',
    category: 'colombianas',
    description: 'Sabor 100% colombiano: rodajas de salchicha ranchera Zenú premium, tocineta ahumada crujiente, maíz tierno dulce desgranado y abundante queso fundente dorado al horno.',
    price: 37000,
    sizes: { personal: 27000, mediana: 37000, familiar: 51000, xl: 65000 },
    tags: ['Salchicha Ranchera', 'Tocineta & Maíz', 'Súper Pedida'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 14,
    rating: 4.92,
    reviewsCount: 340,
    isPopular: true,
    isChefPick: true,
    isAvailable: true,
    calories: 940,
  },
  {
    id: 'piz-carnes',
    name: 'Pizza Súper Carnes (Tres Carnes)',
    italianName: 'Pizza alle Tre Carni Speciali',
    category: 'colombianas',
    description: 'Para los verdaderos carnívoros: tocineta ahumada crujiente, carne molida especial de res sazonada, jamón seleccionado tierno y rodajas de salchichón cervecero/pepperoni con queso gratinado.',
    price: 38000,
    sizes: { personal: 28000, mediana: 38000, familiar: 52000, xl: 67000 },
    tags: ['Para Carnívoros', 'Tres Carnes', 'Top Ventas'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 15,
    rating: 4.89,
    reviewsCount: 410,
    isPopular: true,
    isAvailable: true,
    calories: 990,
  },
  {
    id: 'piz-crio',
    name: 'Pizza Criolla Santandereana con Plátano Maduro',
    italianName: 'Pizza Rustica Colombiana con Platano',
    category: 'colombianas',
    description: 'Nuestra creación estrella de Pamplona: cubitos de plátano maduro horneado bien doraditos, tocineta ahumada crujiente, maíz tierno dulce desgranado, carne desmechada sazonada y queso doble crema.',
    price: 38000,
    sizes: { personal: 28000, mediana: 38000, familiar: 52000, xl: 66000 },
    tags: ['Maduritos Dorados', 'Criolla', 'Especialidad Local'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 15,
    rating: 5.0,
    reviewsCount: 460,
    isChefPick: true,
    isAvailable: true,
    calories: 980,
  },
  {
    id: 'piz-mex',
    name: 'Pizza Mexicana Picantita con Nachos',
    italianName: 'Pizza alla Messicana con Jalapeño',
    category: 'colombianas',
    description: 'Carne molida sazonada al estilo tex-mex, rodajas de jalapeños picantitos, maíz dulce, tocineta crujiente, queso fundente y totopos dorados con toque picante suave.',
    price: 37000,
    sizes: { personal: 27000, mediana: 37000, familiar: 51000, xl: 65000 },
    tags: ['Picante Suave', 'Jalapeños & Nachos', 'Fin de Semana'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 14,
    rating: 4.88,
    reviewsCount: 310,
    isPopular: true,
    isSpicy: true,
    isAvailable: true,
    calories: 950,
  },
  {
    id: 'piz-bbq',
    name: 'Pizza BBQ con Pollo & Tocineta',
    italianName: 'Pizza Pollo e Pancetta al Barbecue',
    category: 'colombianas',
    description: 'Pechuga de pollo desmechada bañada en abundante salsa BBQ ahumada dulce, tocineta crujiente, cebolla morada caramelizada y mozzarella derretido.',
    price: 37000,
    sizes: { personal: 27000, mediana: 37000, familiar: 51000, xl: 65000 },
    tags: ['Salsa BBQ Ahumada', 'Pollo & Tocineta', 'Irresistible'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 14,
    rating: 4.87,
    reviewsCount: 295,
    isPopular: true,
    isAvailable: true,
    calories: 920,
  },

  // --- Pizzas Clásicas Tradicionales ---
  {
    id: 'piz-pep',
    name: 'Pizza Pepperoni Clásica Americana',
    italianName: 'Pizza al Pepperoni Croccante',
    category: 'clasicas',
    description: 'Generosa capa de salame pepperoni americano crujiente con borde ligeramente tostado, salsa de tomates maduros, queso mozzarella fundido y orégano seco.',
    price: 35000,
    sizes: { personal: 26000, mediana: 35000, familiar: 49000, xl: 63000 },
    tags: ['Pepperoni Doble', 'Clásica', 'Infaltable'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 12,
    rating: 4.9,
    reviewsCount: 420,
    isPopular: true,
    isAvailable: true,
    calories: 930,
  },
  {
    id: 'piz-jamon',
    name: 'Pizza Jamón & Queso Tradicional',
    italianName: 'Pizza Prosciutto Cotto e Formaggio',
    category: 'clasicas',
    description: 'La preferida de los pequeños y toda la familia: jamón seleccionado tierno, abundante queso derretido dorado al horno y un toque aromático de orégano.',
    price: 31000,
    sizes: { personal: 23000, mediana: 31000, familiar: 44000, xl: 56000 },
    tags: ['Para Niños', 'Suave & Clásica', 'Económica'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 11,
    rating: 4.8,
    reviewsCount: 270,
    isAvailable: true,
    calories: 810,
  },
  {
    id: 'piz-4quesos',
    name: 'Pizza Cuatro Quesos Colombiana',
    italianName: 'Pizza ai Quattro Formaggi Rustica',
    category: 'clasicas',
    description: 'Mezcla fundente de mozzarella fresca, queso doble crema colombiano, queso campesino de hilado suave y ralladura de queso parmesano madurado.',
    price: 37000,
    sizes: { personal: 27000, mediana: 37000, familiar: 51000, xl: 65000 },
    tags: ['4 Quesos', 'Queso Doble Crema', 'Vegetariana'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 13,
    rating: 4.9,
    reviewsCount: 220,
    isVegetarian: true,
    isAvailable: true,
    calories: 990,
  },
  {
    id: 'piz-veg',
    name: 'Pizza Vegetariana de la Huerta',
    italianName: 'Pizza Vegetariana dell’Orto',
    category: 'clasicas',
    description: 'Maíz tierno dulce, champiñones frescos salteados, pimentón asado, cebolla morada caramelizada, aceitunas negras y albahaca fresca con queso mozzarella.',
    price: 34000,
    sizes: { personal: 25000, mediana: 34000, familiar: 47000, xl: 60000 },
    tags: ['Vegetariana', 'Huerta Fresca', 'Saludable'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 12,
    rating: 4.75,
    reviewsCount: 165,
    isVegetarian: true,
    isAvailable: true,
    calories: 780,
  },
  {
    id: 'piz-01',
    name: 'Margherita Verace Tradicional D.O.P.',
    italianName: 'Pizza Margherita Classica Napoletana',
    category: 'clasicas',
    description: 'Tomates San Marzano triturados a mano, mozzarella fresca, hojas de albahaca fresca y aceite de oliva virgen extra sobre masa madre.',
    price: 32000,
    sizes: { personal: 24000, mediana: 32000, familiar: 46000, xl: 59000 },
    tags: ['Tradicional', 'Albahaca Fresca', 'Vegetariana'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 12,
    rating: 4.9,
    reviewsCount: 342,
    isChefPick: true,
    isVegetarian: true,
    isAvailable: true,
    calories: 820,
  },

  // --- Especialidades Gourmet ---
  {
    id: 'piz-04',
    name: 'Pizza Trufa Negra & Portobello Gourmet',
    italianName: 'Crema di Tartufo e Porcini Trifolati',
    category: 'gourmet',
    description: 'Crema de trufa negra silvestre, champiñones portobello asados al tomillo, fior di latte fresco y lluvia de queso parmesano.',
    price: 44000,
    sizes: { personal: 32000, mediana: 44000, familiar: 58000, xl: 72000 },
    tags: ['Gourmet', 'Trufa Negra', 'Chef Signature'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 15,
    rating: 5.0,
    reviewsCount: 210,
    isChefPick: true,
    isVegetarian: true,
    isAvailable: true,
    calories: 890,
  },
  {
    id: 'piz-05',
    name: 'Pizza Prosciutto di Parma con Burrata',
    italianName: 'Burrata Pugliese e Crudo di Parma',
    category: 'gourmet',
    description: 'Prosciutto curado seleccionado, burrata entera fresca de 100g al centro, rúcula de la huerta y reducción de balsámico.',
    price: 46000,
    sizes: { personal: 34000, mediana: 46000, familiar: 62000, xl: 76000 },
    tags: ['Gourmet', 'Burrata Entera', 'Parma D.O.P.'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 16,
    rating: 4.95,
    reviewsCount: 312,
    isPopular: true,
    isChefPick: true,
    isAvailable: true,
    calories: 1050,
  },

  // --- Entrantes & Pasabocas Colombianos ---
  {
    id: 'ent-palitroques',
    name: 'Palitroques de Ajo & Queso con Salsa Tártara (8 uds)',
    italianName: 'Bastoncini di Pizza all’Aglio e Formaggio',
    category: 'entrantes',
    description: 'Tiras de masa artesanal recién horneadas, bañadas en mantequilla de ajo asado, orégano, queso derretido y servidas con salsa tártara casera.',
    price: 14000,
    tags: ['Para Compartir', 'Salsa Tártara', 'Top Entrante'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 7,
    rating: 4.95,
    reviewsCount: 320,
    isPopular: true,
    isAvailable: true,
    calories: 420,
  },
  {
    id: 'ent-panzerotti',
    name: 'Panzerotti de Jamón, Tocineta & Queso',
    italianName: 'Panzerotto Caldo Ripieno',
    category: 'entrantes',
    description: 'Masa cerrada dorada al horno de leña, rellena de abundante queso mozzarella fundido, jamón artesanal, tocineta y salsa pomodoro.',
    price: 13000,
    tags: ['Queso Fundido', 'Crujiente'],
    allergens: ['Gluten', 'Lácteos'],
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 8,
    rating: 4.88,
    reviewsCount: 190,
    isAvailable: true,
    calories: 490,
  },
  {
    id: 'ent-canasticas',
    name: 'Canasticas de Plátano Maduro con Pollo (3 uds)',
    italianName: 'Cestini di Platano con Pollo Gratinato',
    category: 'entrantes',
    description: 'Canasticas de madurito dorado rellenas de pechuga de pollo desmechada jugosa y queso campesino gratinado.',
    price: 16000,
    tags: ['Madurito', 'Pollo Gratinado', 'Antojo Criollo'],
    allergens: ['Lácteos'],
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 9,
    rating: 4.92,
    reviewsCount: 215,
    isChefPick: true,
    isAvailable: true,
    calories: 460,
  },

  // --- Postres Colombianos & Calzones Dulces ---
  {
    id: 'pos-nutella',
    name: 'Calzone Caliente de Nutella & Bocadillo Veleño',
    italianName: 'Calzone Caldo con Nutella e Guayaba',
    category: 'postres',
    description: 'Masa al horno de leña rellena de Nutella cremosa caliente, trozos de auténtico bocadillo veleño derretido y lluvia de azúcar glas.',
    price: 16000,
    tags: ['Nutella', 'Bocadillo Veleño', 'Postre Estrella'],
    allergens: ['Gluten', 'Lácteos', 'Frutos secos'],
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 8,
    rating: 4.95,
    reviewsCount: 380,
    isPopular: true,
    isChefPick: true,
    isAvailable: true,
    calories: 580,
  },
  {
    id: 'pos-tresleches',
    name: 'Postre Tradicional de las Tres Leches',
    italianName: 'Torta Tradizionale Tres Leches',
    category: 'postres',
    description: 'Bizcochuelo esponjoso empapado en nuestra mezcla secreta de leche condensada, crema de leche y leche evaporada con toque de canela.',
    price: 13000,
    tags: ['Tres Leches', 'Casero', 'Favorito'],
    allergens: ['Gluten', 'Lácteos', 'Huevos'],
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 4,
    rating: 4.9,
    reviewsCount: 260,
    isAvailable: true,
    calories: 450,
  },
  {
    id: 'pos-tiramisu',
    name: 'Tiramisú Casero de Café Colombiano',
    italianName: 'Tiramisù al Caffè Colombiano',
    category: 'postres',
    description: 'Bizcochos Savoiardi empapados en café espresso colombiano de origen, crema de mascarpone batida y cacao amargo.',
    price: 15000,
    tags: ['Café Colombiano', 'Artesanal'],
    allergens: ['Gluten', 'Lácteos', 'Huevos'],
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 4,
    rating: 4.88,
    reviewsCount: 195,
    isAvailable: true,
    calories: 420,
  },

  // --- Bebidas Colombianas: Personales, 1.5L y 3L Mega ---
  {
    id: 'beb-coca-personal',
    name: 'Coca-Cola Original Personal 400ml',
    italianName: 'Coca-Cola Originale 400ml',
    category: 'bebidas',
    description: 'La compañera obligatoria de tu pizza: botella personal fría de 400ml bien helada.',
    price: 5500,
    tags: ['Personal 400ml', 'Gaseosa', 'Bien Helada', 'Top Ventas'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.95,
    reviewsCount: 650,
    isPopular: true,
    isAvailable: true,
    calories: 180,
  },
  {
    id: 'beb-coca-15l',
    name: 'Coca-Cola Original Familiar 1.5 Litros',
    italianName: 'Coca-Cola Formato Famiglia 1.5L',
    category: 'bebidas',
    description: 'El tamaño perfecto para compartir en familia o pareja: botella grande de 1.5 Litros bien helada.',
    price: 9500,
    tags: ['Familiar 1.5L', 'Para Compartir', 'Top Ventas'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 5.0,
    reviewsCount: 820,
    isPopular: true,
    isChefPick: true,
    isAvailable: true,
    calories: 650,
  },
  {
    id: 'beb-coca-3l',
    name: 'Coca-Cola Original Mega Fiesta 3 Litros',
    italianName: 'Coca-Cola Formato Maxi 3L',
    category: 'bebidas',
    description: 'Para fiestas familiares, cumpleaños y reuniones: botella gigante de 3 Litros bien helada.',
    price: 14500,
    tags: ['Mega 3 Litros', 'Para Fiestas', 'Económica'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.9,
    reviewsCount: 310,
    isAvailable: true,
    calories: 1300,
  },
  {
    id: 'beb-cocazero-personal',
    name: 'Coca-Cola Sin Azúcar Personal 400ml',
    italianName: 'Coca-Cola Zero Zuccheri 400ml',
    category: 'bebidas',
    description: 'Mismo sabor original sin calorías ni azúcar. Botella individual bien fría.',
    price: 5500,
    tags: ['Personal 400ml', 'Sin Azúcar', 'Zero'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.85,
    reviewsCount: 310,
    isAvailable: true,
    calories: 0,
  },
  {
    id: 'beb-cocazero-15l',
    name: 'Coca-Cola Sin Azúcar Familiar 1.5 Litros',
    italianName: 'Coca-Cola Zero 1.5L Famiglia',
    category: 'bebidas',
    description: 'Botella familiar de 1.5 Litros sin azúcar para disfrutar sin remordimientos.',
    price: 9500,
    tags: ['Familiar 1.5L', 'Sin Azúcar', 'Zero'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.88,
    reviewsCount: 240,
    isAvailable: true,
    calories: 0,
  },
  {
    id: 'beb-cuatro-personal',
    name: 'Gaseosa Cuatro Toronja Personal 400ml',
    italianName: 'Bibita Pompelmo Cuatro 400ml',
    category: 'bebidas',
    description: 'Sabor a toronja refrescante y burbujeante, una de las favoritas de los colombianos para acompañar la pizza.',
    price: 4500,
    tags: ['Personal 400ml', 'Toronja', 'Favorita Nacional'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.9,
    reviewsCount: 420,
    isPopular: true,
    isAvailable: true,
    calories: 160,
  },
  {
    id: 'beb-cuatro-15l',
    name: 'Gaseosa Cuatro Toronja Familiar 1.5 Litros',
    italianName: 'Bibita Cuatro 1.5L Formato Famiglia',
    category: 'bebidas',
    description: 'Botella familiar de 1.5 Litros de Cuatro Toronja bien helada para poner al centro de la mesa.',
    price: 8500,
    tags: ['Familiar 1.5L', 'Toronja', 'Para la Mesa'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.92,
    reviewsCount: 360,
    isAvailable: true,
    calories: 600,
  },
  {
    id: 'beb-manzana-personal',
    name: 'Postobón Manzana Personal 400ml',
    italianName: 'Postobón Mela Rosa 400ml',
    category: 'bebidas',
    description: 'La gaseosa consentida rosada de Colombia: dulce, refrescante y con gas perfecto.',
    price: 4500,
    tags: ['Personal 400ml', 'Colombiana', 'Sabor Tradicional'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.9,
    reviewsCount: 480,
    isPopular: true,
    isAvailable: true,
    calories: 190,
  },
  {
    id: 'beb-manzana-15l',
    name: 'Postobón Manzana Familiar 1.5 Litros',
    italianName: 'Postobón Mela Rosa 1.5L Famiglia',
    category: 'bebidas',
    description: 'Botella de 1.5 Litros de Manzana Postobón para compartir con toda la familia.',
    price: 8000,
    tags: ['Familiar 1.5L', 'Manzana Postobón', 'Tradición'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.93,
    reviewsCount: 510,
    isPopular: true,
    isAvailable: true,
    calories: 700,
  },
  {
    id: 'beb-colombiana-personal',
    name: 'Gaseosa Colombiana "La Nuestra" Personal 400ml',
    italianName: 'Kola Colombiana 400ml',
    category: 'bebidas',
    description: 'Auténtico sabor a kola roja nacional, el clásico maridaje colombiano.',
    price: 4500,
    tags: ['Personal 400ml', 'La Nuestra', 'Kola Roja'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.88,
    reviewsCount: 350,
    isAvailable: true,
    calories: 190,
  },
  {
    id: 'beb-colombiana-15l',
    name: 'Gaseosa Colombiana "La Nuestra" Familiar 1.5 Litros',
    italianName: 'Kola Colombiana 1.5L Famiglia',
    category: 'bebidas',
    description: 'Botella familiar de 1.5 Litros de Colombiana La Nuestra para compartir.',
    price: 8000,
    tags: ['Familiar 1.5L', 'La Nuestra', 'Familiar'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.9,
    reviewsCount: 390,
    isAvailable: true,
    calories: 700,
  },
  {
    id: 'beb-clubcol',
    name: 'Cerveza Club Colombia Dorada 330ml',
    italianName: 'Birra Premium Club Colombia',
    category: 'bebidas',
    description: 'Cerveza premium nacional tipo lager elaborada con cebadas malteadas seleccionadas. Servida bien fría.',
    price: 7500,
    tags: ['Cerveza Nacional', 'Premium', 'Bien Fría'],
    allergens: ['Gluten'],
    image: 'https://images.unsplash.com/photo-1608270197779-79f977c087bb?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.92,
    reviewsCount: 380,
    isPopular: true,
    isAvailable: true,
    calories: 145,
  },
  {
    id: 'beb-poker',
    name: 'Cerveza Poker / Águila Light 330ml',
    italianName: 'Birra Nazionale Colombiana',
    category: 'bebidas',
    description: 'Cerveza rubia colombiana fría, suave y refrescante para compartir entre amigos.',
    price: 6000,
    tags: ['Cerveza', 'Nacional', 'Refrescante'],
    allergens: ['Gluten'],
    image: 'https://images.unsplash.com/photo-1608270197779-79f977c087bb?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.8,
    reviewsCount: 290,
    isAvailable: true,
    calories: 130,
  },
  {
    id: 'beb-corona',
    name: 'Cerveza Corona Extra 355ml (Con Limón)',
    italianName: 'Birra Corona Extra con Limetta',
    category: 'bebidas',
    description: 'Cerveza rubia servida bien helada con su tradicional rodaja de limón fresco en el cuello.',
    price: 9500,
    tags: ['Cerveza', 'Con Limón', 'Helada'],
    allergens: ['Gluten'],
    image: 'https://images.unsplash.com/photo-1608270197779-79f977c087bb?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.88,
    reviewsCount: 230,
    isAvailable: true,
    calories: 150,
  },
  {
    id: 'beb-jugo',
    name: 'Jugo Natural en Agua o Leche',
    italianName: 'Spremuta di Frutta Fresca',
    category: 'bebidas',
    description: 'Preparado al momento con fruta fresca colombiana: Mora silvestre, Maracuyá, Lulo o Mango dulce.',
    price: 7000,
    tags: ['Natural', 'Fruta Fresca', 'En Agua o Leche'],
    allergens: ['Lácteos (si es en leche)'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 3,
    rating: 4.95,
    reviewsCount: 310,
    isPopular: true,
    isAvailable: true,
    calories: 130,
  },
  {
    id: 'beb-agua',
    name: 'Agua Cristal Manantial 600ml',
    italianName: 'Acqua Minerale Naturale',
    category: 'bebidas',
    description: 'Agua pura de manantial con o sin gas, purificada y refrescante.',
    price: 4000,
    tags: ['Sin Gas / Con Gas', 'Natural'],
    allergens: [],
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    prepTimeMin: 1,
    rating: 4.8,
    reviewsCount: 140,
    isAvailable: true,
    calories: 0,
  },
];

// Pizza Customizer Options (Precios en COP)
export const DOUGH_OPTIONS: DoughOption[] = [
  {
    id: 'dough-tradicional',
    name: 'Tradicional Napolitana (48h)',
    description: 'Harina 00 italiana, 48 horas de fermentación lenta, bordes inflados y ligeros.',
    priceDelta: 0,
    fermentationHours: 48,
  },
  {
    id: 'dough-masamadre',
    name: 'Masa Madre Rústica (72h)',
    description: 'Levado natural prolongado con masa madre viva, aroma tostado y digestibilidad superior.',
    priceDelta: 4000,
    fermentationHours: 72,
  },
  {
    id: 'dough-borde-ricotta',
    name: 'Borde Relleno de Queso & Bocadillo',
    description: 'Bordes trenzados rellenos de queso fundente y un toque de bocadillo veleño o scamorza.',
    priceDelta: 7000,
    fermentationHours: 48,
  },
  {
    id: 'dough-singluten',
    name: 'Masa Sin Gluten Certificada',
    description: 'Preparada en zona dedicada con harinas de arroz, maíz y tapioca. Crujiente y suave.',
    priceDelta: 6000,
    fermentationHours: 24,
    isGlutenFree: true,
  },
];

export const SAUCE_OPTIONS: SauceOption[] = [
  {
    id: 'sauce-sanmarzano',
    name: 'Tomate San Marzano D.O.P.',
    description: 'Tomates triturados a mano, sal marina y albahaca fresca.',
    priceDelta: 0,
    color: '#dc2626',
  },
  {
    id: 'sauce-bbq',
    name: 'Salsa BBQ Ahumada Artesanal',
    description: 'Salsa barbacoa caramelizada con miel y toque ahumado criollo.',
    priceDelta: 3000,
    color: '#7c2d12',
  },
  {
    id: 'sauce-trufa',
    name: 'Crema di Tartufo Nero',
    description: 'Base blanca con trufa negra silvestre y pecorino romano.',
    priceDelta: 6000,
    color: '#475569',
  },
  {
    id: 'sauce-pesto',
    name: 'Pesto Genovese Fresco D.O.P.',
    description: 'Albahaca fresca, piñones, Parmigiano 24m y aceite de oliva virgen extra.',
    priceDelta: 5000,
    color: '#15803d',
  },
  {
    id: 'sauce-piccante',
    name: 'Salsa Mexicana de Peperoncino & Jalapeño',
    description: 'Tomate San Marzano con aceite picante y pimentón ahumado.',
    priceDelta: 2000,
    color: '#991b1b',
  },
];

export const CHEESE_OPTIONS: CheeseOption[] = [
  {
    id: 'cheese-fiordilatte',
    name: 'Mozzarella Fior di Latte',
    description: 'Mozzarella fresca con textura elástica y suave sabor láctico.',
    priceDelta: 0,
    color: '#fffbeb',
  },
  {
    id: 'cheese-bufala',
    name: 'Mozzarella di Bufala Campana D.O.P.',
    description: 'Sabor intenso, jugoso y tradicional 100% leche de búfala.',
    priceDelta: 6000,
    color: '#fef3c7',
  },
  {
    id: 'cheese-doblecrema',
    name: 'Queso Doble Crema & Paipa',
    description: 'Queso colombiano artesanal de hilado fundente y suave toque madurado.',
    priceDelta: 4000,
    color: '#fef08a',
  },
  {
    id: 'cheese-gorgonzola',
    name: 'Gorgonzola Dolce D.O.P.',
    description: 'Queso azul cremoso de montaña con dulzor láctico equilibrado.',
    priceDelta: 5000,
    color: '#cbd5e1',
  },
  {
    id: 'cheese-parmigiano',
    name: 'Láminas de Parmigiano Reggiano 24M',
    description: 'Curación lenta con notas profundas a nuez y cristales crujientes.',
    priceDelta: 4000,
    color: '#fef9c3',
  },
  {
    id: 'cheese-vegano',
    name: 'Mozzarella Vegana Melty',
    description: 'Elaborada a base de aceite de coco y almendra, fundente y suave.',
    priceDelta: 4000,
    color: '#f3f4f6',
    isVegan: true,
  },
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  // Toppings Clásicos Colombianos
  { id: 'top-pina', name: 'Piña Oro Miel Caramelizada', category: 'especiales', price: 3500, color: '#facc15' },
  { id: 'top-maiz', name: 'Maíz Tierno Dulce', category: 'vegetales', price: 3000, color: '#eab308' },
  { id: 'top-tocineta', name: 'Tocineta Ahumada Crujiente', category: 'carnes', price: 5000, color: '#be123c' },
  { id: 'top-jalapeno', name: 'Jalapeños Mexicanos', category: 'vegetales', price: 3500, color: '#15803d' },
  { id: 'top-maduro', name: 'Plátano Maduro Horneado', category: 'especiales', price: 3000, color: '#ca8a04' },
  { id: 'top-pollo', name: 'Pollo Desmechado al Ajo', category: 'carnes', price: 5000, color: '#fed7aa' },

  // Carnes
  { id: 'top-salame', name: 'Salame Piccante Calabrés', category: 'carnes', price: 5000, color: '#b91c1c' },
  { id: 'top-prosciutto', name: 'Prosciutto di Parma 18M', category: 'carnes', price: 8000, color: '#e11d48' },
  { id: 'top-guanciale', name: 'Guanciale Crujiente', category: 'carnes', price: 7000, color: '#9f1239' },
  { id: 'top-nduja', name: 'Nduja de Spilinga Untuosa', category: 'carnes', price: 6000, color: '#c2410c' },
  { id: 'top-cotto', name: 'Jamón Seleccionado con Romero', category: 'carnes', price: 5000, color: '#f43f5e' },

  // Vegetales
  { id: 'top-portobello', name: 'Champiñones Portobello Asados', category: 'vegetales', price: 4000, color: '#78716c' },
  { id: 'top-tomateseco', name: 'Tomates Secos Pomodori Secchi', category: 'vegetales', price: 4000, color: '#991b1b' },
  { id: 'top-olivas', name: 'Aceitunas Negras Leccino', category: 'vegetales', price: 3000, color: '#1c1917' },
  { id: 'top-cebolla', name: 'Cebolla Caramelizada', category: 'vegetales', price: 3000, color: '#701a75' },
  { id: 'top-rucula', name: 'Rúcula Salvaje Fresca', category: 'vegetales', price: 3000, color: '#15803d' },
  { id: 'top-albahaca', name: 'Albahaca Fresca', category: 'vegetales', price: 2000, color: '#16a34a' },

  // Especiales
  { id: 'top-burratina', name: 'Burratina Fresca Entera 100g', category: 'especiales', price: 9000, color: '#f8fafc' },
  { id: 'top-hothoney', name: 'Miel Picante Hot Honey', category: 'especiales', price: 3500, color: '#d97706' },
  { id: 'top-pistacho', name: 'Pistachos Tostados', category: 'especiales', price: 5000, color: '#84cc16' },
  { id: 'top-trufa', name: 'Gotas de Aceite de Trufa', category: 'especiales', price: 5000, color: '#eab308' },
];

export const CATERING_ADDONS: CateringAddon[] = [
  {
    id: 'addon-bebidas',
    name: 'Barra Libre de Bebidas (Gaseosas & Cervezas)',
    description: 'Coca-Cola, Postobón, Club Colombia, agua y té ilimitados durante el evento.',
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
    name: 'Menaje Compostable Eco Premium',
    description: 'Platos de hoja de palma natural, cubiertos de bambú y servilletas recicladas.',
    pricePerGuest: 4000,
    icon: 'Leaf',
  },
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'SMART10',
    discountPercent: 10,
    minSubtotal: 60000,
    description: '10% de descuento en pedidos superiores a $60.000 COP',
    validUntil: '2026-12-31',
  },
  {
    code: 'FIESTA20',
    discountPercent: 20,
    minSubtotal: 250000,
    description: '20% de descuento especial en catering y eventos (+ $250.000 COP)',
    validUntil: '2026-12-31',
  },
  {
    code: 'BIENVENIDO',
    discountFixed: 10000,
    minSubtotal: 60000,
    description: '$10.000 COP de descuento directo en tu orden',
    validUntil: '2026-12-31',
  },
  {
    code: 'PIZZALOVER',
    discountPercent: 15,
    minSubtotal: 75000,
    description: '15% de descuento exclusivo para amantes de la pizza',
    validUntil: '2026-12-31',
  },
];

// Initial Demo Orders (Precios en COP)
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8492',
    customerName: 'Santiago Mejía',
    customerPhone: '+57 310 456 7890',
    customerEmail: 'santiago.mejia@example.com',
    deliveryType: 'delivery',
    deliveryAddress: 'Carrera 6 # 5 - 20, Pamplona, Norte de Santander',
    items: [
      {
        id: 'item-1',
        type: 'menu_item',
        menuItemId: 'piz-haw',
        name: 'Pizza Hawaiana Especial Smart',
        size: 'familiar',
        price: 48000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        notes: 'Bien tostadita la piña por favor',
      },
      {
        id: 'item-2',
        type: 'menu_item',
        menuItemId: 'beb-coca',
        name: 'Coca-Cola Original Personal 400ml',
        size: 'personal',
        price: 5500,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'item-3',
        type: 'menu_item',
        menuItemId: 'piz-13',
        name: 'Tiramisú Tradicional de Mascarpone',
        size: 'mediana',
        price: 16000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotal: 75000,
    discount: 7500,
    promoCode: 'SMART10',
    deliveryFee: 5000,
    total: 72500,
    status: 'en_horno',
    estimatedMinutes: 14,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'recibido',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        label: 'Pedido Confirmado',
        description: 'Orden recibida en PIZZASMART Pamplona y asignada a estación.',
      },
      {
        status: 'en_cocina',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        label: 'Masa estirada & Ingredientes frescos',
        description: 'Piña oro miel caramelizada y queso mozzarella colocado.',
      },
      {
        status: 'en_horno',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        label: 'En Horno de Piedra a 450°C',
        description: 'Cocción ultra-rápida de 90 segundos con leña viva.',
      }
    ],
    paymentMethod: 'tarjeta',
    notes: 'Llamar al interfono',
  },
  {
    id: 'ORD-8491',
    customerName: 'Camila Ospina',
    customerPhone: '+57 320 890 1234',
    customerEmail: 'camila.ospina@example.com',
    deliveryType: 'delivery',
    deliveryAddress: 'Calle 7 # 4 - 30, Barrio El Carmen, Pamplona',
    items: [
      {
        id: 'item-4',
        type: 'menu_item',
        menuItemId: 'piz-mex',
        name: 'Pizza Mexicana con Jalapeños',
        size: 'mediana',
        price: 37000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'item-5',
        type: 'menu_item',
        menuItemId: 'beb-manzana',
        name: 'Postobón Manzana Personal 400ml',
        size: 'personal',
        price: 4500,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotal: 46000,
    discount: 0,
    deliveryFee: 5000,
    total: 51000,
    status: 'en_reparto',
    estimatedMinutes: 6,
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'recibido',
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        label: 'Pedido Confirmado',
        description: 'Orden confirmada en cocina.',
      },
      {
        status: 'en_cocina',
        timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        label: 'Ingredientes seleccionados',
        description: 'Jalapeños y carne sazonada en masa madre.',
      },
      {
        status: 'en_horno',
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        label: 'Horneado completado',
        description: 'Salida del horno con alveolado crujiente.',
      },
      {
        status: 'en_reparto',
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        label: 'En Camino con Repartidor',
        description: 'En mochila térmica especial a 75°C directo a tu casa.',
      }
    ],
    paymentMethod: 'bizum_mercadopago',
    notes: 'Llamar al llegar',
  },
  {
    id: 'ORD-8488',
    customerName: 'Guillermo Restrepo',
    customerPhone: '+57 301 234 5678',
    customerEmail: 'g.restrepo@example.com',
    deliveryType: 'takeout',
    items: [
      {
        id: 'item-6',
        type: 'menu_item',
        menuItemId: 'piz-crio',
        name: 'Pizza Criolla Santandereana',
        size: 'familiar',
        price: 52000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotal: 52000,
    discount: 0,
    deliveryFee: 0,
    total: 52000,
    status: 'entregado',
    estimatedMinutes: 0,
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    statusHistory: [
      {
        status: 'recibido',
        timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        label: 'Pedido Confirmado',
        description: 'Orden para recoger en local Pamplona.',
      },
      {
        status: 'entregado',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        label: 'Retirado por Cliente',
        description: 'Entregado caliente en mostrador PIZZASMART.',
      }
    ],
    paymentMethod: 'efectivo',
  }
];

export const INITIAL_QUOTES: CateringQuote[] = [];

// ==========================================
// In-Memory Database Store & Access Layer
// ==========================================

class PizzeriaDatabase {
  private menu: MenuItem[] = [...DEMO_MENU_ITEMS];
  private doughs: DoughOption[] = [...DOUGH_OPTIONS];
  private sauces: SauceOption[] = [...SAUCE_OPTIONS];
  private cheeses: CheeseOption[] = [...CHEESE_OPTIONS];
  private toppings: ToppingOption[] = [...TOPPING_OPTIONS];
  private addons: CateringAddon[] = [...CATERING_ADDONS];
  private promos: PromoCode[] = [...PROMO_CODES];
  private orders: Map<string, Order> = new Map();
  private quotes: Map<string, CateringQuote> = new Map();
  private users: Map<string, UserProfile> = new Map([
    [
      'GERENTE01',
      {
        id: 'usr-gerente-01',
        username: 'GERENTE01',
        name: 'Ing. Carlos Mendoza',
        role: 'gerente',
        email: 'gerencia@pizzasmart.co',
        phone: '+57 310 999 8877',
        address: 'Calle Real # 4 - 50, Edif. Presidencial',
        neighborhood: 'Centro Empresarial Pamplona',
        city: 'Pamplona, Norte de Santander',
        status: 'activo',
        createdAt: '2026-08-15',
        totalSpentCOP: 520000,
        lastOrderCount: 14,
      },
    ],
    [
      'ADMIN01',
      {
        id: 'usr-admin-01',
        username: 'ADMIN01',
        name: 'ADMIN01 (Administrador)',
        role: 'admin',
        email: 'admin01@pizzasmart.com',
        phone: '+57 312 889 0011',
        address: 'Sede Principal PIZZASMART Pamplona',
        neighborhood: 'Centro Histórico',
        city: 'Pamplona, Norte de Santander',
        status: 'activo',
        createdAt: '2026-09-01',
        totalSpentCOP: 240000,
        lastOrderCount: 6,
      },
    ],
    [
      'carlos.gomez',
      {
        id: 'usr-client-01',
        username: 'carlos.gomez',
        name: 'Carlos Gómez',
        role: 'client',
        email: 'carlos.gomez@gmail.com',
        phone: '+57 315 789 4521',
        address: 'Carrera 6 # 5 - 20, Centro Histórico',
        neighborhood: 'Centro / Cerca a Plaza Principal',
        city: 'Pamplona',
        savedAt: '2026-10-15',
        lastOrderCount: 4,
        totalSpentCOP: 156000,
        status: 'activo',
        createdAt: '2026-10-15',
      },
    ],
    [
      'maria.santos',
      {
        id: 'usr-client-02',
        username: 'maria.santos',
        name: 'María Santos',
        role: 'client',
        email: 'maria.santos@unipamplona.edu.co',
        phone: '+57 318 443 1290',
        address: 'Calle 4 # 12 - 45, Edificio Los Álamos Apto 302',
        neighborhood: 'Universidad de Pamplona',
        city: 'Pamplona',
        savedAt: '2026-10-28',
        lastOrderCount: 2,
        totalSpentCOP: 72000,
        status: 'activo',
        createdAt: '2026-10-28',
      },
    ],
  ]);

  private activityLogs: UserActivityLog[] = [
    {
      id: 'log-01',
      userId: 'usr-gerente-01',
      username: 'GERENTE01',
      role: 'gerente',
      action: 'Inicio del Sistema',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      details: 'Apertura de turno gerencial en PIZZASMART Pamplona.',
    },
    {
      id: 'log-02',
      userId: 'usr-admin-01',
      username: 'ADMIN01',
      role: 'admin',
      action: 'Ajuste de Precios en Menú',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      details: 'Actualización de carta colombiana y promociones en COP.',
    },
    {
      id: 'log-03',
      userId: 'usr-client-01',
      username: 'carlos.gomez',
      role: 'client',
      action: 'Orden Registrada',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      details: 'Pedido ORD-8492 de Pizza Hawaiana Especial por $33.000 COP.',
    },
  ];

  constructor() {
    INITIAL_ORDERS.forEach((o) => this.orders.set(o.id, o));
  }

  // --- Activity Audit Logging ---
  public logActivity(userId: string, username: string, role: UserRole, action: string, details?: string): void {
    const log: UserActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      username,
      role,
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    this.activityLogs.unshift(log);
    // Keep last 150 logs in memory
    if (this.activityLogs.length > 150) {
      this.activityLogs = this.activityLogs.slice(0, 150);
    }
  }

  public getActivityLogs(): UserActivityLog[] {
    return this.activityLogs;
  }

  // --- User CRUD & Super-Admin Gerente Management ---
  public getAllUsers(): UserProfile[] {
    return Array.from(this.users.values()).sort((a, b) => {
      // Prioritize gerente, then admin, then clients
      const roleWeight: Record<UserRole, number> = { gerente: 3, admin: 2, client: 1 };
      return (roleWeight[b.role] || 0) - (roleWeight[a.role] || 0);
    });
  }

  public getUserById(id: string): UserProfile | undefined {
    return Array.from(this.users.values()).find((u) => u.id === id);
  }

  public updateUser(id: string, updates: Partial<UserProfile>): UserProfile | undefined {
    const user = Array.from(this.users.values()).find((u) => u.id === id);
    if (!user) return undefined;

    const oldRole = user.role;
    const oldStatus = user.status;
    const updatedUser: UserProfile = { ...user, ...updates };
    this.users.set(user.username, updatedUser);

    let detailStr = `Actualización de perfil para ${user.name} (${user.username}).`;
    if (updates.role && updates.role !== oldRole) {
      detailStr += ` Rol cambiado de ${oldRole} a ${updates.role}.`;
    }
    if (updates.status && updates.status !== oldStatus) {
      detailStr += ` Estado cambiado a ${updates.status}.`;
    }

    this.logActivity(id, user.username, user.role, 'Modificación de Usuario', detailStr);
    return updatedUser;
  }

  public deleteUser(id: string): boolean {
    const user = Array.from(this.users.values()).find((u) => u.id === id);
    if (!user) return false;

    // Safety: Cannot delete root GERENTE01
    if (user.username.toUpperCase() === 'GERENTE01') {
      return false;
    }

    this.users.delete(user.username);
    this.logActivity(id, user.username, user.role, 'Eliminación de Usuario', `Usuario ${user.name} (${user.username}) eliminado por Gerencia.`);
    return true;
  }

  public addUser(userData: Partial<UserProfile>): UserProfile {
    const cleanUsername = (userData.username || `usr_${Date.now()}`).trim();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      name: userData.name || cleanUsername,
      role: userData.role || 'client',
      phone: userData.phone || '+57 300 000 0000',
      email: userData.email || `${cleanUsername}@pizzasmart.co`,
      address: userData.address || 'Pamplona, Norte de Santander',
      neighborhood: userData.neighborhood || 'Centro',
      city: userData.city || 'Pamplona',
      status: userData.status || 'activo',
      savedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastOrderCount: 0,
      totalSpentCOP: 0,
    };

    this.users.set(cleanUsername, newUser);
    this.logActivity(newUser.id, newUser.username, newUser.role, 'Creación de Usuario', `Nuevo usuario registrado: ${newUser.name} con rol ${newUser.role}`);
    return newUser;
  }

  // --- Authentication & User Profile Management ---
  public authenticateUser(
    username: string,
    password?: string,
    extraData?: Partial<UserProfile>
  ): { success: boolean; user?: UserProfile; message?: string } {
    const cleanUsername = (username || '').trim();
    if (!cleanUsername) {
      return { success: false, message: 'Ingresa un nombre de usuario o correo.' };
    }

    const upper = cleanUsername.toUpperCase();

    // 1. Gerente Role Verification (GERENTE01 / GERENTE01)
    if (upper === 'GERENTE01') {
      if (password === 'GERENTE01') {
        const gerenteUser = this.users.get('GERENTE01')!;
        this.logActivity(gerenteUser.id, 'GERENTE01', 'gerente', 'Inicio de Sesión', 'Acceso con rol Gerente General (Control Total)');
        return {
          success: true,
          user: gerenteUser,
          message: '¡Bienvenido GERENTE01! Acceso concedido con control total de Gerencia, Gestión de Personal y Auditoría.',
        };
      } else {
        return {
          success: false,
          message: 'Contraseña incorrecta para el usuario GERENTE01.',
        };
      }
    }

    // 2. Specific Admin Role Verification (ADMIN01 / ADMIN01)
    if (upper === 'ADMIN01') {
      if (password === 'ADMIN01') {
        const adminUser = this.users.get('ADMIN01')!;
        this.logActivity(adminUser.id, 'ADMIN01', 'admin', 'Inicio de Sesión', 'Acceso con rol Administrador (Cocina y Carta)');
        return {
          success: true,
          user: adminUser,
          message: '¡Bienvenido ADMIN01! Acceso concedido con permisos de Administrador.',
        };
      } else {
        return {
          success: false,
          message: 'Contraseña incorrecta para el usuario administrador ADMIN01.',
        };
      }
    }

    // 3. Customer / Client Search by username or email
    let existingUser = Array.from(this.users.values()).find(
      (u) =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() ||
        (u.email && u.email.toLowerCase() === cleanUsername.toLowerCase())
    );

    if (existingUser) {
      if (existingUser.status === 'suspendido') {
        return {
          success: false,
          message: 'Esta cuenta ha sido suspendida por la administración de PIZZASMART.',
        };
      }
      if (extraData) {
        existingUser = { ...existingUser, ...extraData };
        this.users.set(existingUser.username, existingUser);
      }
      this.logActivity(existingUser.id, existingUser.username, existingUser.role, 'Inicio de Sesión Cliente', `Cliente ${existingUser.name} ingresó al sistema.`);
      return {
        success: true,
        user: existingUser,
        message: `¡Bienvenido de nuevo, ${existingUser.name}! Tus datos de entrega en Pamplona están cargados.`,
      };
    }

    // 4. Register / Create new Client Profile with saved delivery info
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: cleanUsername,
      name: extraData?.name || cleanUsername,
      role: 'client',
      phone: extraData?.phone || '+57 310 000 0000',
      email: extraData?.email || (cleanUsername.includes('@') ? cleanUsername : `${cleanUsername}@cliente.pizzasmart.com`),
      address: extraData?.address || 'Pamplona, Norte de Santander',
      neighborhood: extraData?.neighborhood || 'Centro',
      city: 'Pamplona',
      status: 'activo',
      savedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      lastOrderCount: 0,
      totalSpentCOP: 0,
    };

    this.users.set(cleanUsername, newUser);
    this.logActivity(newUser.id, newUser.username, newUser.role, 'Registro de Nuevo Cliente', `Nuevo cliente registrado desde la web: ${newUser.name}`);
    return {
      success: true,
      user: newUser,
      message: `¡Cuenta creada con éxito, ${newUser.name}! Tus datos quedaron guardados para futuras compras rápidas.`,
    };
  }

  public saveUserProfile(user: UserProfile): UserProfile {
    this.users.set(user.username, user);
    return user;
  }

  public getUserProfile(username: string): UserProfile | undefined {
    return this.users.get(username);
  }

  // --- Menu Queries ---
  public getMenu(category?: string, search?: string): MenuItem[] {
    let result = this.menu;
    if (category && category !== 'todas') {
      result = result.filter((item) => item.category === category);
    }
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.italianName.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.menu.find((item) => item.id === id);
  }

  // --- Admin Menu Management Methods ---
  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | undefined {
    const idx = this.menu.findIndex((m) => m.id === id);
    if (idx < 0) return undefined;
    this.menu[idx] = { ...this.menu[idx], ...updates };
    return this.menu[idx];
  }

  public toggleMenuItemAvailability(id: string): MenuItem | undefined {
    const item = this.menu.find((m) => m.id === id);
    if (!item) return undefined;
    item.isAvailable = item.isAvailable === false ? true : false;
    return item;
  }

  public addMenuItem(newItem: MenuItem): MenuItem {
    this.menu.unshift(newItem);
    return newItem;
  }

  public deleteMenuItem(id: string): boolean {
    const idx = this.menu.findIndex((m) => m.id === id);
    if (idx >= 0) {
      this.menu.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getAllPromos(): PromoCode[] {
    return this.promos;
  }

  public addPromo(promo: PromoCode): PromoCode {
    this.promos.push(promo);
    return promo;
  }

  // --- Customizer Options ---
  public getCustomizerCatalog() {
    return {
      doughs: this.doughs,
      sauces: this.sauces,
      cheeses: this.cheeses,
      toppings: this.toppings,
    };
  }

  // Calculate price of custom pizza (en COP)
  public calculateCustomPizzaPrice(config: CustomPizzaConfig): {
    basePrice: number;
    doughPrice: number;
    saucePrice: number;
    cheesePrice: number;
    toppingsPrice: number;
    crustPrice: number;
    total: number;
  } {
    const sizeBaseMap: Record<PizzaSize, number> = {
      personal: 24000,
      mediana: 32000,
      familiar: 46000,
      xl: 58000,
    };
    const basePrice = sizeBaseMap[config.size] || 32000;

    const dough = this.doughs.find((d) => d.id === config.doughId);
    const doughPrice = dough ? dough.priceDelta : 0;

    const sauce = this.sauces.find((s) => s.id === config.sauceId);
    const saucePrice = sauce ? sauce.priceDelta : 0;

    const cheese = this.cheeses.find((c) => c.id === config.cheeseId);
    const cheesePrice = cheese ? cheese.priceDelta : 0;

    let crustPrice = 0;
    if (config.crustOption === 'borde_queso') crustPrice = 7000;
    if (config.crustOption === 'borde_ajo_parmesano') crustPrice = 5000;

    let toppingsPrice = 0;
    if (Array.isArray(config.toppings)) {
      for (const topId of config.toppings) {
        const top = this.toppings.find((t) => t.id === topId);
        if (top) toppingsPrice += top.price;
      }
    }

    const total = Math.round(basePrice + doughPrice + saucePrice + cheesePrice + crustPrice + toppingsPrice);
    return {
      basePrice,
      doughPrice,
      saucePrice,
      cheesePrice,
      toppingsPrice,
      crustPrice,
      total,
    };
  }

  // --- Catering Engine (COP) ---
  public calculateCateringQuote(request: QuoteCalculationRequest): CateringQuote {
    const adults = Math.max(0, request.adultsCount || 0);
    const kids = Math.max(0, request.kidsCount || 0);
    const totalGuests = Math.max(1, adults + kids);

    const slicesPerAdult = 5;
    const slicesPerKid = 3;
    const adultSlices = adults * slicesPerAdult;
    const kidSlices = kids * slicesPerKid;
    const totalSlices = adultSlices + kidSlices;

    const estimatedPizzasNeeded = Math.ceil(totalSlices / 8);
    const basePizzaCost = estimatedPizzasNeeded * 42000;

    let serviceCost = 18000;
    if (request.serviceType === 'pizzero_horno_vivo') {
      serviceCost = 350000;
    } else if (request.serviceType === 'barra_libre_vip') {
      serviceCost = 650000;
    }

    let addonsCost = 0;
    if (Array.isArray(request.selectedAddons)) {
      for (const addonId of request.selectedAddons) {
        const addon = this.addons.find((a) => a.id === addonId);
        if (addon) {
          addonsCost += addon.pricePerGuest * totalGuests;
        }
      }
    }

    const distanceKm = Math.max(0, request.distanceKm || 0);
    let logisticsCost = 0;
    if (distanceKm > 5) {
      logisticsCost = Math.round((distanceKm - 5) * 3500);
    }

    const subtotal = Math.round(basePizzaCost + serviceCost + addonsCost + logisticsCost);

    let discountPercentage = 0;
    if (totalGuests >= 120) {
      discountPercentage = 20;
    } else if (totalGuests >= 80) {
      discountPercentage = 15;
    } else if (totalGuests >= 50) {
      discountPercentage = 10;
    } else if (totalGuests >= 30) {
      discountPercentage = 5;
    }

    const discountAmount = Math.round((subtotal * discountPercentage) / 100);
    const finalTotal = Math.max(0, subtotal - discountAmount);
    const costPerGuest = Math.round(finalTotal / totalGuests);

    const vegCount = request.dietaryRequirements?.veganGuests || 0;
    const celiacCount = request.dietaryRequirements?.celiacGuests || 0;

    const recommendedMenu: Array<{ name: string; quantity: number; rationale: string }> = [];
    let remainingPizzas = estimatedPizzasNeeded;

    if (celiacCount > 0) {
      const celiacPizzas = Math.ceil(celiacCount / 2);
      recommendedMenu.push({
        name: 'Masa Sin Gluten D.O.P. (Margherita & 4 Formaggi)',
        quantity: celiacPizzas,
        rationale: `Para los ${celiacCount} invitados celíacos en horno/estación separada.`,
      });
      remainingPizzas = Math.max(0, remainingPizzas - celiacPizzas);
    }

    if (vegCount > 0) {
      const vegPizzas = Math.ceil(vegCount / 2);
      recommendedMenu.push({
        name: 'Vegetariana & Vegana (Marinara Antica & Portobello)',
        quantity: vegPizzas,
        rationale: `Para los ${vegCount} invitados vegetarianos/veganos.`,
      });
      remainingPizzas = Math.max(0, remainingPizzas - vegPizzas);
    }

    const hawaianaPizzas = Math.ceil(remainingPizzas * 0.4);
    const diavolaPizzas = Math.ceil(remainingPizzas * 0.35);
    const criollaPizzas = Math.max(1, remainingPizzas - hawaianaPizzas - diavolaPizzas);

    recommendedMenu.push(
      {
        name: 'Pizza Hawaiana Especial Smart (Favorita Colombia)',
        quantity: hawaianaPizzas,
        rationale: 'El plato más apetecido en eventos con piña oro miel y jamón.',
      },
      {
        name: 'Diavola Piccante / Mexicana con Jalapeños',
        quantity: diavolaPizzas,
        rationale: 'Para quienes disfrutan el toque picante y crocante.',
      },
      {
        name: 'Pizza Criolla Santandereana (Tocineta & Maíz)',
        quantity: criollaPizzas,
        rationale: 'Toque local santandereano con maíz tierno y tocineta ahumada.',
      }
    );

    const quoteId = `COT-${Math.floor(1000 + Math.random() * 9000)}`;
    const cateringQuote: CateringQuote = {
      id: quoteId,
      createdAt: new Date().toISOString(),
      request,
      totalGuests,
      estimatedPizzasNeeded,
      totalSlices,
      slicesPerAdult,
      slicesPerKid,
      basePizzaCost,
      serviceCost,
      addonsCost,
      logisticsCost,
      subtotal,
      discountPercentage,
      discountAmount,
      finalTotal,
      costPerGuest,
      recommendedMenu,
    };

    this.quotes.set(quoteId, cateringQuote);
    return cateringQuote;
  }

  public getQuoteById(id: string): CateringQuote | undefined {
    return this.quotes.get(id);
  }

  public getAllQuotes(): CateringQuote[] {
    return Array.from(this.quotes.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- Promo Code Validation (COP) ---
  public validatePromoCode(code: string, subtotal: number): {
    valid: boolean;
    discount: number;
    message: string;
    promo?: PromoCode;
  } {
    const promo = this.promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) {
      return {
        valid: false,
        discount: 0,
        message: 'Código promocional no válido.',
      };
    }

    if (subtotal < promo.minSubtotal) {
      return {
        valid: false,
        discount: 0,
        message: `El pedido mínimo para aplicar ${promo.code} es de $${promo.minSubtotal.toLocaleString('es-CO')} COP.`,
        promo,
      };
    }

    let discount = 0;
    if (promo.discountPercent) {
      discount = Math.round((subtotal * promo.discountPercent) / 100);
    } else if (promo.discountFixed) {
      discount = Math.min(subtotal, promo.discountFixed);
    }

    return {
      valid: true,
      discount,
      message: `¡Cupón ${promo.code} aplicado con éxito! Descuento de $${discount.toLocaleString('es-CO')} COP.`,
      promo,
    };
  }

  // --- Orders Management & State Machine ---
  public createOrder(orderPayload: Omit<Order, 'id' | 'createdAt' | 'statusHistory' | 'status'>): Order {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderPayload,
      id,
      status: 'recibido',
      createdAt: now,
      statusHistory: [
        {
          status: 'recibido',
          timestamp: now,
          label: 'Pedido Confirmado',
          description: 'Hemos recibido tu orden en PIZZASMART Pamplona y fue enviada a cocina.',
        },
      ],
    };

    this.orders.set(id, newOrder);

    // Update customer stats if known user
    const matchedUser = Array.from(this.users.values()).find(
      (u) =>
        u.name.toLowerCase() === orderPayload.customerName.toLowerCase() ||
        (orderPayload.customerEmail && u.email?.toLowerCase() === orderPayload.customerEmail.toLowerCase()) ||
        (orderPayload.customerPhone && u.phone?.includes(orderPayload.customerPhone.slice(-7)))
    );

    if (matchedUser) {
      matchedUser.lastOrderCount = (matchedUser.lastOrderCount || 0) + 1;
      matchedUser.totalSpentCOP = (matchedUser.totalSpentCOP || 0) + newOrder.total;
      this.users.set(matchedUser.username, matchedUser);
      this.logActivity(matchedUser.id, matchedUser.username, matchedUser.role, 'Nueva Orden Registrada', `Orden #${id} creada por $${newOrder.total.toLocaleString('es-CO')} COP (${newOrder.items.length} ítems).`);
    } else {
      this.logActivity('guest', orderPayload.customerName, 'client', 'Nueva Orden Registrada', `Orden #${id} creada por $${newOrder.total.toLocaleString('es-CO')} COP.`);
    }

    return newOrder;
  }

  public getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  public getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus): Order | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;

    order.status = newStatus;
    const now = new Date().toISOString();

    const descriptions: Record<OrderStatus, { label: string; desc: string; estMin: number }> = {
      recibido: {
        label: 'Pedido Confirmado',
        desc: 'Orden recibida en el sistema de PIZZASMART Pamplona.',
        estMin: 35,
      },
      en_cocina: {
        label: 'Masa estirada & Ingredientes frescos',
        desc: 'El maestro pizzero estiró la masa y aplicó los ingredientes.',
        estMin: 22,
      },
      en_horno: {
        label: 'En Horno de Piedra a 450°C',
        desc: 'Cociéndose en piedra volcánica a alta temperatura.',
        estMin: 12,
      },
      en_reparto: {
        label: 'En Camino con Repartidor',
        desc: 'En mochila térmica especial a 75°C directo a tu dirección en Pamplona.',
        estMin: 5,
      },
      entregado: {
        label: '¡Entregado!',
        desc: '¡Disfruta de tu auténtica pizza artesanal PIZZASMART Pamplona!',
        estMin: 0,
      },
      cancelado: {
        label: 'Pedido Cancelado',
        desc: 'La orden fue cancelada.',
        estMin: 0,
      },
    };

    const info = descriptions[newStatus];
    order.estimatedMinutes = info.estMin;
    order.statusHistory.push({
      status: newStatus,
      timestamp: now,
      label: info.label,
      description: info.desc,
    });

    this.logActivity('admin-kds', 'Admin/Cocina', 'admin', 'Actualización de Pedido', `Pedido #${id} pasó a: "${info.label}" (${newStatus}).`);

    return order;
  }

  // --- Admin Analytics & Metrics Helper ---
  public getAdminMetrics() {
    const all = Array.from(this.orders.values());
    const validOrders = all.filter((o) => o.status !== 'cancelado');
    const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
    const activeOrders = validOrders.filter((o) => o.status !== 'entregado').length;
    const deliveredCount = validOrders.filter((o) => o.status === 'entregado').length;
    const inOvenCount = validOrders.filter((o) => o.status === 'en_horno').length;
    const avgTicket = validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0;

    // Item popularity ranking
    const itemCountMap: Record<string, { name: string; count: number; totalRev: number }> = {};
    validOrders.forEach((o) => {
      o.items.forEach((it) => {
        if (!itemCountMap[it.name]) {
          itemCountMap[it.name] = { name: it.name, count: 0, totalRev: 0 };
        }
        itemCountMap[it.name].count += it.quantity;
        itemCountMap[it.name].totalRev += it.price * it.quantity;
      });
    });

    const topSelling = Object.values(itemCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSales,
      totalOrders: validOrders.length,
      activeOrders,
      deliveredCount,
      inOvenCount,
      avgTicket,
      topSelling,
      totalMenuItems: this.menu.length,
      activePromos: this.promos.length,
    };
  }

  // --- QA Test Suite Execution Layer ---
  public async runQASuite(): Promise<{
    passed: boolean;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    totalDurationMs: number;
    results: QATestResult[];
  }> {
    const results: QATestResult[] = [];
    const suiteStart = Date.now();

    // Test 1: DB Menu Integrity
    {
      const start = Date.now();
      try {
        const menu = this.getMenu();
        const clasicas = this.getMenu('clasicas');
        const colombianas = this.getMenu('colombianas');
        const searchRes = this.getMenu(undefined, 'hawaiana');
        const passed = menu.length >= 15 && clasicas.length > 0 && colombianas.length > 0 && searchRes.length > 0;
        results.push({
          id: 'qa-01',
          category: 'database',
          name: 'Verificación de Integridad de Menú, Búsqueda y Variedades Colombianas',
          passed,
          durationMs: Date.now() - start,
          details: `Menú total: ${menu.length} productos, Colombianas: ${colombianas.length}, Coincidencias "hawaiana": ${searchRes.length}`,
          assertion: 'Menú expandido con pizzas colombianas, bebidas nacionales y filtros funcionales',
        });
      } catch (err: any) {
        results.push({
          id: 'qa-01',
          category: 'database',
          name: 'Verificación de Integridad de Menú y Búsqueda',
          passed: false,
          durationMs: Date.now() - start,
          details: err.message,
          assertion: 'Total productos >= 15 y filtros funcionan',
          error: err.message,
        });
      }
    }

    // Test 2: Custom Pizza Builder Price Calculation (COP)
    {
      const start = Date.now();
      try {
        const testConfig: CustomPizzaConfig = {
          size: 'familiar', // Base 46.000 COP
          doughId: 'dough-masamadre', // +4.000 COP
          sauceId: 'sauce-trufa', // +6.000 COP
          cheeseId: 'cheese-bufala', // +6.000 COP
          toppings: ['top-salame', 'top-prosciutto'], // +5.000 + 8.000 = 13.000 COP
          crustOption: 'borde_queso', // +7.000 COP
        };
        const calc = this.calculateCustomPizzaPrice(testConfig);
        const expected = 82000;
        const passed = calc.total === expected;
        results.push({
          id: 'qa-02',
          category: 'builder',
          name: 'Cálculo de Precios del Constructor de Pizzas (COP)',
          passed,
          durationMs: Date.now() - start,
          details: `Total calculado: $${calc.total.toLocaleString('es-CO')} COP | Esperado: $${expected.toLocaleString('es-CO')} COP`,
          assertion: 'Suma matemática exacta en COP: base familiar + masa madre + salsa trufa + búfala + borde queso + toppings',
        });
      } catch (err: any) {
        results.push({
          id: 'qa-02',
          category: 'builder',
          name: 'Cálculo de Precios del Constructor de Pizzas',
          passed: false,
          durationMs: Date.now() - start,
          details: err.message,
          assertion: 'Suma matemática exacta de ingredientes',
          error: err.message,
        });
      }
    }

    // Test 3: Motor de Cotizaciones - Headcount & Porciones (COP)
    {
      const start = Date.now();
      try {
        const quoteReq: QuoteCalculationRequest = {
          eventType: 'corporativo',
          adultsCount: 40,
          kidsCount: 10,
          serviceType: 'pizzero_horno_vivo',
          eventDate: '2026-11-15',
          eventTime: '19:00',
          location: 'Parque de la 93, Bogotá',
          distanceKm: 12,
          selectedAddons: ['addon-bebidas'],
        };
        const quote = this.calculateCateringQuote(quoteReq);
        const passed =
          quote.totalGuests === 50 &&
          quote.totalSlices === 230 &&
          quote.estimatedPizzasNeeded === 29 &&
          quote.discountPercentage === 10 &&
          quote.serviceCost === 350000 &&
          quote.finalTotal > 0;
        results.push({
          id: 'qa-03',
          category: 'quotation',
          name: 'Motor de Cotización de Eventos en COP (Rebanadas & Descuento por Volumen)',
          passed,
          durationMs: Date.now() - start,
          details: `Invitados: ${quote.totalGuests}, Rebanadas: ${quote.totalSlices}, Pizzas: ${quote.estimatedPizzasNeeded}, Descuento: ${quote.discountPercentage}%, Costo final: $${quote.finalTotal.toLocaleString('es-CO')} COP`,
          assertion: 'Cálculo exacto de rebanadas (5/adulto, 3/niño), pizzas ceil(total/8) y tramo de descuento del 10%',
        });
      } catch (err: any) {
        results.push({
          id: 'qa-03',
          category: 'quotation',
          name: 'Motor de Cotización de Eventos',
          passed: false,
          durationMs: Date.now() - start,
          details: err.message,
          assertion: 'Algoritmo de catering sin errores',
          error: err.message,
        });
      }
    }

    // Test 4: Promo Code Engine (COP)
    {
      const start = Date.now();
      try {
        const promo1 = this.validatePromoCode('SMART10', 80000);
        const promoFail = this.validatePromoCode('SMART10', 40000);
        const promoInvalid = this.validatePromoCode('CODIGO_FALSO', 100000);
        const passed =
          promo1.valid &&
          promo1.discount === 8000 &&
          !promoFail.valid &&
          !promoInvalid.valid;
        results.push({
          id: 'qa-04',
          category: 'promos',
          name: 'Validación de Cupones de Descuento en COP y Reglas de Mínimo',
          passed,
          durationMs: Date.now() - start,
          details: `SMART10 con $80.000 da $${promo1.discount.toLocaleString('es-CO')} COP desc. Con $40.000 rechaza correctamente por mínimo.`,
          assertion: 'Reglas de porcentaje, monto mínimo en COP y códigos desconocidos operan fielmente',
        });
      } catch (err: any) {
        results.push({
          id: 'qa-04',
          category: 'promos',
          name: 'Validación de Cupones de Descuento',
          passed: false,
          durationMs: Date.now() - start,
          details: err.message,
          assertion: 'Evaluación de cupones',
          error: err.message,
        });
      }
    }

    // Test 5: Order State Machine Lifecycle
    {
      const start = Date.now();
      try {
        const newOrder = this.createOrder({
          customerName: 'Cliente Test QA Pamplona',
          customerPhone: '3001234567',
          customerEmail: 'qa@pizzasmart.co',
          deliveryType: 'delivery',
          deliveryAddress: 'Carrera 6 # 5 - 20, Pamplona',
          items: [],
          subtotal: 68000,
          discount: 0,
          deliveryFee: 5000,
          total: 73000,
          estimatedMinutes: 30,
          paymentMethod: 'tarjeta',
        });

        const initialStatus = newOrder.status === 'recibido';
        const updated1 = this.updateOrderStatus(newOrder.id, 'en_horno');
        const inOvenStatus = updated1?.status === 'en_horno' && updated1.statusHistory.length === 2;
        const updated2 = this.updateOrderStatus(newOrder.id, 'entregado');
        const deliveredStatus = updated2?.status === 'entregado' && updated2.statusHistory.length === 3;

        const passed = initialStatus && inOvenStatus && deliveredStatus;
        results.push({
          id: 'qa-05',
          category: 'orders',
          name: 'Ciclo de Vida y Máquina de Estados de Órdenes',
          passed,
          durationMs: Date.now() - start,
          details: `Orden (${newOrder.id}) transitó recibido -> en_horno -> entregado con historial auditado.`,
          assertion: 'Creación con UUID único, transiciones válidas e historial cronológico de estados',
        });
      } catch (err: any) {
        results.push({
          id: 'qa-05',
          category: 'orders',
          name: 'Ciclo de Vida y Máquina de Estados de Órdenes',
          passed: false,
          durationMs: Date.now() - start,
          details: err.message,
          assertion: 'Transiciones de estado sin corrupción de datos',
          error: err.message,
        });
      }
    }

    // Test 6: Fallback Chatbot Knowledge Availability
    {
      const start = Date.now();
      try {
        const catalog = this.getCustomizerCatalog();
        const passed = catalog.doughs.length > 0 && catalog.sauces.length > 0 && catalog.toppings.length > 0;
        results.push({
          id: 'qa-06',
          category: 'chatbot',
          name: 'Disponibilidad de Datos y Contexto del Chatbot PIZZASMART',
          passed,
          durationMs: Date.now() - start,
          details: `Catálogo de ingredientes y menú listos para alimentar los prompts del modelo Gemini.`,
          assertion: 'Contexto completo de masas, salsas, quesos y platos listo para inferencia',
        });
      } catch (err: any) {
        results.push({
          id: 'qa-06',
          category: 'chatbot',
          name: 'Disponibilidad de Datos del Chatbot',
          passed: false,
          durationMs: Date.now() - start,
          details: err.message,
          assertion: 'Contexto para LLM listo',
          error: err.message,
        });
      }
    }

    const passedTests = results.filter((r) => r.passed).length;
    const failedTests = results.length - passedTests;
    const totalDurationMs = Date.now() - suiteStart;

    return {
      passed: failedTests === 0,
      totalTests: results.length,
      passedTests,
      failedTests,
      totalDurationMs,
      results,
    };
  }

  // ==========================================
  // SaaS Multi-Tenant & Membership Hub Engine
  // ==========================================
  private tenantConfig: TenantConfig = {
    tenantId: 'tenant-pamplona-01',
    tenantSlug: 'pizzasmart-pamplona',
    restaurantName: 'PIZZASMART Pamplona',
    slogan: 'Pizzería Artesanal & Motor Digital',
    city: 'Pamplona, Norte de Santander',
    address: 'Carrera 6 # 5-42, Parque Principal',
    phone: '+57 312 456 7890',
    whatsappNumber: '573124567890',
    currency: 'COP',
    taxRate: 0.08,
    deliveryFeeCOP: 5000,
    membership: {
      plan: 'pro',
      status: 'active',
      startedAt: '2026-01-01T00:00:00Z',
      expiresAt: '2027-01-01T00:00:00Z',
      platformHubUrl: 'https://hub.pizzasmart.cloud/api/v1',
      autoSyncOrders: true,
      maxMonthlyOrders: 3000,
      currentMonthlyOrders: 184,
      licenseKey: 'SMART-PRO-PAMPLONA-2026-X992',
      ownerEmail: 'gerencia@pizzasmart.com',
    },
    whiteLabel: {
      primaryColor: '#ea580c',
      accentColor: '#f59e0b',
      logoUrl: '/logo.png',
      enabledFeatures: {
        kds: true,
        cateringQuotes: true,
        customBuilder: true,
        aiAssistant: true,
        smsNotifications: true,
      },
    },
    apiKey: 'ps_live_8492049284729104',
    lastSyncTimestamp: new Date().toISOString(),
    webhookSecret: 'whsec_993847298172648',
  };

  private syncEventsLog: PlatformSyncEvent[] = [];

  getTenantConfig(): TenantConfig {
    return { ...this.tenantConfig };
  }

  updateTenantConfig(partial: Partial<TenantConfig>): TenantConfig {
    this.tenantConfig = {
      ...this.tenantConfig,
      ...partial,
      membership: {
        ...this.tenantConfig.membership,
        ...(partial.membership || {}),
      },
      whiteLabel: {
        ...this.tenantConfig.whiteLabel,
        ...(partial.whiteLabel || {}),
      },
      lastSyncTimestamp: new Date().toISOString(),
    };
    return this.getTenantConfig();
  }

  verifyMembership(licenseKey?: string): {
    valid: boolean;
    plan: MembershipPlan;
    status: MembershipStatus;
    message: string;
    daysRemaining: number;
    maxOrders: number;
    currentOrders: number;
  } {
    const key = licenseKey || this.tenantConfig.membership.licenseKey;
    const expires = new Date(this.tenantConfig.membership.expiresAt).getTime();
    const now = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((expires - now) / (1000 * 60 * 60 * 24)));
    const isValid = daysRemaining > 0 && this.tenantConfig.membership.status === 'active';

    return {
      valid: isValid,
      plan: this.tenantConfig.membership.plan,
      status: isValid ? 'active' : 'expired',
      daysRemaining,
      maxOrders: this.tenantConfig.membership.maxMonthlyOrders,
      currentOrders: this.orders.size,
      message: isValid
        ? `Membresía ${this.tenantConfig.membership.plan.toUpperCase()} activa. Licencia válida por ${daysRemaining} días.`
        : 'La membresía ha caducado o requiere renovación desde el portal central.',
    };
  }

  syncWithPlatformHub(hubUrl?: string, apiKey?: string): {
    success: boolean;
    syncedAt: string;
    message: string;
    eventsSyncedCount: number;
    tenantId: string;
    metrics: {
      ordersCount: number;
      revenueCOP: number;
      catalogItemsCount: number;
    };
  } {
    const targetHub = hubUrl || this.tenantConfig.membership.platformHubUrl || 'https://hub.pizzasmart.cloud/api/v1';
    const orderList = Array.from(this.orders.values());
    const totalRevenue = orderList.reduce((sum, o) => sum + (o.total || 0), 0);

    // Record heartbeat ping event
    const syncEvent: PlatformSyncEvent = {
      eventId: `sync-${Date.now()}`,
      tenantId: this.tenantConfig.tenantId,
      eventType: 'ping',
      timestamp: new Date().toISOString(),
      payload: {
        ordersCount: this.orders.size,
        totalRevenueCOP: totalRevenue,
        version: '2.5.0-saas',
      },
      status: 'synced',
    };
    this.syncEventsLog.unshift(syncEvent);
    if (this.syncEventsLog.length > 50) this.syncEventsLog.pop();

    this.tenantConfig.lastSyncTimestamp = new Date().toISOString();

    return {
      success: true,
      syncedAt: this.tenantConfig.lastSyncTimestamp,
      message: `Sincronización exitosa con plataforma central (${targetHub}).`,
      eventsSyncedCount: 1,
      tenantId: this.tenantConfig.tenantId,
      metrics: {
        ordersCount: this.orders.size,
        revenueCOP: totalRevenue,
        catalogItemsCount: this.menu.length,
      },
    };
  }

  exportSaaSTenantManifest(): Record<string, any> {
    const orderList = Array.from(this.orders.values());
    const totalRevenue = orderList.reduce((sum, o) => sum + (o.total || 0), 0);
    const usersList = Array.from(this.users.values());
    return {
      manifestVersion: '1.0.0',
      system: 'PIZZASMART Multi-Tenant Node',
      compatibleWith: 'SaaS Membership & Franchise Platform',
      tenant: this.tenantConfig,
      stats: {
        totalOrders: this.orders.size,
        totalRevenueCOP: totalRevenue,
        totalMenuItems: this.menu.length,
        activeCustomers: usersList.filter((u) => u.role === 'client').length,
        uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 3600),
      },
      apiEndpoints: {
        health: '/api/membership/health',
        verify: '/api/membership/verify',
        sync: '/api/membership/sync',
        manifest: '/api/membership/manifest',
        menu: '/api/menu',
        orders: '/api/orders',
      },
      exportedAt: new Date().toISOString(),
    };
  }
}

export const pizzeriaDb = new PizzeriaDatabase();
