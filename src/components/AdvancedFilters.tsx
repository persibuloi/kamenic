import React, { useState, useEffect } from 'react';
import { FilterOptions, Product } from '../types/product';
import './AdvancedFilters.css';

interface AdvancedFiltersProps {
  products: Product[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  products,
  filters,
  onFiltersChange,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  // Obtener valores únicos para los filtros
  const uniqueMarcas = Array.from(new Set(products.map(p => p.marca).filter(Boolean))).sort();
  const uniqueTipoMarcas = Array.from(new Set(products.map(p => p.tipoMarca).filter(Boolean))).sort();
  const uniqueGeneros = Array.from(new Set(products.map(p => p.genero).filter(Boolean))).sort();

  // DEBUG: Verificar valores de tipoMarca
  console.log('DEBUG AdvancedFilters - uniqueTipoMarcas:', uniqueTipoMarcas);
  console.log('DEBUG AdvancedFilters - productos con tipoMarca:', products.filter(p => p.tipoMarca).map(p => ({ id: p.id, tipoMarca: p.tipoMarca })).slice(0, 5));

  // Calcular rango de precios
  const prices = products.map(p => p.precioOferta || p.precio1);
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const resetFilters: FilterOptions = {
      marca: '',
      tipoMarca: '',
      genero: '',
      searchTerm: '',
      priceRange: { min: minPrice, max: maxPrice },
      sortBy: 'default',
      showOnlyOffers: false,
      showOnlyInStock: true
    };
    setLocalFilters(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.marca) count++;
    if (localFilters.tipoMarca) count++;
    if (localFilters.genero) count++;
    if (localFilters.searchTerm) count++;
    if (localFilters.priceRange && (localFilters.priceRange.min > minPrice || localFilters.priceRange.max < maxPrice)) count++;
    if (localFilters.showOnlyOffers) count++;
    if (!localFilters.showOnlyInStock) count++;
    return count;
  };

  return (
    <div className="filters-overlay" onClick={onClose}>
      <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filters-header">
          <h2>Filtros Avanzados</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="filters-content">
          {/* Búsqueda */}
          <div className="filter-group">
            <label className="filter-label">Buscar producto</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Buscar por nombre o descripción..."
              value={localFilters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>

          {/* Marca */}
          <div className="filter-group">
            <label className="filter-label">Marca</label>
            <select
              className="filter-select"
              value={localFilters.marca || ''}
              onChange={(e) => handleFilterChange('marca', e.target.value || undefined)}
            >
              <option value="">Todas las marcas</option>
              {uniqueMarcas.map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>
          </div>

          {/* Tipo de Marca */}
          <div className="filter-group">
            <label className="filter-label">Tipo de Marca</label>
            <select
              className="filter-select"
              value={localFilters.tipoMarca || ''}
              onChange={(e) => handleFilterChange('tipoMarca', e.target.value || undefined)}
            >
              <option value="">Todos los tipos</option>
              {uniqueTipoMarcas.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Género */}
          <div className="filter-group">
            <label className="filter-label">Género</label>
            <div className="filter-radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="genero"
                  value=""
                  checked={!localFilters.genero}
                  onChange={(e) => handleFilterChange('genero', '')}
                />
                <span>Todos</span>
              </label>
              {uniqueGeneros.map(genero => (
                <label key={genero} className="radio-option">
                  <input
                    type="radio"
                    name="genero"
                    value={genero}
                    checked={localFilters.genero === genero}
                    onChange={(e) => handleFilterChange('genero', e.target.value)}
                  />
                  <span>{genero}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rango de Precios */}
          <div className="filter-group">
            <label className="filter-label">
              Rango de Precios: ${localFilters.priceRange?.min || minPrice} - ${localFilters.priceRange?.max || maxPrice}
            </label>
            <div className="price-range-inputs">
              <input
                type="number"
                className="price-input"
                placeholder="Mín"
                value={localFilters.priceRange?.min || minPrice}
                onChange={(e) => handlePriceRangeChange(
                  parseInt(e.target.value) || minPrice,
                  localFilters.priceRange?.max || maxPrice
                )}
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                className="price-input"
                placeholder="Máx"
                value={localFilters.priceRange?.max || maxPrice}
                onChange={(e) => handlePriceRangeChange(
                  localFilters.priceRange?.min || minPrice,
                  parseInt(e.target.value) || maxPrice
                )}
              />
            </div>
          </div>

          {/* Ordenar por */}
          <div className="filter-group">
            <label className="filter-label">Ordenar por</label>
            <select
              className="filter-select"
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
            >
              <option value="default">Por defecto</option>
              <option value="name">Nombre A-Z</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* Opciones adicionales */}
          <div className="filter-group">
            <label className="filter-label">Opciones adicionales</label>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={localFilters.showOnlyOffers}
                  onChange={(e) => handleFilterChange('showOnlyOffers', e.target.checked)}
                />
                <span>Solo productos en oferta</span>
              </label>
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={localFilters.showOnlyInStock}
                  onChange={(e) => handleFilterChange('showOnlyInStock', e.target.checked)}
                />
                <span>Solo productos en stock</span>
              </label>
            </div>
          </div>
        </div>

        <div className="filters-footer">
          <div className="active-filters-count">
            {getActiveFiltersCount()} filtros activos
          </div>
          <div className="filter-actions">
            <button className="reset-button" onClick={resetFilters}>
              Limpiar Filtros
            </button>
            <button className="apply-button" onClick={applyFilters}>
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
