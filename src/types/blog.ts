export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  resumen: string;
  imagenPrincipal: string;
  categoria: 'Reseñas' | 'Guías' | 'Tendencias' | 'Consejos';
  tags: string[];
  autor: string;
  fechaPublicacion: string;
  estado: 'Borrador' | 'Publicado' | 'Programado';
  seoTitle: string;
  seoDescription: string;
  destacado: boolean;
  vistas: number;
}

export interface BlogFilters {
  categoria?: string;
  tag?: string;
  autor?: string;
  searchTerm?: string;
  destacados?: boolean;
}

export interface BlogComment {
  id: string;
  postId: string;
  nombre: string;
  email: string;
  comentario: string;
  fechaComentario: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  respuestaA?: string; // ID del comentario al que responde
  blogPost?: string[]; // Relación con Blog_Posts (array de IDs)
  esSpam: boolean; // Indica si es spam
  moderador?: string; // Nombre del moderador que revisó
}

export interface CommentFormData {
  nombre: string;
  email: string;
  comentario: string;
  respuestaA?: string; // Para respuestas anidadas
}
