import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { FilterBar } from '../components/FilterBar';
import { LoadingSpinner, ProductGridSkeleton } from '../components/LoadingSpinner';
import { useAirtable } from '../hooks/useAirtable';
import { FilterOptions, Product } from '../types/product';

export function CatalogPage() {
  const { products, loading, error } = useAirtable();

  // Obtener tipoMarcas disponibles (normalizadas y únicas)
  const availableBrands = useMemo(() => {
    const brandMap = new Map<string, string>();
    products.forEach(p => {
      const rawMarca = typeof p.tipoMarca === 'string' ? p.tipoMarca : '';
      if (rawMarca.trim()) {
        const normalized = rawMarca.trim().toLowerCase();
        if (!brandMap.has(normalized)) {
          // Capitalizar solo la primera letra de cada palabra
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
    return products.filter(p => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [products]);

  // Filtrar y ordenar productos
  const [filters, setFilters] = useState<FilterOptions>({
    tipoMarca: '',
    searchTerm: '',
    sortBy: 'default',
    showOnlyOffers: false
  });

  const filteredProducts = useMemo(() => {
    let filtered = [...uniqueProducts];

    // Filtro: solo productos con existenciaActual > 0
    filtered = filtered.filter(product => typeof product.existenciaActual === 'number' && product.existenciaActual > 0);

    // Filtro por tipoMarca
    if (filters.tipoMarca) {
      filtered = filtered.filter(product => {
        if (!product.tipoMarca) return false;
        // Normalizar para comparar
        return product.tipoMarca.trim().toLowerCase() === filters.tipoMarca.trim().toLowerCase();
      });
    }

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Filtro de ofertas
    if (filters.showOnlyOffers) {
      filtered = filtered.filter(product => typeof product.precioOferta === 'number' && product.precioOferta < product.precio1);
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
              {filteredProducts.length === products.length 
                ? `Mostrando todos los ${products.length} productos`
                : `Mostrando ${filteredProducts.length} de ${products.length} productos`
              }
            </p>
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
                  <ProductCard key={product.id} product={product} />
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
                      tipoMarca: '',
                      searchTerm: '',
                      sortBy: 'default',
                      showOnlyOffers: false
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
      </div>
    </div>
  );
}
