/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import {
  X,
  Send,
  Sparkles,
  Pizza,
  RotateCcw,
  Flame,
  ArrowRight,
  Plus,
  Check,
  Tag,
  Calculator,
  ThumbsUp,
  Zap,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { CartItem } from '../types/pizzeria';
import { formatCOP } from '../utils/format';

interface InteractiveCard {
  type: 'pizza' | 'quote' | 'promo';
  id?: string;
  name: string;
  price?: number;
  image?: string;
  actionText: string;
  actionTab?: ActiveTab;
}

interface Message {
  id: string;
  sender: 'user' | 'gino';
  text: string;
  timestamp: string;
  source?: string;
  cards?: InteractiveCard[];
}

interface GinoChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab) => void;
  onAddToCart?: (item: CartItem) => void;
}

export const GinoChatbot: React.FC<GinoChatbotProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAddToCart,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'gino',
      text: '¡Hola! Es un gusto saludarte. Soy Gino, asesor de servicio al cliente en PIZZASMART Pamplona 🍕. Estoy aquí para atenderte como te lo mereces y orientarte en lo que más te provoque hoy. ¿Buscas una recomendación dulce-salada como la Hawaiana Especial o prefieres armar tu propia pizza?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cards: [
        {
          type: 'pizza',
          id: 'piz-haw',
          name: 'Pizza Hawaiana Especial',
          price: 33000,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
          actionText: 'Pedir por $ 33.000',
        },
        {
          type: 'pizza',
          id: 'beb-coca',
          name: 'Coca-Cola Personal 400ml',
          price: 5500,
          image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
          actionText: 'Añadir $ 5.500',
        },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🍍 Hawaiana Especial',
    '🌶️ Pizza Mexicana',
    '🇨🇴 Criolla Santandereana',
    '🥤 Coca-Cola & Bebidas',
    '🎉 Evento en Pamplona',
    '🎟️ Cupón SMART10',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Extract interactive suggestions based on query
  const detectInteractiveCards = (text: string): InteractiveCard[] => {
    const q = text.toLowerCase();
    const cards: InteractiveCard[] = [];

    if (q.includes('hawaian') || q.includes('pina') || q.includes('piña')) {
      cards.push({
        type: 'pizza',
        id: 'piz-haw',
        name: 'Pizza Hawaiana Especial',
        price: 33000,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
        actionText: 'Pedir por $ 33.000',
      });
    }

    if (q.includes('mexican') || q.includes('jalape') || q.includes('nacho')) {
      cards.push({
        type: 'pizza',
        id: 'piz-mex',
        name: 'Pizza Mexicana con Jalapeños',
        price: 36000,
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80',
        actionText: 'Pedir por $ 36.000',
      });
    }

    if (q.includes('crioll') || q.includes('platano') || q.includes('maduro') || q.includes('santander') || q.includes('maiz')) {
      cards.push({
        type: 'pizza',
        id: 'piz-crio',
        name: 'Pizza Criolla Santandereana',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80',
        actionText: 'Pedir por $ 38.000',
      });
    }

    if (q.includes('coca') || q.includes('gaseosa') || q.includes('bebida') || q.includes('postobon') || q.includes('colombiana') || q.includes('1.5') || q.includes('cuatro')) {
      cards.push({
        type: 'pizza',
        id: 'beb-coca-15l',
        name: 'Coca-Cola Familiar 1.5 Litros',
        price: 9500,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        actionText: 'Añadir 1.5L ($ 9.500)',
      });
      cards.push({
        type: 'pizza',
        id: 'beb-coca-personal',
        name: 'Coca-Cola Personal 400ml',
        price: 5500,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        actionText: 'Añadir 400ml ($ 5.500)',
      });
      cards.push({
        type: 'pizza',
        id: 'beb-manzana-15l',
        name: 'Postobón Manzana 1.5 Litros',
        price: 8000,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        actionText: 'Añadir 1.5L ($ 8.000)',
      });
      cards.push({
        type: 'pizza',
        id: 'beb-cuatro-15l',
        name: 'Cuatro Toronja 1.5 Litros',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
        actionText: 'Añadir 1.5L ($ 8.500)',
      });
    }

    if (q.includes('cerveza') || q.includes('club colombia') || q.includes('corona')) {
      cards.push({
        type: 'pizza',
        id: 'beb-clubcol',
        name: 'Cerveza Club Colombia Dorada',
        price: 7000,
        image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=400&q=80',
        actionText: 'Añadir $ 7.000',
      });
    }

    if (q.includes('margherita') || q.includes('clasic') || q.includes('recomiend') || q.includes('pedidas')) {
      cards.push({
        type: 'pizza',
        id: 'piz-01',
        name: 'Margherita Verace D.O.P.',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=400&q=80',
        actionText: 'Pedir por $ 32.000',
      });
    }

    if (q.includes('picante') || q.includes('diavola')) {
      cards.push({
        type: 'pizza',
        id: 'piz-02',
        name: 'Diavola Piccante',
        price: 36000,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
        actionText: 'Pedir por $ 36.000',
      });
    }

    if (q.includes('cotiz') || q.includes('evento') || q.includes('personas') || q.includes('fiesta') || q.includes('catering')) {
      cards.push({
        type: 'quote',
        name: 'Cotizador en Vivo para Eventos en Pamplona',
        actionText: 'Abrir Cotizador',
        actionTab: 'quotation',
      });
    }

    if (q.includes('cupon') || q.includes('descuento') || q.includes('promo')) {
      cards.push({
        type: 'promo',
        name: 'Cupón: SMART10 (10% OFF)',
        actionText: 'Ir a Carta / Carrito',
        actionTab: 'menu',
      });
    }

    return cards;
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.sendChatMessage(text, history);
      const cards = detectInteractiveCards(text + ' ' + (res.reply || ''));

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'gino',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
        cards: cards.length > 0 ? cards : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'gino',
          text: '¡Aquí tienes dos de nuestras mejores creaciones recién horneadas a 450°C!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cards: [
            {
              type: 'pizza',
              id: 'piz-01',
              name: 'Margherita Verace D.O.P.',
              price: 32000,
              image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=400&q=80',
              actionText: 'Pedir por $ 32.000',
            },
          ],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddCardToCart = (card: InteractiveCard) => {
    if (!onAddToCart || !card.price) {
      onNavigate('menu');
      onClose();
      return;
    }

    onAddToCart({
      id: `chat-${card.id || 'custom'}-${Date.now()}`,
      type: 'menu_item',
      menuItemId: card.id,
      name: card.name,
      size: 'mediana',
      price: card.price,
      quantity: 1,
      image: card.image || 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    });

    setAddedItemName(card.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden h-[540px] animate-in fade-in slide-in-from-bottom-6 duration-300">
      {/* Modern Vibrant Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 p-3.5 border-b border-zinc-800 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-black/40 backdrop-blur p-1 shadow-md flex items-center justify-center border border-white/20">
            <span className="text-xl">👨‍🍳</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-black text-sm tracking-tight">Gino · Atención al Cliente</span>
              <span className="text-[9px] bg-black/40 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded-full border border-white/20">
                Pamplona
              </span>
            </div>
            <p className="text-[11px] text-amber-100 font-sans">
              Asesor Humano & Maestro Pizzero Smart
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setMessages([
                {
                  id: `msg-${Date.now()}`,
                  sender: 'gino',
                  text: '¡Conversación reiniciada! 🍕 ¿Qué pizza o cotización te preparamos en COP?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ]);
            }}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-zinc-200 transition-colors"
            title="Reiniciar chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-zinc-200 transition-colors"
            title="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-zinc-950 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-[88%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-tr-none shadow-md shadow-orange-950/40'
                  : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>

              {/* Interactive Pizza & Action Cards inside Bot Messages */}
              {msg.cards && msg.cards.length > 0 && (
                <div className="mt-2.5 space-y-2 pt-2 border-t border-zinc-800">
                  {msg.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800 gap-2 hover:border-orange-500/50 transition-all"
                    >
                      {card.image && (
                        <img
                          src={card.image}
                          alt={card.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {card.name}
                        </div>
                        {card.price && (
                          <div className="text-[11px] font-mono font-bold text-orange-400">
                            {formatCOP(card.price)} COP
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (card.actionTab) {
                            onNavigate(card.actionTab);
                            onClose();
                          } else {
                            handleAddCardToCart(card);
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] shrink-0 active:scale-95 transition-all flex items-center gap-1"
                      >
                        {card.price ? (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Pedir</span>
                          </>
                        ) : (
                          <>
                            <span>{card.actionText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action shortcut links */}
              {msg.sender === 'gino' && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-zinc-800/80">
                  <button
                    onClick={() => {
                      onNavigate('builder');
                      onClose();
                    }}
                    className="text-[10px] text-amber-300 bg-zinc-950 hover:bg-zinc-850 px-2 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Armar a Medida</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('quotation');
                      onClose();
                    }}
                    className="text-[10px] text-orange-300 bg-zinc-950 hover:bg-zinc-850 px-2 py-1 rounded-lg border border-orange-500/30 flex items-center gap-1"
                  >
                    <Calculator className="w-3 h-3 text-orange-400" />
                    <span>Cotizar Evento</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-[10px] text-zinc-500 mt-1 px-1 flex items-center gap-1 font-mono">
              <span>{msg.timestamp}</span>
              {msg.source && <span className="text-[9px] text-zinc-600">• {msg.source}</span>}
            </div>
          </div>
        ))}

        {addedItemName && (
          <div className="p-2 rounded-xl bg-emerald-950/90 border border-emerald-600 text-emerald-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>¡{addedItemName} agregada al carrito con éxito!</span>
          </div>
        )}

        {isTyping && (
          <div className="flex items-center gap-2.5 text-xs text-amber-200 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 px-3.5 py-2.5 rounded-2xl border border-amber-500/30 shadow-md animate-in fade-in">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="font-medium text-[11px] text-zinc-300 truncate">
                Gino está analizando la mejor opción para ti...
              </span>
              <span className="flex gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Touch-friendly & fast) */}
      <div className="px-3 py-2 bg-zinc-900 border-t border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-orange-400 hover:border-orange-500/50 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta algo al pizzero smart..."
          className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          className="p-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
