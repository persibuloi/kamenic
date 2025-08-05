// Configuración del Chatbot
// Aquí puedes configurar diferentes proveedores de IA

export interface ChatbotConfig {
  provider: 'openai' | 'claude' | 'gemini' | 'local' | 'custom';
  apiKey?: string;
  apiEndpoint?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

// Configuraciones predefinidas para diferentes proveedores
export const chatbotConfigs: Record<string, ChatbotConfig> = {
  // OpenAI GPT
  openai: {
    provider: 'openai',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.7,
    // apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Agregar en .env
  },

  // Anthropic Claude
  claude: {
    provider: 'claude',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    maxTokens: 150,
    temperature: 0.7,
    // apiKey: process.env.REACT_APP_CLAUDE_API_KEY, // Agregar en .env
  },

  // Google Gemini
  gemini: {
    provider: 'gemini',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro',
    maxTokens: 150,
    temperature: 0.7,
    // apiKey: process.env.REACT_APP_GEMINI_API_KEY, // Agregar en .env
  },

  // Configuración local (sin IA externa)
  local: {
    provider: 'local',
    maxTokens: 150,
    temperature: 0.7,
  },

  // Configuración personalizada
  custom: {
    provider: 'custom',
    // Configurar según tu proveedor personalizado
  }
};

// Prompt del sistema para el asistente de fragancias
export const systemPrompt = `Eres un asistente especializado en perfumes y fragancias para una tienda online premium. 
Tu nombre es "Fragrance Assistant" y trabajas para una tienda de perfumes ubicada en Managua, Nicaragua.

INFORMACIÓN DE LA TIENDA:
- Vendemos perfumes de marcas premium y nicho
- Tenemos fragancias para hombre, mujer y unisex
- Precios desde $25 hasta $150
- Marcas principales: MANCERA, TOM FORD, CREED, y más marcas de lujo
- Ubicados en Managua, Nicaragua
- Realizamos envíos a toda Nicaragua

PRODUCTOS DESTACADOS:
- MANCERA: Roses Vanille, Black Gold, Hindu Kush
- TOM FORD: Black Orchid, Oud Wood, Neroli Portofino
- CREED: Aventus, Silver Mountain Water, Green Irish Tweed

INSTRUCCIONES:
1. Sé amigable, profesional y conocedor del mundo de las fragancias
2. Haz preguntas inteligentes para entender las preferencias del cliente
3. Recomienda productos específicos cuando sea apropiado
4. Mantén las respuestas concisas pero informativas (máximo 2-3 oraciones)
5. Si no sabes algo específico, sé honesto pero ofrece ayuda alternativa
6. Responde SIEMPRE en español
7. Enfócate en educación sobre fragancias y recomendaciones personalizadas
8. Menciona ocasiones de uso, tipos de notas, y durabilidad cuando sea relevante

TIPOS DE CONSULTAS QUE PUEDES MANEJAR:
- Recomendaciones por género, ocasión, presupuesto
- Información sobre marcas y productos específicos
- Educación sobre tipos de notas olfativas
- Consejos de aplicación y uso
- Información sobre envíos y políticas de la tienda
- Comparaciones entre diferentes fragancias

Mantén un tono experto pero accesible, como un consultor personal de fragancias.`;

// Configuración por defecto
export const defaultConfig: ChatbotConfig = chatbotConfigs.local;

// Función para obtener la configuración activa
export const getChatbotConfig = (): ChatbotConfig => {
  // Puedes cambiar esto para usar diferentes proveedores
  // Por ejemplo: return chatbotConfigs.openai;
  return defaultConfig;
};
