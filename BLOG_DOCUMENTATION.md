# 📝 Documentación del Sistema de Blog

## 🎯 Visión General

El blog de la tienda de perfumes es una plataforma editorial **independiente del inventario** que permite crear contenido educativo y de expertise sobre fragancias sin limitaciones de stock.

## 🏗️ Arquitectura del Sistema

### **Frontend (React + TypeScript)**
- **BlogPage.tsx** - Página principal del blog con diseño moderno
- **BlogComments.tsx** - Sistema de comentarios con moderación
- **useBlog.ts** - Hook para obtener posts desde Airtable
- **useComments.ts** - Hook para gestionar comentarios
- **blog.ts** - Tipos TypeScript para blog y comentarios

### **Backend (Airtable)**
- **Blog_Posts** - Tabla principal de artículos
- **Blog_Comments** - Tabla de comentarios con moderación

---

## 📋 Estructura de Datos

### **Tabla Blog_Posts**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `titulo` | Texto corto | Título del artículo | "Los 5 Mejores Perfumes de Tom Ford" |
| `slug` | Texto corto | URL amigable | "mejores-perfumes-tom-ford-2025" |
| `contenido` | Texto largo | Contenido completo del artículo | "En este artículo analizaremos..." |
| `resumen` | Texto largo | Extracto o introducción | "Descubre cuáles son los perfumes..." |
| `imagenPrincipal` | Adjunto/URL | Imagen destacada del artículo | URL o archivo subido |
| `categoria` | Selección única | Reseñas \| Guías \| Tendencias \| Consejos | "Reseñas" |
| `tags` | Texto múltiple | Etiquetas para clasificación | ["Tom Ford", "masculinos", "2025"] |
| `autor` | Texto corto | Nombre del autor | "María Perfumista" |
| `fechaPublicacion` | Fecha | Fecha de publicación | "2025-08-02" |
| `estado` | Selección única | Borrador \| Publicado \| Programado | "Publicado" |
| `seoTitle` | Texto corto | Título optimizado para SEO | "Mejores Perfumes Tom Ford 2025..." |
| `seoDescription` | Texto corto | Descripción para buscadores | "Descubre los 5 perfumes..." |
| `destacado` | Casilla | Si aparece en destacados | true/false |
| `vistas` | Número | Contador de visualizaciones | 1250 |

### **Tabla Blog_Comments**

| Campo | Tipo | Descripción | Quien lo completa |
|-------|------|-------------|-------------------|
| `Post_ID` | Texto corto | ID del post relacionado | Sistema automático |
| `Nombre` | Texto corto | Nombre del comentarista | Usuario |
| `Email` | Texto corto | Email del comentarista | Usuario |
| `Comentario` | Texto largo | Contenido del comentario | Usuario |
| `Fecha_Comentario` | Fecha | Fecha del comentario | Sistema automático |
| `Estado` | Selección única | Pendiente \| Aprobado \| Rechazado | Moderador |
| `Respuesta_A` | Texto corto | ID del comentario padre | Usuario (opcional) |
| `Blog_Post` | Vinculado | Relación con Blog_Posts | Sistema automático |
| `Es_Spam` | Casilla | Indica si es spam | Moderador |
| `Moderador` | Texto corto | Quien revisó el comentario | Moderador |

---

## 🎨 Características del Diseño

### **Diseño Moderno**
- **Gradientes** púrpura y rosa en elementos destacados
- **Typography** moderna con jerarquía clara
- **Cards** con sombras suaves y hover effects
- **Responsive** optimizado para móvil y desktop

### **Hero Section**
- Gradiente animado de fondo
- Título principal con subtítulo
- Estadísticas en tiempo real (posts, categorías)

### **Posts Destacados**
- Layout tipo magazine asimétrico
- Post principal grande + posts secundarios
- Badges de "Destacado" con iconos

### **Sistema de Filtros**
- Búsqueda por término
- Filtro por categoría
- Contadores dinámicos

---

## 💬 Sistema de Comentarios

### **Flujo del Usuario**
1. **Escribir comentario** → Formulario con validación
2. **Envío exitoso** → Popup de confirmación
3. **Moderación** → Estado "Pendiente" en Airtable
4. **Aprobación** → Cambiar a "Aprobado" manualmente
5. **Publicación** → Aparece en el blog automáticamente

