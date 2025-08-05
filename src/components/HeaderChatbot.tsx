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
import { Send, Bot, X, Minimize2 } from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy tu asistente de fragancias. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (text: string, isUser: boolean = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    console.log('🌟 HEADER CHATBOT - Enviando mensaje:', message);
    console.log('🌟 HEADER CHATBOT - webhookUrl:', webhookUrl);

    addMessage(message, true);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!webhookUrl) {
        console.log('❌ HEADER CHATBOT - Webhook URL no configurada');
        addMessage('Webhook no configurado. Verifica la configuración.');
        return;
      }

      const payload = {
        message: message,
        timestamp: new Date().toISOString(),
        source: 'perfume-store-header-chatbot',
        userId: 'web-user-' + Date.now()
      };

      console.log('🌟 HEADER CHATBOT - Enviando payload:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('🌟 HEADER CHATBOT - Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🌟 HEADER CHATBOT - Response data:', data);
      console.log('🌟 HEADER CHATBOT - Response keys:', Object.keys(data));
      
      // El webhook de n8n puede responder con diferentes formatos
      let botResponse;
      if (data.response) {
        botResponse = data.response;
        console.log('🌟 HEADER CHATBOT - Using data.response:', botResponse);
      } else if (data.respond) {
        botResponse = data.respond;
        console.log('🌟 HEADER CHATBOT - Using data.respond:', botResponse);
      } else if (data.message) {
        botResponse = data.message;
        console.log('🌟 HEADER CHATBOT - Using data.message:', botResponse);
      } else {
        botResponse = 'Respuesta recibida del webhook';
        console.log('🌟 HEADER CHATBOT - Using fallback response');
      }
      
      console.log('🌟 HEADER CHATBOT - Final bot response:', botResponse);
      addMessage(botResponse);

    } catch (error) {
      console.error('🌟 HEADER CHATBOT - Error:', error);
      addMessage('Error: No se pudo conectar con el asistente de IA');
    } finally {
      setIsLoading(false);
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
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
      
      {/* Modal del chatbot - Responsive */}
      <div className="
        fixed inset-0 z-50 md:absolute md:top-full md:right-0 md:inset-auto md:mt-2 
        w-full h-full md:w-96 md:h-[480px] md:right-0
        bg-white rounded-none md:rounded-lg shadow-2xl border-0 md:border border-gray-200 flex flex-col
        md:max-h-[calc(100vh-120px)]
      ">
        {/* Header del chatbot - Responsive */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 md:p-4 pt-8 md:pt-4 rounded-none md:rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bot className="h-6 w-6 md:h-6 md:w-6 ai-pulse" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white ai-glow"></div>
            </div>
            <div>
              <h3 className="font-semibold text-lg md:text-lg">Asistente IA de Fragancias</h3>
              <p className="text-amber-100 text-sm md:text-sm">Especialista en perfumes • En línea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-white transition-colors p-2 md:p-1 rounded-full hover:bg-amber-600"
          >
            <X className="h-6 w-6 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Área de mensajes - Responsive */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-2 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}
              >
                <p className="text-sm md:text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-amber-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-3 md:px-4 py-2 shadow-sm">
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
        <div className="p-3 md:p-4 border-t border-gray-200 bg-white rounded-none md:rounded-b-lg safe-area-padding-bottom">
          <div className="flex space-x-2">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregúntame sobre perfumes..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 md:px-3 md:py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm md:text-sm min-h-[40px]"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2 md:p-2 rounded-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[40px]"
            >
              <Send className="h-4 w-4 md:h-4 md:w-4" />
            </button>
          </div>
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
