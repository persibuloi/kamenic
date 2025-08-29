import React from 'react';
import { Search, Filter, SortAsc, Tag } from 'lucide-react';
import { FilterOptions } from '../types/product';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableBrands: string[];
  availableTipoMarcas: string[];
  availableGenders: string[];
  priceMin?: number;
  priceMax?: number;
  currencyCode?: string;
  onOpenAdvanced?: () => void; // abrir modal avanzado desde móvil
}

export function FilterBar({ filters, onFiltersChange, availableBrands, availableTipoMarcas, availableGenders, priceMin, priceMax, currencyCode = 'USD', onOpenAdvanced }: FilterBarProps) {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleBrandChange = (marca: string) => {
    onFiltersChange({ ...filters, marca });
  };

  const handleTipoMarcaChange = (tipoMarca: string) => {
    onFiltersChange({ ...filters, tipoMarca: tipoMarca || '' });
  };

  const handleGenderChange = (genero: string) => {
    onFiltersChange({ ...filters, genero: genero || '' });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleOffersToggle = () => {
    onFiltersChange({ ...filters, showOnlyOffers: !filters.showOnlyOffers });
  };

  const bounds = {
    min: typeof priceMin === 'number' ? priceMin : 0,
    max: typeof priceMax === 'number' ? priceMax : 0,
  };

  const currentMin = Math.max(bounds.min, Math.min(bounds.max, filters.priceRange?.min ?? bounds.min));
  const currentMax = Math.max(bounds.min, Math.min(bounds.max, filters.priceRange?.max ?? bounds.max));

  const handleMinChange = (value: number) => {
    const v = Math.max(bounds.min, Math.min(value, bounds.max));
    if (v > currentMax) {
      // Swap: si min pasó por encima de max, intercambiamos
      onFiltersChange({ ...filters, priceRange: { min: currentMax, max: v } });
    } else {
      onFiltersChange({ ...filters, priceRange: { min: v, max: currentMax } });
    }
  };

  const handleMaxChange = (value: number) => {
    const v = Math.max(bounds.min, Math.min(value, bounds.max));
    if (v < currentMin) {
      // Swap: si max pasó por debajo de min, intercambiamos
      onFiltersChange({ ...filters, priceRange: { min: v, max: currentMin } });
    } else {
      onFiltersChange({ ...filters, priceRange: { min: currentMin, max: v } });
    }
  };

  const handleResetPrice = () => {
    if (bounds.max > bounds.min) {
      onFiltersChange({ ...filters, priceRange: { min: bounds.min, max: bounds.max } });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-8 border border-amber-100">
      {/* Compacto en móvil: buscador + botón Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden mb-3">
        {/* Buscador (mobile) */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar perfumes..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        {/* Botón para abrir filtros avanzados */}
        <button
          type="button"
          onClick={() => onOpenAdvanced && onOpenAdvanced()}
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800"
          aria-label="Abrir filtros avanzados"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </button>
      </div>

      {/* Chips de filtros rápidos (solo móvil) */}
      <div className="md:hidden -mx-3 px-3 py-2 bg-white rounded-xl border border-amber-100">
        <div className="flex items-center gap-2 overflow-x-auto py-1 snap-x snap-mandatory scroll-px-3">
          {/* Solo ofertas */}
          <button
            type="button"
            onClick={handleOffersToggle}
            aria-pressed={filters.showOnlyOffers}
            className={`shrink-0 snap-start whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] border shadow-sm transition-colors ${
              filters.showOnlyOffers
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-md'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            🔥 Ofertas
          </button>

          {/* Géneros */}
          {availableGenders.slice(0, 3).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenderChange(filters.genero === g ? '' : g)}
              aria-pressed={filters.genero === g}
              className={`shrink-0 snap-start whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] border shadow-sm transition-colors ${
                filters.genero === g
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Filter className="inline-block h-3 w-3 mr-1 opacity-80" />
              {g}
            </button>
          ))}

          {/* Tipos de marca destacados */}
          {availableTipoMarcas.slice(0, 5).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTipoMarcaChange(filters.tipoMarca === t ? '' : t)}
              aria-pressed={filters.tipoMarca === t}
              className={`shrink-0 snap-start whitespace-nowrap px-3 py-1.5 rounded-full text-[13px] border shadow-sm transition-colors ${
                filters.tipoMarca === t
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-600 shadow-md'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Filter className="inline-block h-3 w-3 mr-1 opacity-80" />
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Versión completa para md+ */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Buscador */}
        <div className="relative lg:col-span-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar perfumes..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Filtro por Marca */}
        <div className="relative lg:col-span-3">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.marca || ''}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full pl-10 pr-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none text-sm min-w-[200px]"
          >
            <option value="">Todas las marcas</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Tipo de Marca */}
        <div className="relative lg:col-span-2">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.tipoMarca || ''}
            onChange={(e) => handleTipoMarcaChange(e.target.value)}
            className="w-full pl-10 pr-6 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none text-sm min-w-[160px]"
            style={{ fontSize: 14, minWidth: 160 }}
          >
            <option value="">Todos los tipos</option>
            {availableTipoMarcas.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Género */}
        <div className="relative lg:col-span-3">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.genero || ''}
            onChange={(e) => handleGenderChange(e.target.value)}
            className="w-full pl-10 pr-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none text-sm min-w-[180px]"
          >
            <option value="">Todos los géneros</option>
            {availableGenders.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Precio (slider doble) */}
        <div className="col-span-1 lg:col-span-4 mb-6 md:mb-6">
          {bounds.max > bounds.min ? (
            <>
          <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
            <span>Precio</span>
            <span>
              {currentMin.toLocaleString(undefined, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 })}
              {' '}-
              {' '}
              {currentMax.toLocaleString(undefined, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="px-2 pb-3">
            {/* Contenedor alto para separar los thumbs verticalmente */}
            <div className="relative h-8 mb-5">
              {/* Track centrado */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-gray-200" />
              {/* Highlight del rango */}
              {bounds.max > bounds.min && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-amber-500/40"
                  style={{
                    left: `${((currentMin - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                    right: `${(1 - (currentMax - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                  }}
                />
              )}
              {/* Slider de Máximo (arriba) */}
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={1}
                value={currentMax}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                className="w-full absolute top-0 left-0 z-0 appearance-none bg-transparent [::-webkit-slider-thumb]:appearance-none [::-webkit-slider-thumb]:h-5 [::-webkit-slider-thumb]:w-5 [::-webkit-slider-thumb]:rounded-full [::-webkit-slider-thumb]:bg-amber-600 [::-webkit-slider-runnable-track]:h-3 [::-webkit-slider-runnable-track]:bg-transparent"
              />
              {/* Slider de Mínimo (abajo) */}
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={1}
                value={currentMin}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                className="w-full absolute bottom-0 left-0 z-10 appearance-none bg-transparent [::-webkit-slider-thumb]:appearance-none [::-webkit-slider-thumb]:h-5 [::-webkit-slider-thumb]:w-5 [::-webkit-slider-thumb]:rounded-full [::-webkit-slider-thumb]:bg-amber-600 [::-webkit-slider-runnable-track]:h-3 [::-webkit-slider-runnable-track]:bg-transparent"
              />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={handleResetPrice}
                className="text-xs px-3 py-1 rounded-md text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200"
              >
                Restablecer
              </button>
            </div>
          </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">Rango de precios no disponible</div>
          )}
        </div>

        {/* Ordenamiento */}
        <div className="relative lg:col-span-2">
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
            className="w-full pl-10 pr-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none text-sm min-w-[160px]"
          >
            <option value="default">Ordenar por</option>
            <option value="name">Nombre A-Z</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>

        {/* Filtro de ofertas */}
        <div className="flex items-center lg:col-span-2">
          <button
            onClick={handleOffersToggle}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full justify-center ${
              filters.showOnlyOffers
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Solo Ofertas</span>
          </button>
        </div>
      </div>

      {/* Indicadores activos */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.searchTerm && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
            Buscar: "{filters.searchTerm}"
            <button
              onClick={() => handleSearchChange('')}
              className="ml-2 text-amber-600 hover:text-amber-800"
            >
              ×
            </button>
          </span>
        )}
        {filters.marca && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            Marca: {filters.marca}
            <button
              onClick={() => handleBrandChange('')}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        {filters.tipoMarca && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            Tipo: {filters.tipoMarca}
            <button
              onClick={() => handleTipoMarcaChange('')}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </span>
        )}
        {filters.genero && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            Género: {filters.genero}
            <button
              onClick={() => handleGenderChange('')}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        {filters.showOnlyOffers && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
            Solo ofertas
            <button
              onClick={handleOffersToggle}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
