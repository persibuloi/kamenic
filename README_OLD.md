# 🌟 Essence Luxe - Tienda de Perfumes Premium

Tienda online elegante y moderna para perfumes conectada a Airtable, desarrollada con React, TypeScript y TailwindCSS.

## ✨ Características

### 🎨 Diseño y UX
- ✅ Diseño elegante, limpio y profesional
- ✅ Completamente responsivo (móviles, tablets, desktop)
- ✅ Tipografía moderna y clara
- ✅ Paleta de colores: blanco, negro, dorado, beige
- ✅ Animaciones suaves en scroll y transiciones
- ✅ Layout atractivo para mostrar productos

### 🛒 Funcionalidades de Productos
- ✅ Mostrar descripción del perfume
- ✅ Mostrar precio regular (Precio1)
- ✅ Mostrar precio de oferta (Precio Oferta) si aplica
- ✅ Etiquetas visuales para tipo de marca
- ✅ Soporte para imágenes de productos
- ✅ Etiquetas destacadas "Oferta" cuando precio oferta < precio regular

### 🔍 Funcionalidades Interactivas
- ✅ Filtro por tipo de marca con interfaz intuitiva
- ✅ Buscador por nombre o código KAME con resultados en tiempo real
- ✅ Ordenamiento por precio (menor a mayor, mayor a menor)
- ✅ Ordenamiento por disponibilidad
- ✅ Carrito de compras simulado (agregar/quitar productos, mostrar total)
- ✅ Contador de productos en carrito

### 🔗 Integración Airtable
- ✅ Conexión a API de Airtable usando fetch
- ✅ Manejo de credenciales mediante variables de entorno
- ✅ Actualización automática de datos desde Airtable
- ✅ Manejo de errores de conexión
- ✅ Loading states durante carga de datos

### 📱 Páginas y Navegación
- ✅ Página principal con productos destacados
- ✅ Página de catálogo completo con filtros
- ✅ Página de contacto con información de la tienda
- ✅ Integración con WhatsApp (botón de contacto)
- ✅ Página de categorías/destacados
- ✅ Navegación intuitiva entre páginas

## 🚀 Configuración y Instalación

### Prerrequisitos
- Node.js 18+ y pnpm
- Cuenta de Airtable con API token

### 1. Clonar e instalar dependencias
```bash
cd perfume-store
pnpm install
```

### 2. Configurar variables de entorno
Copia el archivo `.env.example` a `.env` y completa con tus credenciales de Airtable:

```bash
cp .env.example .env
```

Edita el archivo `.env`:
```env
VITE_AIRTABLE_API_TOKEN=tu_api_token_aqui
VITE_AIRTABLE_BASE_ID=appTZ79zYJ6jwbRQg
VITE_AIRTABLE_TABLE_NAME=Productos
VITE_AIRTABLE_TABLE_ID=tblwlmMmN9X7NiWm5
```

### 3. Obtener API Token de Airtable
1. Ve a [Airtable Account](https://airtable.com/account)
2. Navega a "Developer Hub" > "Personal access tokens"
3. Crea un nuevo token con permisos de lectura para tu base
4. Copia el token y úsalo en la variable `VITE_AIRTABLE_API_TOKEN`

### 4. Estructura de la tabla Airtable
Asegúrate de que tu tabla "Productos" tenga estos campos:
- **Descripción** (Single line text)
- **Precio1** (Number)
- **Precio Oferta** (Number, opcional)
- **tipo marca** (Single line text)
- **CODIGO KAME** (Single line text)

### 5. Ejecutar en desarrollo
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

### 6. Construir para producción
```bash
pnpm build
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Netlify
1. Conecta tu repositorio a [Netlify](https://netlify.com)
2. Configura las variables de entorno
3. Comando de build: `pnpm build`
4. Carpeta de publicación: `dist`

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de build
- **TailwindCSS** - Framework de CSS
- **Lucide React** - Iconos
- **Airtable API** - Base de datos

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── FilterBar.tsx
│   ├── CartModal.tsx
│   └── LoadingSpinner.tsx
├── pages/              # Páginas principales
│   ├── HomePage.tsx
│   ├── CatalogPage.tsx
│   └── ContactPage.tsx
├── hooks/              # Hooks personalizados
│   ├── useAirtable.ts
│   └── useCart.ts
├── context/            # Contextos de React
│   └── CartContext.tsx
├── types/              # Tipos TypeScript
│   └── product.ts
└── App.tsx             # Componente principal
```

## 🎯 Funcionalidades Principales

### Catálogo de Productos
- Carga dinámica desde Airtable
- Filtros por marca y búsqueda
- Ordenamiento múltiple
- Vista de ofertas especiales

### Carrito de Compras
- Agregar/quitar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia en localStorage
- Integración con WhatsApp para pedidos

### Diseño Responsivo
- Mobile-first approach
- Adaptación automática a diferentes pantallas
- Navegación optimizada para touch

## 📞 Soporte

¿Necesitas ayuda? Contáctanos:
- 📧 Email: info@essenceluxe.com
- 📱 WhatsApp: +57 300 123 4567
- 🌐 Web: [www.essenceluxe.com](https://www.essenceluxe.com)

## 📄 Licencia

© 2024 Essence Luxe. Todos los derechos reservados.

---

**Desarrollado con ❤️ por MiniMax Agent**
