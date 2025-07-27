# 🌟 Essence Luxe - Tienda de Perfumes Premium

<div align="center">
  <img src="public/images/hero-perfume.jpg" alt="Essence Luxe" width="600" style="border-radius: 10px; margin: 20px 0;"/>
  
  <p><strong>Tienda online elegante y moderna para perfumes conectada a Airtable</strong></p>
  
  [![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-teal?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
</div>

## ✨ Características Principales

### 🎨 Diseño Premium
- ✅ Diseño elegante con paleta dorado/beige/negro/blanco
- ✅ Completamente responsivo (móviles, tablets, desktop)
- ✅ Animaciones suaves y transiciones elegantes
- ✅ Layout optimizado para experiencia de compra

### 🛒 Funcionalidades de E-commerce
- ✅ Catálogo dinámico conectado a Airtable
- ✅ Carrito de compras completo con persistencia
- ✅ Filtros por marca y búsqueda en tiempo real
- ✅ Sistema de ofertas automático
- ✅ Integración con WhatsApp para pedidos

### 🔗 Integración Airtable
- ✅ Conexión API en tiempo real
- ✅ Actualización automática de productos
- ✅ Manejo robusto de errores
- ✅ Cache optimizado para performance

## 🚀 Demo en Vivo

🌐 **[Ver Demo](https://your-vercel-url.vercel.app)** (Reemplaza con tu URL de Vercel)

## 📦 Instalación Rápida

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta de Airtable con API token

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/essence-luxe-perfumes.git
cd essence-luxe-perfumes
```

### 2. Instalar dependencias
```bash
pnpm install
# o npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Airtable:
```env
VITE_AIRTABLE_API_TOKEN=tu_api_token_real
VITE_AIRTABLE_BASE_ID=tu_base_id
VITE_AIRTABLE_TABLE_NAME=Productos
VITE_AIRTABLE_TABLE_ID=tu_table_id
```

### 4. Obtener credenciales de Airtable

<details>
<summary>📋 Cómo obtener API Token y Base ID</summary>

**API Token:**
1. Ve a [Airtable Account](https://airtable.com/account)
2. Navega a "Developer Hub" > "Personal access tokens"
3. Crea un nuevo token con permisos de lectura
4. Copia el token generado

**Base ID:**
1. Ve a [Airtable API](https://airtable.com/api)
2. Selecciona tu base de datos
3. En la URL verás `appXXXXXXXXXXXXXX` - ese es tu Base ID

</details>

### 5. Ejecutar en desarrollo
```bash
pnpm dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📊 Estructura de Datos Airtable

Tu tabla "Productos" debe incluir estos campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| **Descripción** | Single line text | Nombre del perfume |
| **Precio1** | Number | Precio regular |
| **Precio Oferta** | Number | Precio con descuento (opcional) |
| **tipo marca** | Single line text | Categoría/marca del perfume |
| **CODIGO KAME** | Single line text | Código único del producto |

## 🌐 Deployment

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftu-usuario%2Fessence-luxe-perfumes)

1. Haz fork de este repositorio
2. Conecta tu repositorio a [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel
4. Deploy automático

### Netlify

1. Conecta tu repositorio a [Netlify](https://netlify.com)
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Configura las variables de entorno

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **Styling:** TailwindCSS + Custom CSS
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Database:** Airtable API
- **Deployment:** Vercel/Netlify

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.tsx      # Navegación principal
│   ├── Footer.tsx      # Pie de página
│   ├── ProductCard.tsx # Tarjeta de producto
│   ├── FilterBar.tsx   # Barra de filtros
│   ├── CartModal.tsx   # Modal del carrito
│   └── LoadingSpinner.tsx
├── pages/              # Páginas principales
│   ├── HomePage.tsx    # Página de inicio
│   ├── CatalogPage.tsx # Catálogo completo
│   └── ContactPage.tsx # Página de contacto
├── hooks/              # Hooks personalizados
│   ├── useAirtable.ts  # Hook para API Airtable
│   └── useCart.ts      # Lógica del carrito
├── context/            # Contextos React
│   └── CartContext.tsx # Estado global del carrito
└── types/              # Tipos TypeScript
    └── product.ts      # Interfaces de productos
```

## 🎯 Funcionalidades Detalladas

### Carrito de Compras
- ✅ Agregar/quitar productos
- ✅ Actualizar cantidades
- ✅ Cálculo automático de totales
- ✅ Persistencia en localStorage
- ✅ Integración WhatsApp para pedidos

### Sistema de Filtros
- ✅ Filtro por tipo de marca
- ✅ Búsqueda por nombre/código
- ✅ Ordenamiento por precio
- ✅ Resultados en tiempo real

### Diseño Responsivo
- ✅ Mobile-first approach
- ✅ Breakpoints optimizados
- ✅ Touch-friendly interfaces
- ✅ Performance optimizado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 💬 Soporte

¿Necesitas ayuda?

- 📧 **Email:** info@essenceluxe.com
- 📱 **WhatsApp:** [+57 300 123 4567](https://wa.me/573001234567)
- 🐛 **Issues:** [GitHub Issues](https://github.com/tu-usuario/essence-luxe-perfumes/issues)

## 🙏 Agradecimientos

- Diseño inspirado en las mejores prácticas de e-commerce
- Icons por [Lucide](https://lucide.dev)
- Fuentes por [Google Fonts](https://fonts.google.com)

---

<div align="center">
  <p><strong>Desarrollado con ❤️ por MiniMax Agent</strong></p>
  <p>⭐ Si te gusta este proyecto, danos una estrella en GitHub</p>
</div>
