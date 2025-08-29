import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;

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

  // Obtener tipos de marca disponibles (normalizados y únicos)
  const availableTipoMarcas = useMemo(() => {
    const tipoMarcaMap = new Map<string, string>();
    products.forEach(p => {
      const rawTipoMarca = typeof p.tipoMarca === 'string' ? p.tipoMarca : '';
      if (rawTipoMarca.trim()) {
        const normalized = rawTipoMarca.trim().toLowerCase();
        if (!tipoMarcaMap.has(normalized)) {
          const capitalized = rawTipoMarca.trim().toUpperCase(); // Mantener en mayúsculas para NICHO, ÁRABES, etc.
          tipoMarcaMap.set(normalized, capitalized);
        }
      }
    });
    return Array.from(tipoMarcaMap.values()).sort();
  }, [products]);

  // Obtener géneros disponibles (normalizados y únicos)
  const availableGenders = useMemo(() => {
    const genderMap = new Map<string, string>();
    products.forEach(p => {
      const rawGenero = typeof p.genero === 'string' ? p.genero : '';
      if (rawGenero.trim()) {
        const normalized = rawGenero.trim().toLowerCase();
        if (!genderMap.has(normalized)) {
          const capitalized = rawGenero.trim().replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
          genderMap.set(normalized, capitalized);
        }
      }
    });
    return Array.from(genderMap.values()).sort();
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
  
  // Manejar parámetros de búsqueda desde la URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      console.log('CatalogPage - Hash actual:', hash);
      
      const searchParams = new URLSearchParams(hash.split('?')[1] || '');
      const searchFromUrl = searchParams.get('search');
      
      console.log('CatalogPage - Parámetro de búsqueda:', searchFromUrl);
      console.log('CatalogPage - Filtro actual:', filters.searchTerm);
      
      if (searchFromUrl && searchFromUrl !== filters.searchTerm) {
        console.log('CatalogPage - Actualizando filtro de búsqueda a:', searchFromUrl);
        setFilters(prev => ({
          ...prev,
          searchTerm: searchFromUrl
        }));
        setCurrentPage(1); // Resetear a la primera página
      }
    };
    
    // Ejecutar al cargar y cuando cambie el hash
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [filters.searchTerm]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
        filtered.sort((a, b) => {
          const ap = (typeof a.precioOferta === 'number' && a.precioOferta > 0) ? a.precioOferta : a.precio1;
          const bp = (typeof b.precioOferta === 'number' && b.precioOferta > 0) ? b.precioOferta : b.precio1;
          return ap - bp;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const ap = (typeof a.precioOferta === 'number' && a.precioOferta > 0) ? a.precioOferta : a.precio1;
          const bp = (typeof b.precioOferta === 'number' && b.precioOferta > 0) ? b.precioOferta : b.precio1;
          return bp - ap;
        });
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

  // Calcular límites globales de precios
  const priceBounds = useMemo(() => {
    if (!uniqueProducts.length) return { min: 0, max: 0 };
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    for (const p of uniqueProducts) {
      const price = (typeof p.precioOferta === 'number' && p.precioOferta > 0) ? p.precioOferta : p.precio1;
      if (price < min) min = price;
      if (price > max) max = price;
    }
    if (!isFinite(min)) min = 0;
    return { min, max };
  }, [uniqueProducts]);

  // Inicializar rango de precios al cargar productos/límites
  useEffect(() => {
    if (priceBounds.max > 0 && (!filters.priceRange || filters.priceRange.min === undefined || filters.priceRange.max === undefined)) {
      setFilters(prev => ({ ...prev, priceRange: { min: priceBounds.min, max: priceBounds.max } }));
    }
  }, [priceBounds.min, priceBounds.max]);

  // Calcular productos paginados
  const paginatedProducts = useMemo(() => {
    // Comportamiento "Ver más": mostrar acumulado hasta la página actual
    const endIndex = currentPage * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(0, endIndex);
  }, [filteredProducts, currentPage, PRODUCTS_PER_PAGE]);

  // Calcular información de paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setCurrentPage((p) => (p < totalPages ? p + 1 : p));
      }
    }, { rootMargin: '200px 0px' });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
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
          availableTipoMarcas={availableTipoMarcas}
          availableGenders={availableGenders}
          priceMin={priceBounds.min}
          priceMax={priceBounds.max}
          onOpenAdvanced={() => setShowAdvancedFilters(true)}
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
              <>
                <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
                {/* Sentinel para infinite scroll */}
                {hasNextPage && (
                  <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
                )}
                
                {/* Cargar más (mejor UX en mobile) */}
                {hasNextPage && (
                  <div className="mt-10 flex flex-col items-center">
                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl transition-colors"
                    >
                      Ver más
                    </button>
                    <div className="mt-3 text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                      <span className="mx-2">•</span>
                      Mostrando {paginatedProducts.length + (currentPage - 1) * PRODUCTS_PER_PAGE} de {filteredProducts.length} productos
                    </div>
                  </div>
                )}
              </>
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
