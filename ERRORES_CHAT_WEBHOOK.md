# DOCUMENTACIÓN DE ERRORES - CHAT WEBHOOK N8N

## 📋 RESUMEN DEL PROBLEMA

**Estado:** Chat webhook con conexión intermitente - A veces funciona, a veces no
**Fecha:** 2025-08-04
**Proyecto:** Tienda de Perfumes (persibuloi/kamenic)

## 🔍 DIAGNÓSTICO REALIZADO

### ✅ LO QUE FUNCIONA:
1. **Webhook de n8n:** Servidor funcionando correctamente
2. **Script de debug:** `debug-webhook.js` conecta exitosamente
3. **Respuesta del webhook:** Status 200, mensaje "Workflow was started"
4. **Componente SingleChat:** Creado y configurado correctamente
5. **Variable de entorno:** VITE_N8N_WEBHOOK_URL configurada en .env.local

### ❌ PROBLEMAS IDENTIFICADOS:

#### 1. **Conexión Intermitente Frontend-Webhook**
- **Síntoma:** A veces el chat frontend no envía mensajes al webhook
- **Evidencia:** Solo llegan mensajes del script de debug (Node.js), no del navegador
- **Headers esperados:** `user-agent: "node"` vs navegador

#### 2. **Variable de Entorno Inconsistente**
- **Problema:** `VITE_N8N_WEBHOOK_URL` a veces aparece como `undefined`
- **Causa:** Posible problema de recarga del servidor o configuración de Vite
- **Solución temporal:** Reiniciar servidor de desarrollo

#### 3. **Chats Duplicados (RESUELTO)**
- **Problema:** Aparecían múltiples botones de chat
- **Solución:** Eliminados componentes antiguos, solo queda `SingleChat.tsx`

## 🛠️ CONFIGURACIÓN ACTUAL

### Archivos Principales:
- **Componente:** `src/components/SingleChat.tsx`
- **Integración:** `src/App.tsx` (línea 101)
- **Debug:** `debug-webhook.js` (funcional)
- **Config:** `.env.local` con `VITE_N8N_WEBHOOK_URL`

### URL del Webhook:
```
https://n8n-n8n.wppjp8.easypanel.host/webhook-test/f1811e79-cf48-4e5a-ab66-72ed4fb59dc6
```

### Payload Enviado:
```json
{
  "message": "texto del usuario",
  "timestamp": "2025-08-05T02:40:56.649Z",
  "source": "perfume-store-chatbot",
  "userId": "web-user-1754361656651"
}
```

## 🔧 PASOS PARA CONTINUAR DEPURACIÓN

### 1. **Verificar Variables de Entorno**
```bash
# En el directorio del proyecto
echo $VITE_N8N_WEBHOOK_URL
# O revisar en consola del navegador:
console.log(import.meta.env.VITE_N8N_WEBHOOK_URL)
```

### 2. **Revisar Logs del Navegador**
- Abrir DevTools (F12) → Console
- Buscar mensajes de debug:
  - `🔍 DEBUG - Variable de entorno VITE_N8N_WEBHOOK_URL:`
  - `🚀 FRONTEND CHAT - Enviando mensaje:`
  - `📦 FRONTEND CHAT - Payload a enviar:`
  - `✅ FRONTEND CHAT - Status respuesta:`

### 3. **Revisar Network Tab**
- DevTools → Network
- Filtrar por XHR/Fetch
- Verificar si aparecen peticiones POST al webhook
- Revisar headers y payload

### 4. **Probar Script de Debug**
```bash
node debug-webhook.js
```
- Debe devolver Status 200 y `{"message":"Workflow was started"}`

### 5. **Reiniciar Servidor si es Necesario**
```bash
# Matar procesos Node.js
taskkill /F /IM node.exe

# Reiniciar servidor
npm run dev
```

## 🚨 ERRORES COMUNES

### Error 1: "Webhook no configurado"
- **Causa:** Variable de entorno no cargada
- **Solución:** Verificar `.env.local` y reiniciar servidor

### Error 2: "Error: No se pudo conectar con el webhook"
- **Causa:** Problema de red o CORS
- **Solución:** Verificar URL y configuración de n8n

### Error 3: Chats duplicados
- **Causa:** Múltiples componentes renderizándose
- **Solución:** Verificar que solo existe `SingleChat` en App.tsx

## 📁 ARCHIVOS MODIFICADOS

### `src/components/SingleChat.tsx`
- Componente principal del chat
- Debug logs agregados
- Posicionado en `right: '24px'`

### `src/App.tsx`
- Importa y renderiza `SingleChat`
- Debug de variable de entorno agregado
- Línea 101: `<SingleChat webhookUrl={webhookUrl} />`

### `.env.local`
```
VITE_N8N_WEBHOOK_URL=https://n8n-n8n.wppjp8.easypanel.host/webhook-test/f1811e79-cf48-4e5a-ab66-72ed4fb59dc6
```

### `debug-webhook.js`
- Script de prueba funcional
- Confirma que el webhook responde correctamente

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

1. **Verificar estado actual:** Abrir `http://localhost:5173/` y probar chat
2. **Revisar logs:** Console del navegador para mensajes de debug
3. **Probar script:** `node debug-webhook.js` para confirmar webhook
4. **Comparar headers:** Entre script (funciona) y frontend (falla)
5. **Revisar CORS:** Posible problema de política de origen cruzado
6. **Verificar Vite config:** Configuración de variables de entorno

## 📞 CONTACTO WEBHOOK N8N

- **URL:** https://n8n-n8n.wppjp8.easypanel.host/webhook-test/f1811e79-cf48-4e5a-ab66-72ed4fb59dc6
- **Método:** POST
- **Content-Type:** application/json
- **Respuesta esperada:** `{"message":"Workflow was started"}`

---

**Nota:** Este documento debe actualizarse cada vez que se identifiquen nuevos errores o soluciones.
