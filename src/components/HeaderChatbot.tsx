/**
 * HeaderChatbot - Componente de chatbot IA integrado en el header
 * 
 * Este componente implementa un chatbot especializado en fragancias que se despliega
 * como un menú desde el header. Se conecta en tiempo real con n8n para proporcionar
 * asesoría personalizada sobre perfumes y marcas.
 * 
 * Características principales:
 * - Interfaz moderna con diseño premium (400x400px)
 * - Conexión en tiempo real con webhook de n8n
 * - Manejo robusto de errores y logging detallado
 * - Animaciones y efectos visuales elegantes
 * - Scroll automático y gestión de estado optimizada
 * 
 * @author Cascade AI Assistant
 * @version 2.0.0
 * @since 2025-01-05
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Minimize2, User } from 'lucide-react';

// Estilos CSS personalizados para animaciones mejoradas
const customStyles = `
  @keyframes aiPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
  
  @keyframes aiGlow {
    0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6); }
  }
  
  .ai-pulse {
    animation: aiPulse 2s ease-in-out infinite;
  }
  
  .ai-glow {
    animation: aiGlow 3s ease-in-out infinite;
  }

  /* Animaciones de entrada para burbujas */
  @keyframes bubbleInLeft {
    from { opacity: 0; transform: translateX(-8px) scale(0.98); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes bubbleInRight {
    from { opacity: 0; transform: translateX(8px) scale(0.98); }
    to { opacity: 1; transform: translateX(0) scale(1); }
  }
  .bubble-in-left { animation: bubbleInLeft 250ms ease-out; }
  .bubble-in-right { animation: bubbleInRight 250ms ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .bubble-in-left, .bubble-in-right { animation: none; }
  }

  /* Indicador escribiendo: suave aparición */
  @keyframes typingFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .typing-fade { animation: typingFade 180ms ease-out; }
  
  .safe-area-padding-bottom {
    padding-bottom: env(safe-area-inset-bottom, 1rem);
  }
  
  @media (max-width: 768px) {
    .mobile-full-screen {
      height: 100vh;
      height: 100dvh; /* Para navegadores que soportan dvh */
    }
  }
`;

// Inyectar estilos en el head si no existen
if (typeof document !== 'undefined' && !document.getElementById('chatbot-custom-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'chatbot-custom-styles';
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

/**
 * Interfaz para los mensajes del chat
 * 
 * @interface Message
 * @property {string} id - Identificador único del mensaje
 * @property {string} text - Contenido del mensaje
 * @property {boolean} isUser - Indica si el mensaje es del usuario (true) o del bot (false)
 * @property {Date} timestamp - Marca de tiempo de cuando se envió el mensaje
 */
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/**
 * Props del componente HeaderChatbot
 * 
 * @interface HeaderChatbotProps
 * @property {boolean} isOpen - Estado de visibilidad del chatbot
 * @property {() => void} onClose - Función callback para cerrar el chatbot
 * @property {string} [webhookUrl] - URL del webhook de n8n (opcional)
 */
interface HeaderChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl?: string;
}

export function HeaderChatbot({ isOpen, onClose, webhookUrl }: HeaderChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerTitleId = 'chatbot-title';

  // Persistencia local
  const STORAGE_KEY = 'header_chat_messages_v1';
  const MAX_MESSAGES = 30;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    // Focus input when opened
    inputRef.current?.focus();
  }, [isOpen]);

  // Trap de foco dentro del modal y manejo de Escape
  useEffect(() => {
    if (!isOpen) return;
    const el = containerRef.current;
    if (!el) return;

    const focusableSelector = 'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = Array.from(el.querySelectorAll<HTMLElement>(focusableSelector)).filter((n) => !n.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !el.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Cargar historial desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: any[] = JSON.parse(raw);
        const revived: Message[] = parsed.map((m) => ({
          ...m,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        }));
        setMessages(revived.slice(-MAX_MESSAGES));
      }
    } catch {}
  }, []);

  // Guardar historial cuando cambian los mensajes
  useEffect(() => {
    try {
      const toSave = messages.slice(-MAX_MESSAGES).map((m) => ({
        ...m,
        timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  }, [messages]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  // Enter envía, Shift+Enter agrega salto de línea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        sendMessage();
      }
    }
  };

  // Limpiar historial del chat con confirmación
  const clearChat = () => {
    const ok = window.confirm('¿Quieres limpiar el chat? Esta acción no se puede deshacer.');
    if (!ok) return;
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const addMessage = (text: string, isUser: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => {
      const next = [...prev, newMessage];
      return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
    });
  };

  // Utilidades de resiliencia
  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
  const shouldRetryStatus = (status: number) => {
    if (status === 408 || status === 429) return true;
    if (status >= 500 && status < 600) return true;
    return false;
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    console.log('🌟 HEADER CHATBOT - Enviando mensaje:', message);
    console.log('🌟 HEADER CHATBOT - webhookUrl:', webhookUrl);

    addMessage(message, true);
    setInputValue('');
    // Mantener el foco en el textarea tras enviar
    inputRef.current?.focus();
    setIsLoading(true);
    setIsTyping(true);

    try {
      if (!webhookUrl) {
        console.log('❌ HEADER CHATBOT - Webhook URL no configurada');
        // En desarrollo usaremos el proxy si existe
        if (!import.meta.env.DEV) {
          addMessage('Webhook no configurado. Verifica la configuración.');
          return;
        }
      }

      const payload = {
        message: message,
        timestamp: new Date().toISOString(),
        source: 'perfume-store-header-chatbot',
        userId: 'web-user-' + Date.now()
      };

      console.log('🌟 HEADER CHATBOT - Enviando payload:', payload);
    const t0 = performance.now?.() ?? Date.now();
      // Reintentos con backoff y timeout por intento
      const maxRetries = 3;
      let attempt = 0;
      let response: Response | null = null;
      let lastError: any = null;
      while (attempt < maxRetries) {
        const backoff = 400 * Math.pow(2, attempt); // 400ms, 800ms, 1600ms
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        try {
          console.log(`🌟 HEADER CHATBOT - Intento ${attempt + 1}/${maxRetries} usando webhook directo:`, webhookUrl);
          response = await fetch(webhookUrl as string, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/plain;q=0.9, */*;q=0.8',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          console.log('🌟 HEADER CHATBOT - Response status:', response.status);
          if (!response.ok) {
            if (shouldRetryStatus(response.status) && attempt < maxRetries - 1) {
              console.warn(`🌟 HEADER CHATBOT - HTTP ${response.status}. Reintentando en ${backoff}ms...`);
              await sleep(backoff);
              attempt++;
              continue;
            }
            // No es recuperable o sin más intentos
            throw new Error(`HTTP ${response.status}`);
          }
          // OK
          break;
        } catch (err: any) {
          clearTimeout(timeoutId);
          lastError = err;
          const isAbort = err?.name === 'AbortError';
          const isNetwork = err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError');
          if ((isAbort || isNetwork) && attempt < maxRetries - 1) {
            console.warn(`🌟 HEADER CHATBOT - Error de red/timeout. Reintentando en ${backoff}ms...`, err);
            await sleep(backoff);
            attempt++;
            continue;
          }
          throw err;
        }
      }
      if (!response) throw lastError || new Error('Sin respuesta del servidor');

      // Intentar parsear JSON; si no, usar texto
      const contentType = response.headers.get('content-type') || '';
      let botResponse: string = '';
      if (contentType.includes('application/json')) {
        try {
          const data = await response.json();
          console.log('🌟 HEADER CHATBOT - Response data:', data);
          console.log('🌟 HEADER CHATBOT - Response keys:', Object.keys(data));
          if (data.response) {
            botResponse = data.response;
            console.log('🌟 HEADER CHATBOT - Using data.response:', botResponse);
          } else if (data.respond) {
            botResponse = data.respond;
            console.log('🌟 HEADER CHATBOT - Using data.respond:', botResponse);
          } else if (data.message) {
            botResponse = data.message;
            console.log('🌟 HEADER CHATBOT - Using data.message:', botResponse);
          }
        } catch (jsonErr) {
          console.warn('🌟 HEADER CHATBOT - JSON parse error, trying text:', jsonErr);
        }
      }

      // Si no hubo respuesta por JSON, intentar texto
      if (!botResponse) {
        const text = await response.text();
        console.log('🌟 HEADER CHATBOT - Response text:', text);
        if (text && text.trim()) {
          // n8n test suele responder "Workflow was started"
          botResponse = text.trim();
        } else {
          botResponse = 'Respuesta recibida del asistente.';
        }
      }

      const t1 = performance.now?.() ?? Date.now();
      const durationMs = Math.round((t1 as number) - (t0 as number));
      console.info(`🌟 HEADER CHATBOT - OK en ${durationMs}ms, intentos: ${attempt + 1}`);
      console.log('🌟 HEADER CHATBOT - Final bot response:', botResponse);
      addMessage(botResponse);
      setIsTyping(false);

    } catch (error) {
      console.error('🌟 HEADER CHATBOT - Error:', error);
      addMessage('No me pude conectar con Kameboot ahora mismo. Por favor, revisa tu conexión o inténtalo nuevamente en unos segundos.');
    } finally {
      setIsLoading(false);
      // Asegurar foco vuelve al textarea
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para móviles */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} aria-hidden="true"></div>
      
      {/* Contenedor principal del chatbot - Responsive */}
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headerTitleId}
        className="fixed top-20 right-8 left-8 bottom-32 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden max-h-[50vh] max-w-[85vw] mx-auto md:fixed md:top-16 md:right-4 md:left-auto md:bottom-auto md:w-[400px] md:h-[400px]"
      >
        {/* Header del chatbot - Responsive */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2 md:p-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6 md:h-6 md:w-6 ai-pulse" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white ai-glow"></div>
            </div>
            <div>
              <h3 id={headerTitleId} className="font-semibold text-base md:text-lg">Asistente IA</h3>
              <p className="text-amber-100 text-xs md:text-sm">Especialista en perfumes</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={clearChat}
              className="text-amber-100 hover:text-white transition-colors px-2 py-1 text-xs md:text-sm rounded hover:bg-amber-600 border border-amber-300/40"
              title="Limpiar chat"
              aria-label="Limpiar chat"
            >
              Limpiar
            </button>
            <button
              onClick={onClose}
              className="text-amber-100 hover:text-white transition-colors p-2 md:p-1 rounded-full hover:bg-amber-600"
              title="Cerrar"
              aria-label="Cerrar chat"
            >
              <X className="h-6 w-6 md:h-5 md:w-5" />
            </button>
          </div>
        </div>

        {/* Área de mensajes - Responsive */}
        <div
          className="flex-1 overflow-y-auto p-1 md:p-4 space-y-1 md:space-y-4 bg-gray-50"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end gap-2">
                {!message.isUser && (
                  <div className="flex flex-col items-center gap-0.5" aria-hidden="true">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <Bot className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] md:text-xs text-amber-600">Kameboot</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] md:max-w-xs lg:max-w-md px-2 md:px-3 py-1.5 md:py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                  } ${message.isUser ? 'bubble-in-right' : 'bubble-in-left'}`}
                >
                  <p className="text-sm md:text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? 'text-amber-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.isUser && (
                  <div className="flex flex-col items-center gap-0.5" aria-hidden="true">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] md:text-xs text-gray-600">Tú</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        
          {isLoading && (
            <div className="flex justify-start typing-fade">
              <div className="bg-white border border-gray-200 rounded-2xl px-3 md:px-4 py-2 shadow-sm" role="status" aria-live="polite">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-xs text-gray-500 ml-2">IA escribiendo...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de mensaje - Responsive */}
        <div className="p-1 md:p-4 border-t border-gray-200 bg-white rounded-b-lg flex-shrink-0">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregúntame sobre perfumes..."
            aria-label="Escribe tu mensaje"
            className="w-full border border-amber-200 focus:ring-2 focus:ring-amber-300 focus:outline-none rounded-lg p-2 text-sm resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 md:p-2 rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[44px] md:min-w-[40px] min-h-[44px] md:min-h-[40px]"
            aria-label="Enviar mensaje"
          >
            <Send className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <p className="text-xs text-gray-500 mt-2 hidden md:block">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
          <p className="text-xs text-gray-500 mt-2 md:hidden">
            Toca para enviar tu consulta
          </p>
        </div>
      </div>
    </>
  );
}
