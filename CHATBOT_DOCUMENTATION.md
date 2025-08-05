# 🤖 Documentación del Chatbot de Fragancias

## 📋 Descripción General

Se ha implementado un chatbot moderno y visualmente atractivo especializado en asesoría de perfumes y fragancias. El chatbot está diseñado para proporcionar recomendaciones personalizadas, información sobre productos y asistencia general a los clientes de la tienda.

## ✨ Características Principales

### 🎨 **Diseño Visual**
- **Interfaz moderna** con gradientes y efectos glassmorphism
- **Animaciones fluidas** con transiciones suaves
- **Responsive design** que se adapta a móviles y desktop
- **Modo oscuro automático** según preferencias del sistema
- **Botón flotante** elegante con efectos hover
- **Indicador de escritura** animado cuando el bot responde

### 🧠 **Inteligencia y Funcionalidades**
- **Respuestas contextuales** sobre perfumes y fragancias
- **Recomendaciones personalizadas** según preferencias del usuario
- **Base de conocimiento** sobre marcas premium (MANCERA, TOM FORD, CREED)
- **Asesoría por ocasión** (trabajo, noche, día, citas)
- **Filtrado por presupuesto** y tipo de notas olfativas
- **Información sobre la tienda** y políticas de envío

### 🔌 **Integración con IA**
- **Configuración flexible** para múltiples proveedores de IA
- **Soporte nativo** para OpenAI, Claude, Gemini
- **Modo local** con respuestas inteligentes sin IA externa
- **Fácil configuración** a través de variables de entorno

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── Chatbot/
│       ├── Chatbot.tsx      # Componente principal del chatbot
│       └── Chatbot.css      # Estilos y animaciones
├── hooks/
│   └── useChatbot.ts        # Hook personalizado para lógica del chatbot
└── config/
    └── chatbot.config.ts    # Configuración de proveedores de IA
```

## 🚀 Implementación

### **1. Componente Principal (`Chatbot.tsx`)**
- Maneja la interfaz de usuario y la experiencia visual
- Gestiona el estado de mensajes y la interacción del usuario
- Incluye efectos de escritura y animaciones

### **2. Hook Personalizado (`useChatbot.ts`)**
- Contiene la lógica de comunicación con servicios de IA
- Maneja respuestas inteligentes locales como fallback
- Gestiona estados de conexión y carga

### **3. Configuración (`chatbot.config.ts`)**
- Define configuraciones para diferentes proveedores de IA
- Incluye el prompt del sistema optimizado para fragancias
- Permite fácil cambio entre proveedores

## ⚙️ Configuración de IA

### **Proveedores Soportados:**

#### **OpenAI GPT**
```typescript
// En .env
REACT_APP_OPENAI_API_KEY=tu_api_key_aqui

// En chatbot.config.ts
export const activeConfig = chatbotConfigs.openai;
```

#### **Anthropic Claude**
```typescript
// En .env
REACT_APP_CLAUDE_API_KEY=tu_api_key_aqui

// En chatbot.config.ts
export const activeConfig = chatbotConfigs.claude;
```

#### **Google Gemini**
```typescript
// En .env
REACT_APP_GEMINI_API_KEY=tu_api_key_aqui