### **Características**
- **Moderación obligatoria** - Todos los comentarios requieren aprobación
- **Popup de confirmación** - Informa sobre proceso de revisión
- **Respuestas anidadas** - Soporte para hilos de conversación
- **Detección de spam** - Campo Es_Spam para control
- **Auditoría** - Registro de moderador que aprobó

### **Estados de Comentarios**
- **Pendiente** - Recién enviado, esperando moderación
- **Aprobado** - Visible públicamente en el blog
- **Rechazado** - Oculto permanentemente

---

## 🔧 Configuración Técnica

### **Variables de Entorno**
```env
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_API_TOKEN=your_api_token
```

### **Tablas de Airtable**
- `Blog_Posts` - Artículos del blog
- `Blog_Comments` - Comentarios con moderación

### **Endpoints API**
- GET `/Blog_Posts` - Obtener posts publicados
- POST `/Blog_Comments` - Crear nuevo comentario
- GET `/Blog_Comments` - Obtener comentarios aprobados

---

## 🚀 Estrategia Editorial

### **Independencia del Inventario**
- **Libertad total** para escribir sobre cualquier perfume
- **No limitado** al stock actual de la tienda
- **Contenido evergreen** que no depende de cambios de inventario
- **Posicionamiento** como experto en fragancias

### **Tipos de Contenido Recomendados**

**Reseñas** 📝
- Análisis detallados de perfumes específicos
- Comparativas entre diferentes fragancias
- Primeras impresiones y evolución

**Guías** 📚
- "Cómo elegir perfume según tu personalidad"
- "Guía de familias olfativas"
- "Perfumes para cada estación del año"

**Tendencias** 📈
- "Fragancias que serán tendencia en 2025"
- "Nuevos lanzamientos destacados"
- "Marcas emergentes en el mundo del perfume"

**Consejos** 💡
- "5 errores al aplicar perfume"
- "Cómo conservar tus fragancias"
- "Perfumes para diferentes ocasiones"

---

## 🔍 SEO y Optimización

### **Campos SEO**
- **seoTitle** - Título optimizado (50-60 caracteres)
- **seoDescription** - Meta description (150-160 caracteres)
- **slug** - URL amigable sin espacios ni acentos

### **Estrategia de Keywords**
- Nombres de marcas y perfumes
- Términos relacionados con fragancias
- Long-tail keywords específicas
- Palabras clave locales y estacionales

### **Estructura de URLs**
```
/blog - Página principal del blog
/blog/[slug] - Artículo individual
```

---

## 🛠️ Mantenimiento

### **Moderación de Comentarios**
1. **Revisar** comentarios pendientes en Airtable
2. **Evaluar** contenido y relevancia
3. **Cambiar estado** a "Aprobado" o "Rechazado"
4. **Marcar spam** si es necesario
5. **Registrar moderador** en el campo correspondiente

### **Gestión de Contenido**
1. **Crear post** en Airtable con todos los campos
2. **Subir imagen** como adjunto o URL
3. **Configurar SEO** con título y descripción optimizados
4. **Establecer categoría** y tags relevantes
5. **Publicar** cambiando estado a "Publicado"

### **Monitoreo**
- **Vistas** - Tracking de popularidad de posts
- **Comentarios** - Engagement y participación
- **Categorías** - Balance de contenido
- **SEO** - Posicionamiento en buscadores

---

## 🎯 Próximas Mejoras

### **Funcionalidades Futuras**
- **Newsletter** - Suscripción a nuevos posts
- **Compartir social** - Botones de redes sociales
- **Posts relacionados** - Sugerencias automáticas
- **Búsqueda avanzada** - Por tags, autor, fecha
- **Analytics** - Dashboard de métricas detalladas

### **Optimizaciones**
- **Lazy loading** - Carga progresiva de imágenes
- **Cache avanzado** - Mejora de performance
- **PWA** - Funcionalidad offline
- **AMP** - Páginas móviles aceleradas

---

## 📞 Soporte

Para dudas sobre el sistema de blog:
1. **Revisar** esta documentación
2. **Consultar** logs en consola del navegador
3. **Verificar** configuración de Airtable
4. **Comprobar** variables de entorno

El blog está diseñado para ser **fácil de usar** y **altamente escalable**, permitiendo crear contenido de calidad que posicione la tienda como autoridad en el mundo de las fragancias.
