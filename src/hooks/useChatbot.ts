import { useState, useCallback } from 'react';

interface ChatbotConfig {
  apiEndpoint?: string;
  apiKey?: string;
  model?: string;
}

export const useChatbot = (config?: ChatbotConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Aquí puedes conectar con tu servicio de IA preferido
      // Ejemplos: OpenAI, Claude, Gemini, etc.
      
      if (config?.apiEndpoint && config?.apiKey) {
        // Conexión real con IA
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `Eres un asistente especializado en perfumes y fragancias para una tienda online. 
                Tu nombre es "Fragrance Assistant" y trabajas para una tienda de perfumes premium.
                
                Información de la tienda:
                - Vendemos perfumes de marcas premium y nicho
                - Tenemos fragancias para hombre, mujer y unisex
                - Precios desde $25 hasta $150
                - Marcas incluyen: MANCERA, TOM FORD, CREED, y más
                - Ubicados en Managua, Nicaragua
                
                Instrucciones:
                - Sé amigable, profesional y conocedor
                - Haz preguntas para entender las preferencias del cliente
                - Recomienda productos específicos cuando sea apropiado
                - Mantén las respuestas concisas pero informativas
                - Si no sabes algo específico, sé honesto pero ofrece ayuda alternativa
                - Responde siempre en español
                `
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 150,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta de la IA');
        }

        const data = await response.json();
        setIsConnected(true);
        return data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.';
      } else {
        // Respuestas inteligentes sin IA externa (para demostración)
        return getIntelligentResponse(message);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setIsConnected(false);
      return 'Lo siento, hubo un problema técnico. Por favor, intenta de nuevo en unos momentos.';
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const getIntelligentResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Respuestas sobre productos específicos
    if (lowerMessage.includes('mancera')) {
      return '¡MANCERA es una excelente elección! Es una marca francesa de nicho conocida por sus fragancias intensas y duraderas. Tenemos varios perfumes MANCERA disponibles. ¿Te interesa algo específico como Roses Vanille, Black Gold, o prefieres que te recomiende según tus gustos?';
    }
    
    if (lowerMessage.includes('tom ford')) {
      return 'TOM FORD es sinónimo de lujo y sofisticación. Sus fragancias son perfectas para ocasiones especiales. ¿Buscas algo más fresco como Neroli Portofino, algo intenso como Oud Wood, o prefieres sus clásicos como Black Orchid?';
    }
    
    if (lowerMessage.includes('creed')) {
      return 'CREED es una casa de perfumes con más de 260 años de historia. Sus fragancias son verdaderas obras maestras. Aventus es su fragancia más icónica, pero también tenemos otras joyas como Silver Mountain Water. ¿Hay alguna en particular que te llame la atención?';
    }
    
    // Respuestas sobre géneros
    if (lowerMessage.includes('mujer') || lowerMessage.includes('femenino')) {
      return 'Para mujer tenemos opciones increíbles: desde florales elegantes hasta orientales seductores. ¿Prefieres algo fresco y ligero para el día, o algo más intenso y sofisticado para la noche? También puedo recomendarte según la ocasión.';
    }
    
    if (lowerMessage.includes('hombre') || lowerMessage.includes('masculino')) {
      return 'Nuestras fragancias masculinas van desde frescas y deportivas hasta amaderadas y especiadas. ¿Buscas algo para uso diario, para el trabajo, o para ocasiones especiales? ¿Prefieres notas frescas, amaderadas, o más intensas?';
    }
    
    if (lowerMessage.includes('unisex')) {
      return 'Las fragancias unisex son perfectas para quienes buscan algo único y versátil. Tenemos opciones desde cítricas y frescas hasta amaderadas y especiadas que funcionan increíble en cualquier persona. ¿Qué tipo de notas te atraen más?';
    }
    
    // Respuestas sobre ocasiones
    if (lowerMessage.includes('trabajo') || lowerMessage.includes('oficina')) {
      return 'Para el trabajo recomiendo fragancias elegantes pero no muy intensas. Algo fresco y profesional que deje una buena impresión sin ser abrumador. ¿Prefieres notas cítricas, acuáticas, o algo más suave y sofisticado?';
    }
    
    if (lowerMessage.includes('noche') || lowerMessage.includes('fiesta') || lowerMessage.includes('cita')) {
      return 'Para la noche puedes ser más audaz! Te recomiendo fragancias intensas y seductoras con notas orientales, especiadas o amaderadas. ¿Buscas algo dulce y envolvente, o prefieres algo más misterioso y sofisticado?';
    }
    
    // Respuestas sobre presupuesto
    if (lowerMessage.includes('barato') || lowerMessage.includes('económico') || lowerMessage.includes('precio bajo')) {
      return 'Tenemos excelentes opciones desde $25! No necesitas gastar mucho para tener una fragancia de calidad. Puedes usar nuestros filtros de precio en el catálogo. ¿Tienes un presupuesto específico en mente?';
    }
    
    if (lowerMessage.includes('premium') || lowerMessage.includes('lujo') || lowerMessage.includes('caro')) {
      return 'Nuestras fragancias premium van hasta $150 y son verdaderas joyas. Marcas como CREED, TOM FORD y algunas ediciones especiales de MANCERA ofrecen experiencias olfativas únicas. ¿Buscas algo específico en el segmento de lujo?';
    }
    
    // Respuestas sobre tipos de notas
    if (lowerMessage.includes('dulce') || lowerMessage.includes('vainilla') || lowerMessage.includes('caramelo')) {
      return 'Las fragancias dulces son irresistibles! Tenemos opciones con vainilla, caramelo, frutas dulces y notas gourmand. MANCERA Roses Vanille es una excelente opción. ¿Te gustan más las dulces florales o las más intensas tipo postre?';
    }
    
    if (lowerMessage.includes('fresco') || lowerMessage.includes('cítrico') || lowerMessage.includes('limón')) {
      return 'Las fragancias frescas son perfectas para el día y climas cálidos. Tenemos opciones cítricas, acuáticas y verdes que dan esa sensación de frescura. ¿Prefieres algo más cítrico energizante o algo acuático relajante?';
    }
    
    if (lowerMessage.includes('amaderado') || lowerMessage.includes('madera') || lowerMessage.includes('sándalo')) {
      return 'Las notas amaderadas aportan elegancia y sofisticación. Desde sándalo suave hasta oud intenso, tenemos opciones para todos los gustos. ¿Buscas algo más suave y cremoso, o prefieres maderas más intensas y especiadas?';
    }
    
    // Respuestas sobre regalos
    if (lowerMessage.includes('regalo') || lowerMessage.includes('obsequio')) {
      return 'Un perfume es un regalo perfecto! Para acertar, necesito saber un poco sobre la persona: ¿es para hombre o mujer? ¿Qué edad aproximada? ¿Sabes qué tipo de fragancias le gustan o usa habitualmente?';
    }
    
    // Respuestas sobre duración
    if (lowerMessage.includes('duración') || lowerMessage.includes('duradero') || lowerMessage.includes('permanencia')) {
      return 'La duración depende del tipo de fragancia y tu piel. Los perfumes (Parfum) duran más que las aguas de tocador (EDT). MANCERA y CREED son conocidos por su excelente duración. ¿Buscas algo que dure todo el día?';
    }
    
    // Respuestas sobre aplicación
    if (lowerMessage.includes('aplicar') || lowerMessage.includes('usar') || lowerMessage.includes('cantidad')) {
      return 'Para aplicar perfume correctamente: 2-3 pulverizaciones en puntos de pulso (muñecas, cuello, detrás de las orejas). No frotes, deja que se seque naturalmente. ¿Tienes alguna duda específica sobre la aplicación?';
    }
    
    // Respuestas generales sobre ayuda
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('asesor') || lowerMessage.includes('recomend')) {
      return 'Estoy aquí para ayudarte a encontrar tu fragancia perfecta! Puedo recomendarte según tu género, ocasión de uso, tipo de notas que prefieres, presupuesto, o cualquier preferencia específica. ¿Qué te gustaría saber?';
    }
    
    // Respuestas sobre la tienda
    if (lowerMessage.includes('tienda') || lowerMessage.includes('ubicación') || lowerMessage.includes('dónde')) {
      return 'Somos una tienda especializada en perfumes premium ubicada en Managua, Nicaragua. Trabajamos con las mejores marcas del mundo y ofrecemos asesoría personalizada. Puedes explorar nuestro catálogo completo aquí en la web.';
    }
    
    // Respuestas sobre envíos
    if (lowerMessage.includes('envío') || lowerMessage.includes('entrega') || lowerMessage.includes('delivery')) {
      return 'Realizamos envíos a toda Nicaragua. Los tiempos y costos de envío varían según la ubicación. Para información específica sobre envíos a tu zona, puedes contactarnos directamente o revisar nuestras políticas de envío.';
    }
    
    // Respuesta por defecto más inteligente
    return 'Entiendo tu consulta sobre fragancias. Como especialista en perfumes, puedo ayudarte con recomendaciones personalizadas, información sobre marcas, notas olfativas, ocasiones de uso, y mucho más. ¿Hay algo específico que te gustaría saber sobre nuestros perfumes?';
  };

  return {
    sendMessage,
    isConnected,
    isLoading,
  };
};
