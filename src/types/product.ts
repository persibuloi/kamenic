export interface Product {
  id: string;
  descripcion: string;
  descripcionLarga?: string;
  precio1: number;
  precioOferta?: number;
  marca: string;
  tipoMarca: string;
  genero: string;
  codigoKame: string;
  imagen?: string;
  existenciaActual: number;
}

export interface AirtableRecord {
  id: string;
  fields: {
    'Descripción': string;
    'Descripción Larga'?: string;
    'Precio1': number;
    'Precio Oferta'?: number;
    'Marca': string;
    'Tipo Marca': string;
    'Género': string;
    'Código KAME': string;
    'Foto'?: any;
    'Existencia Actual': number;
    [key: string]: any; // Para compatibilidad con variaciones de nombres
  };
  createdTime: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterOptions {
  marca?: string;
  tipoMarca?: string;
  genero?: string;
  searchTerm: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'default';
  showOnlyOffers: boolean;
  showOnlyInStock: boolean;
}

export interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}
