import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { FilterBar } from '../components/FilterBar';
import { LoadingSpinner, ProductGridSkeleton } from '../components/LoadingSpinner';
import ProductDetail from '../components/ProductDetail';
import AdvancedFilters from '../components/AdvancedFilters';

import { useAirtable } from '../hooks/useAirtable';
import { FilterOptions, Product } from '../types/product';

export function CatalogPage() {
  const { products, loading, error } = useAirtable();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Obtener marcas disponibles (normalizadas y únicas)
  const availableBrands = useMemo(() => {
    const brandMap = new Map<string, string>();
    products.forEach(p => {
      const rawMarca = typeof p.marca === 'string' ? p.marca : '';
      if (rawMarca.trim()) {
        const normalized = rawMarca.trim().toLowerCase();
        if (!brandMap.has(normalized)) {
          const capitalized = rawMarca.trim().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
          brandMap.set(normalized, capitalized);
        }
      }
    });
    return Array.from(brandMap.values()).sort();
  }, [products]);

  // DEBUG: Mostrar valores reales de tipoMarca y availableBrands
  useEffect(() => {
    if (products) {
      // eslint-disable-next-line no-console
      console.log('PRODUCTS tipoMarcas:', products.map(p => p.tipoMarca));
    }
    // eslint-disable-next-line no-console
    console.log('availableBrands:', availableBrands);
  }, [products, availableBrands]);

  // Eliminar productos duplicados por id
  const uniqueProducts = useMemo(() => {
    const seen = new Set();
    const duplicates: string[] = [];
    
    const unique = products.filter(p => {
      if (seen.has(p.id)) {
        duplicates.push(p.id);
        return false;
      }
      seen.add(p.id);
      return true;
    });

    // Log detallado para debugging
    if (import.meta.env.DEV) {
      console.log('=== ANÁLISIS DE PRODUCTOS ===');
      console.log('Productos totales recibidos:', products.length);
      console.log('Productos únicos después de eliminar duplicados:', unique.length);
      console.log('IDs duplicados encontrados:', duplicates.length, duplicates);
      
      // Análisis por existencia
      const conExistencia = unique.filter(p => p.existenciaActual > 0);
      const sinExistencia = unique.filter(p => p.existenciaActual === 0);
      const existenciaInvalida = unique.filter(p => typeof p.existenciaActual !== 'number' || p.existenciaActual < 0);
      
      console.log('Productos con existenciaActual > 0:', conExistencia.length);
      console.log('Productos con existenciaActual = 0:', sinExistencia.length);
      console.log('Productos con existencia inválida:', existenciaInvalida.length);
      
      // Mostrar algunos ejemplos de productos con existencia > 0
      console.log('Ejemplos de productos con existencia > 0:', 
        conExistencia.slice(0, 5).map(p => ({
          id: p.id,
          descripcion: p.descripcion.substring(0, 30) + '...',
          existenciaActual: p.existenciaActual,
          tipoMarca: p.tipoMarca
        }))
      );
      
      // Verificar si hay productos sin descripción o con datos faltantes
      const sinDescripcion = unique.filter(p => !p.descripcion || p.descripcion.trim() === '');
      const sinMarca = unique.filter(p => !p.tipoMarca || p.tipoMarca.trim() === '');
      
      console.log('Productos sin descripción:', sinDescripcion.length);
      console.log('Productos sin marca:', sinMarca.length);
    }

    return unique;
  }, [products]);

  // Filtrar y ordenar productos con nueva estructura
  const [filters, setFilters] = useState<FilterOptions>({
    marca: '',
    tipoMarca: '',
    genero: '',
    searchTerm: '',
    priceRange: undefined,
    sortBy: 'default',
    showOnlyOffers: false,
    showOnlyInStock: true
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...uniqueProducts];

    // Log para debugging - mostrar todos los productos únicos
    if (import.meta.env.DEV) {
      console.log('\n=== PROCESO DE FILTRADO ===');
      console.log('Productos únicos antes del filtrado:', filtered.length);
      console.log('Productos por existencia:', {
        conExistencia: filtered.filter(p => p.existenciaActual > 0).length,
        sinExistencia: filtered.filter(p => p.existenciaActual === 0).length,
        existenciaUndefined: filtered.filter(p => p.existenciaActual === undefined || p.existenciaActual === null).length
      });
      console.log('Filtros activos:', filters);
    }

    // Filtro por stock (solo si showOnlyInStock está activo)
    if (filters.showOnlyInStock) {
      const filteredByExistence = filtered.filter(product => 
        typeof product.existenciaActual === 'number' && product.existenciaActual > 0
      );
      
      if (import.meta.env.DEV) {
        console.log('Después del filtro por existencia (solo > 0):', filteredByExistence.length);
        console.log('Productos eliminados por falta de existencia:', filtered.length - filteredByExistence.length);
      }
      
      filtered = filteredByExistence;
    }

    // Filtro por marca
    if (filters.marca) {
      const beforeBrandFilter = filtered.length;
      filtered = filtered.filter(product => {
        if (!product.marca) return false;
        return product.marca.trim().toLowerCase() === filters.marca.trim().toLowerCase();
      });
      
      if (import.meta.env.DEV) {
        console.log(`Después del filtro por marca '${filters.marca}':`, filtered.length, `(eliminados: ${beforeBrandFilter - filtered.length})`);
      }
    }

    // Filtro por tipo de marca
    if (filters.tipoMarca) {
      const beforeTypeFilter = filtered.length;
      filtered = filtered.filter(product => {
        if (!product.tipoMarca) return false;
        return product.tipoMarca.trim().toLowerCase() === filters.tipoMarca.trim().toLowerCase();
      });
      
      if (import.meta.env.DEV) {
        console.log(`Después del filtro por tipo de marca '${filters.tipoMarca}':`, filtered.length, `(eliminados: ${beforeTypeFilter - filtered.length})`);
      }
    }

    // Filtro por género
    if (filters.genero) {
      const beforeGenderFilter = filtered.length;
      filtered = filtered.filter(product => {
        if (!product.genero) return false;
        return product.genero.trim().toLowerCase() === filters.genero.trim().toLowerCase();
      });
      
      if (import.meta.env.DEV) {
        console.log(`Después del filtro por género '${filters.genero}':`, filtered.length, `(eliminados: ${beforeGenderFilter - filtered.length})`);
      }
    }

    // Filtro por rango de precios
    if (filters.priceRange) {
      const beforePriceFilter = filtered.length;
      filtered = filtered.filter(product => {
        const price = product.precioOferta || product.precio1;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
      
      if (import.meta.env.DEV) {
        console.log(`Después del filtro por precio $${filters.priceRange.min}-$${filters.priceRange.max}:`, filtered.length, `(eliminados: ${beforePriceFilter - filtered.length})`);
      }
    }

    // Filtro por término de búsqueda (descripción y marca)
    if (filters.searchTerm) {
      const beforeSearchFilter = filtered.length;
      filtered = filtered.filter(product =>
        product.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        (product.marca && product.marca.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
      
      if (import.meta.env.DEV) {
        console.log(`Después del filtro por búsqueda '${filters.searchTerm}':`, filtered.length, `(eliminados: ${beforeSearchFilter - filtered.length})`);
      }
    }

    // Filtro de ofertas
    if (filters.showOnlyOffers) {
      const beforeOffersFilter = filtered.length;
      filtered = filtered.filter(product => typeof product.precioOferta === 'number' && product.precioOferta < product.precio1);
      
      if (import.meta.env.DEV) {
        console.log('Después del filtro de ofertas:', filtered.length, `(eliminados: ${beforeOffersFilter - filtered.length})`);
      }
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.precio1 - b.precio1);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.precio1 - a.precio1);
        break;
      case 'name':
        filtered.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        break;
      default:
        // Mantener orden original
        break;
    }

    if (import.meta.env.DEV) {
      console.log('PRODUCTOS FINALES DESPUÉS DE TODOS LOS FILTROS:', filtered.length);
      console.log('=== FIN PROCESO DE FILTRADO ===\n');
    }

    return filtered;
  }, [uniqueProducts, filters]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Catálogo de Perfumes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestra colección completa de fragancias exclusivas
          </p>
        </div>

        {/* Filtros */}
        <FilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          availableBrands={availableBrands}
        />

        {/* Contador de resultados */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">
              {/* Mostrar el conteo correcto basado en productos con existencia */}
              {(() => {
                const productsWithStock = uniqueProducts.filter(p => p.existenciaActual > 0);
                return filteredProducts.length === productsWithStock.length 
                  ? `Mostrando todos los ${productsWithStock.length} productos disponibles`
                  : `Mostrando ${filteredProducts.length} de ${productsWithStock.length} productos disponibles`;
              })()
              }
            </p>
            {/* Solo mostrar debug en desarrollo local */}
            {import.meta.env.DEV && import.meta.env.MODE === 'development' && (
              <div className="mt-2 text-sm text-gray-500">
                <p>Debug: Productos totales desde Airtable: {products.length}</p>
                <p>Debug: Productos únicos: {uniqueProducts.length}</p>
                <p>Debug: Productos con existencia &gt; 0: {uniqueProducts.filter(p => p.existenciaActual > 0).length}</p>
                <p>Debug: Productos con existencia = 0: {uniqueProducts.filter(p => p.existenciaActual === 0).length}</p>
              </div>
            )}
          </div>
        )}

        {/* Contenido principal */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <h3 className="text-red-600 font-semibold text-lg mb-2">Error al cargar productos</h3>
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <ProductGridSkeleton />
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta ajustar los filtros o términos de búsqueda
                  </p>
                  <button 
                    onClick={() => setFilters({
                      marca: '',
                      tipoMarca: '',
                      genero: '',
                      searchTerm: '',
                      priceRange: undefined,
                      sortBy: 'default',
                      showOnlyOffers: false,
                      showOnlyInStock: true
                    })}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Paginación futura (placeholder) */}
        {!loading && !error && filteredProducts.length > 12 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500">
              ¿No encuentras lo que buscas? 
              <a href="#contact" className="text-amber-600 hover:text-amber-700 font-medium">
                Contáctanos
              </a>
            </p>
          </div>
        )}
        {/* Modales */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(product) => {
              // Aquí puedes agregar lógica del carrito si tienes un contexto
              console.log('Agregar al carrito:', product);
              setSelectedProduct(null);
            }}
          />
        )}

        {showAdvancedFilters && (
          <AdvancedFilters
            products={uniqueProducts}
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters);
              setShowAdvancedFilters(false);
            }}
            onClose={() => setShowAdvancedFilters(false)}
          />
        )}
      </div>
    </div>
  );
}
