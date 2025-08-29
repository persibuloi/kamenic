# Funnel de Distribuidores (KAME / Essence Luxe)

Este documento resume la implementación del funnel de distribuidores: arquitectura, componentes, variables, configuración de Airtable, pruebas y próximos pasos.

## Resumen
- Ruta: `/#distributors` (hash routing en `src/App.tsx`).
- Descubrimiento: enlace discreto en el footer (`src/components/Footer.tsx`).
- Gate de pre‑calificación: `src/components/DistributorGate.tsx`.
- Formulario calificado: `src/components/DistributorForm.tsx`.
- Página landing: `src/pages/DistributorsPage.tsx` (hero + beneficios + FAQs + gate).
- Integración Airtable: `src/lib/airtableDistributors.ts`.
- UX: sólo muestra el formulario si el usuario califica (Negocio=Sí y Volumen=Medio/Alto). Caso contrario, CTA a WhatsApp.

## Arquitectura y flujo
1. Usuario navega a `/#distributors`.
2. `DistributorsPage` renderiza hero/beneficios/FAQs y el `DistributorGate`.
3. Gate pregunta: `¿Tienes negocio?`, `Ciudad`, `Volumen (Bajo/Medio/Alto)`.
4. Regla: Formulario se muestra únicamente si `Business = true` y `Volume ∈ {Medio, Alto}`.
5. Al enviar el formulario, se hace POST a Airtable (tabla `LeadsDistribuidores`).
6. Feedback: spinner de carga, alerta de éxito y botón a WhatsApp.

## Archivos clave
- `src/pages/DistributorsPage.tsx`
  - UI de landing con acentos visuales, íconos (`lucide-react`) y FAQs.
- `src/components/DistributorGate.tsx`
  - Lógica de pre‑calificación + mensaje cordial cuando no califica + CTA WhatsApp.
- `src/components/DistributorForm.tsx`
  - Campos: `Name*`, `Email*`, `Phone`, `City`, `Business`, `Volume`, `Brands`, `Message`.
  - Estados: `loading`, `error`, `success`.
  - Envía `Estado = "Nuevo"` y `Origen = "web|utm_*"` si hay UTM en la URL.
- `src/lib/airtableDistributors.ts`
  - `sendDistributorLead(payload)`
  - Usa SIEMPRE `VITE_AIRTABLE_BASE_ID` y por defecto la tabla `LeadsDistribuidores` si no se define var de entorno.
  - Envío con `{ typecast: true }` para aceptar valores nuevos en el multi-select `Brands`.
- `src/App.tsx`
  - Hash routing, case `'distributors'`.
- `src/components/Footer.tsx`
  - Link discreto a `#distributors`.

## Variables de entorno
Obligatorias para Airtable (en `.env`):
- `VITE_AIRTABLE_API_TOKEN=pat_...`
- `VITE_AIRTABLE_BASE_ID=app...`

Opcionales:
- `VITE_AIRTABLE_DISTRIBUTORS_TABLE` (default: `LeadsDistribuidores`).
- `VITE_WHATSAPP_DISTRIBUIDORES` (fallback incluido si no se define).

## Configuración de Airtable
Base: la misma del catálogo.
Tabla: `LeadsDistribuidores` con campos:
- `Name` (Single line text) — requerido
- `Email` (Email o text) — requerido
- `Phone` (text)
- `City` (text)
- `Business` (checkbox)
- `Volume` (single select: `Bajo`, `Medio`, `Alto`)
- `Brands` (multiple select) — nuevas opciones se crean automáticamente gracias a `typecast: true`
- `Message` (long text)
- `Origen` (text) — se envía como `web|utm_*` si hay parámetros
- `Estado` (single select: `Nuevo`, `Contactado`, `Calificado`, `Descartado`) — default enviado: `Nuevo`
- `Fecha` (Created time) — lo rellena Airtable

## Pruebas rápidas
1. Arrancar dev server y abrir `/#distributors`.
2. Gate:
   - Seleccionar `Sí` en `¿Tienes negocio?`.
   - Seleccionar `Medio` o `Alto` en Volumen → se muestra el formulario.
3. Formulario: completar `Name` y `Email` (mínimo). Opcional: `Phone`, `City`, `Brands` (ej: `Lattafa, Montale`).
4. Enviar → revisar DevTools/Network:
   - Request a `https://api.airtable.com/v0/{BASE}/LeadsDistribuidores`.
   - 200 OK = registro creado. También verás tarjeta verde de éxito.
5. Validar en Airtable que el registro esté con campos correctos.

## Copys y UX
- Mensaje calificado (dispuesto a ver el formulario): “¡Excelente! Completa el formulario y nos pondremos en contacto contigo.”
- Mensaje no calificado: cordial, invita a WhatsApp sin lenguaje de “priorizar”.
- Botón de envío por ahora: “Enviar solicitud”. (Se puede cambiar a “Guardar”).

## Troubleshooting
- `Field "Brands" cannot accept the provided value` → Asegurar campo Multiple select. Ya se habilitó `typecast: true` para crear opciones.
- `INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND` → revisar token/base/tabla.
- No se crean registros → confirmar `VITE_AIRTABLE_API_TOKEN`, `VITE_AIRTABLE_BASE_ID`, nombre exacto de la tabla y reiniciar dev server tras cambios en `.env`.

## Próximos pasos sugeridos
- Analítica: eventos en envío y clics de WhatsApp (Google Analytics). 
- Personalizar copy al tono exacto de KAME.
- Validación adicional: email formato, longitud de mensaje.
- Desplegar a producción: push a GitHub → Vercel redeploy.

## Checklist para deploy
- **Variables en Vercel**: `VITE_AIRTABLE_API_TOKEN`, `VITE_AIRTABLE_BASE_ID`.
- **Tabla Airtable**: existe `LeadsDistribuidores` con campos definidos.
- **Build local ok**: probar `/#distributors` y envío de lead.
- **Push a GitHub** (rama `master`): dispara redeploy en Vercel.
- **Smoke test prod**: repetir envío de lead y validar en Airtable.

---
Última actualización: 2025-08-29