// En chatbot.config.ts
export const activeConfig = chatbotConfigs.gemini;
```

#### **Modo Local (Sin IA Externa)**
```typescript
// No requiere API key
// En chatbot.config.ts
export const activeConfig = chatbotConfigs.local;
```

## 💡 Ejemplos de Uso

### **Consultas que el Chatbot Puede Manejar:**

1. **Recomendaciones por Género:**
   - "Busco un perfume para mujer"
   - "¿Qué fragancias masculinas recomiendan?"

2. **Recomendaciones por Ocasión:**
   - "Necesito algo para el trabajo"
   - "Busco un perfume para una cita romántica"

3. **Información sobre Marcas:**
   - "¿Qué perfumes de MANCERA tienen?"
   - "Cuéntame sobre TOM FORD"

4. **Filtrado por Presupuesto:**
   - "Busco algo económico"
   - "¿Qué opciones premium tienen?"

5. **Tipos de Notas:**
   - "Me gustan las fragancias dulces"
   - "Prefiero algo fresco y cítrico"

## 🎯 Funcionalidades Avanzadas

### **Respuestas Contextuales**
El chatbot utiliza un sistema de respuestas inteligentes que:
- Analiza palabras clave en las consultas
- Proporciona recomendaciones específicas
- Hace preguntas de seguimiento para refinar sugerencias
- Mantiene el contexto de la conversación

### **Base de Conocimiento**
Incluye información detallada sobre:
- **56 productos** disponibles en la tienda
- **Marcas premium** y sus características
- **Tipos de notas olfativas** y sus descripciones
- **Ocasiones de uso** y recomendaciones apropiadas
- **Políticas de la tienda** y información de envíos

## 📱 Experiencia de Usuario

### **Interfaz Intuitiva:**
- **Botón flotante** siempre visible en la esquina inferior derecha
- **Apertura suave** con animación de escala y desvanecimiento
- **Chat familiar** similar a WhatsApp o Messenger
- **Indicadores visuales** para mensajes del usuario vs bot
- **Timestamps** para cada mensaje
- **Scroll automático** a nuevos mensajes

### **Responsive Design:**
- **Desktop:** Ventana flotante de 380px de ancho
- **Mobile:** Se expande para usar casi toda la pantalla
- **Adaptación automática** según el tamaño de dispositivo

## 🔧 Personalización

### **Cambiar Proveedor de IA:**
```typescript
// En src/config/chatbot.config.ts
export const getChatbotConfig = (): ChatbotConfig => {
  return chatbotConfigs.openai; // Cambiar por el proveedor deseado
};
```

### **Modificar Prompt del Sistema:**
```typescript
// En src/config/chatbot.config.ts
export const systemPrompt = `
Tu prompt personalizado aquí...
`;
```

### **Personalizar Estilos:**
```css
/* En src/components/Chatbot/Chatbot.css */
.chatbot-toggle {
  /* Modificar colores, tamaños, etc. */
}
```

## 🚀 Próximas Mejoras Sugeridas

1. **Integración con Catálogo:**
   - Mostrar productos específicos en el chat
   - Enlaces directos a páginas de productos
   - Imágenes de productos en las respuestas

2. **Historial de Conversaciones:**
   - Guardar conversaciones en localStorage
   - Continuar conversaciones previas
   - Exportar historial de chat

3. **Análisis de Sentimientos:**
   - Detectar satisfacción del cliente
   - Adaptar respuestas según el tono
   - Métricas de efectividad

4. **Integración con CRM:**
   - Capturar leads potenciales
   - Seguimiento de consultas
   - Análisis de patrones de consulta

## 📊 Métricas y Analytics

El chatbot está preparado para recopilar métricas como:
- Número de conversaciones iniciadas
- Consultas más frecuentes
- Tiempo de respuesta promedio
- Satisfacción del usuario
- Conversiones generadas

## 🔒 Seguridad y Privacidad

- **API Keys** manejadas a través de variables de entorno
- **No almacenamiento** de conversaciones en servidores externos
- **Respuestas locales** como fallback para mayor privacidad
- **Validación** de entrada para prevenir inyecciones

---

## ✅ Estado Actual

**✅ IMPLEMENTADO Y FUNCIONAL**

El chatbot está completamente integrado en la aplicación y listo para usar. Actualmente funciona en modo local con respuestas inteligentes. Para activar IA externa, simplemente configura las API keys correspondientes en el archivo `.env` y actualiza la configuración en `chatbot.config.ts`.

**Ubicación:** Botón flotante en la esquina inferior derecha de todas las páginas de la aplicación.
