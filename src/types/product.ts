export interface Product {
  id: string;
  descripcion: string;
  precio1: number;
  precioOferta?: number;
  tipoMarca: string;
  codigoKame: string;
  imagen?: string;
  existenciaActual: number;
}

export interface AirtableRecord {
  id: string;
  fields: {
    'Descripción': string;
    'Precio1': number;
    'Precio Oferta'?: number;
    'tipo marca': string;
    'CODIGO KAME': string;
  };
  createdTime: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterOptions {
  tipoMarca?: string;
  searchTerm: string;
  sortBy: 'price-asc' | 'price-desc' | 'name' | 'default';
  showOnlyOffers: boolean;
}
