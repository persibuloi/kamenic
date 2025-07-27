import React from 'react';
import { Search, Filter, SortAsc, Tag } from 'lucide-react';
import { FilterOptions } from '../types/product';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableBrands: string[];
}

export function FilterBar({ filters, onFiltersChange, availableBrands }: FilterBarProps) {
  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleBrandChange = (tipoMarca: string) => {
    onFiltersChange({ ...filters, tipoMarca });
  };

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleOffersToggle = () => {
    onFiltersChange({ ...filters, showOnlyOffers: !filters.showOnlyOffers });
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-amber-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Buscador */}
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

        {/* Filtro por tipoMarca */}
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.tipoMarca}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none"
          >
            <option value="">Todas las tipoMarcas</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="relative">
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 appearance-none"
          >
            <option value="default">Ordenar por</option>
            <option value="name">Nombre A-Z</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>

        {/* Filtro de ofertas */}
        <div className="flex items-center">
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
        {filters.tipoMarca && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            Marca: {filters.tipoMarca}
            <button
              onClick={() => handleBrandChange('')}
              className="ml-2 text-blue-600 hover:text-blue-800"
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
