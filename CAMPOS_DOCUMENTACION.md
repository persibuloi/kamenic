# Documentación de Campos - Tienda de Perfumes

## 📋 Campos de Productos (Airtable)

### Campos Principales

| Campo | Tipo | Descripción | Ejemplo | Requerido |
|-------|------|-------------|---------|-----------|
| **Código KAME** | String | Identificador único del producto | `PM48`, `PH23` | ✅ |
| **Descripción** | String | Nombre corto del producto | `Perfume p/mujer MANCERA ROSES VANILLE EDP 120ml` | ✅ |
| **Descripción Larga** | String/IA Field | Descripción detallada del producto | `Fragancia oriental floral con notas de rosa y vainilla...` | ❌ |
| **Marca** | String | Marca del perfume | `MANCERA`, `DIOR`, `CHANEL` | ✅ |
| **Género** | String | Género del perfume | `Mujer`, `Hombre`, `Unisex` | ✅ |
| **Tipo Marca** | String/IA Field | Categoría de la marca | `NICHO`, `ÁRABES`, `PREMIUM` | ✅ |
| **Precio1** | Number | Precio principal | `89.00` | ✅ |
| **Precio Oferta** | Number | Precio con descuento (opcional) | `75.00` | ❌ |
| **Existencia Actual** | Number | Stock disponible | `15`, `0` | ✅ |
| **Foto** | Attachment/String | Imagen del producto | URL de imagen | ❌ |

### Campos Especiales (IA Fields)

Algunos campos en Airtable están configurados como **Field Agents (IA)** y tienen una estructura especial:

```javascript
// Estructura de campo IA
{
  state: "completed",
  value: "NICHO",
  isStale: false
}
```

**Campos que pueden ser IA Fields:**
- `Descripción Larga`
- `Tipo Marca`

## 🔧 Funciones de Extracción

### Funciones Auxiliares Implementadas

```typescript
// Extracción de campos básicos
getCodigoKameValue(fields: any): string
getMarcaValue(fields: any): string
getGeneroValue(fields: any): string
getExistenciaValue(fields: any): number
getImageValue(fields: any): string

// Extracción de campos IA
getDescripcionLargaValue(fields: any): string
getTipoMarcaValue(fields: any): string
```

### Nombres de Campos Alternativos

Las funciones buscan múltiples variaciones de nombres:

```typescript
// Código KAME
['Codigo KAME', 'CODIGO KAME', 'codigo kame', 'CodigoKame']

// Descripción Larga
['Descripcion Larga', 'DESCRIPCION LARGA', 'descripcion larga', 'DescripcionLarga']

// Tipo Marca
['Tipo Marca', 'TIPO MARCA', 'tipo marca', 'TipoMarca']

// Existencia
['Existencia Actual', 'EXISTENCIA ACTUAL', 'existencia actual', 'ExistenciaActual']
```

## 🎨 Estructura de Producto (TypeScript)

```typescript
interface Product {
  id: string;                    // ID único de Airtable
  codigoKame: string;           // Código KAME
  descripcion: string;          // Descripción corta
  descripcionLarga?: string;    // Descripción detallada
  marca: string;                // Marca del perfume
  genero: string;               // Género
  tipoMarca: string;            // Tipo de marca
  precio1: number;              // Precio principal
  precioOferta?: number;        // Precio oferta
  existenciaActual: number;     // Stock
  imagen: string;               // URL de imagen
}
```

## 🔍 Filtros Disponibles

### Filtros Rápidos (FilterBar)
1. **Búsqueda** - Por nombre/descripción
2. **Marcas** - MANCERA, DIOR, CHANEL, etc.
3. **Tipo de Marca** - NICHO, ÁRABES, PREMIUM, etc.
4. **Ordenamiento** - Nombre, precio ascendente/descendente
5. **Solo Ofertas** - Productos con descuento

### Filtros Avanzados (AdvancedFilters)
1. **Búsqueda** - Texto libre
2. **Marca** - Dropdown con todas las marcas
3. **Tipo de Marca** - Dropdown con todos los tipos
4. **Género** - Radio buttons (Todos, Mujer, Hombre, Unisex)
5. **Rango de Precios** - Inputs numéricos min/max
6. **Ordenamiento** - Múltiples opciones
7. **Solo Ofertas** - Checkbox
8. **Solo en Stock** - Checkbox

## 📊 Estadísticas del Catálogo

- **Total de productos**: 183 (desde Airtable)
- **Productos con stock**: 56 productos
- **Productos por página**: 16 (paginación implementada)
- **Campos implementados**: 10 campos principales
- **Filtros disponibles**: 8 filtros diferentes
- **Funciones auxiliares**: 8 funciones de extracción

## 🛠️ Manejo de Datos Especiales

### Campos IA (Field Agents)
```typescript
// Extracción robusta para campos IA
if (typeof fieldValue === 'object' && fieldValue !== null) {
  if (fieldValue.value && typeof fieldValue.value === 'string') {
    return fieldValue.value.trim();
  }
}
```

### Arrays de Datos
```typescript
// Manejo de arrays con posibles objetos IA
if (Array.isArray(fieldValue) && fieldValue.length > 0) {
  const firstValue = fieldValue[0];
  if (typeof firstValue === 'object' && firstValue.value) {
    return String(firstValue.value).trim();
  }
  return String(firstValue).trim();
}
```

### Imágenes por Defecto
```typescript
// Sistema de imágenes fallback
const defaultImages = [
  '/images/product-sample-1.jpg',
  '/images/product-sample-2.jpg',
  '/images/product-sample-3.jpg'
];
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
- [x] Paginación (16 productos por página)
- [x] Filtros rápidos y avanzados
- [x] Vista de detalles con modal
- [x] Carrito funcional
- [x] Soporte para campos IA de Airtable
- [x] Botones separados "Detalles" y "Agregar"
- [x] Debugging y logging detallado

### 📈 Métricas de Rendimiento
- **Carga inicial**: Optimizada con paginación
- **Filtrado**: Instantáneo en cliente
- **Búsqueda**: Tiempo real mientras escribes
- **Navegación**: Fluida entre páginas

---

**Última actualización**: 2 de Agosto, 2025  
**Versión**: 1.0 - Proyecto Completado  
**Estado**: ✅ Producción
