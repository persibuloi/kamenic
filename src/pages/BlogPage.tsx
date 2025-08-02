import React, { useState, useMemo } from 'react';
import { Calendar, User, Tag, Eye, ArrowLeft, Star } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { useComments } from '../hooks/useComments';
import { BlogPost } from '../types/blog';
import { BlogComments } from '../components/BlogComments';

// Cache simple para evitar blink
let blogCache: BlogPost[] = [];
let cacheLoaded = false;

export function BlogPage() {
  const { posts, loading, error } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Hook de comentarios - debe estar siempre en el mismo lugar
  const { comments, loading: commentsLoading, addComment } = useComments(selectedPost?.id || '');

  // Usar cache para evitar blink, actualizar cuando lleguen nuevos datos
  const currentPosts = useMemo(() => {
    if (posts.length > 0) {
      blogCache = posts;
      cacheLoaded = true;
      return posts;
    }
    return cacheLoaded ? blogCache : [];
  }, [posts]);

  // Filtrar posts
  const filteredPosts = useMemo(() => {
    let filtered = [...currentPosts];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.titulo.toLowerCase().includes(searchLower) ||
        post.resumen.toLowerCase().includes(searchLower) ||
        post.contenido.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.categoria === selectedCategory);
    }

    return filtered;
  }, [currentPosts, searchTerm, selectedCategory]);

  // Posts destacados
  const featuredPosts = currentPosts.filter(post => post.destacado).slice(0, 3);
  
  // Categorías disponibles
  const categories = Array.from(new Set(currentPosts.map(post => post.categoria)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Vista de detalle del post
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al blog
          </button>
          
          {/* Article */}
          <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-12">
            <div className="relative h-96 lg:h-[500px]">
              <img
                src={selectedPost.imagenPrincipal || '/images/blog-default.jpg'}
                alt={selectedPost.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/blog-default.jpg';
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '1';
                }}
                style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Floating elements */}
              {selectedPost.destacado && (
                <div className="absolute top-8 left-8">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium text-sm">Destacado</span>
                  </div>
                </div>
              )}
              
              <div className="absolute top-8 right-8 flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                  <Eye className="h-3 w-3 text-white" />
                  <span className="text-white text-sm font-medium">{selectedPost.vistas}</span>
                </div>
              </div>
              
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {selectedPost.categoria}
                  </span>
                  <div className="flex items-center text-white/80 text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(selectedPost.fechaPublicacion)}
                  </div>
                </div>
                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {selectedPost.titulo}
                </h1>
                <div className="flex items-center text-white/70">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">{selectedPost.autor}</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 lg:p-12">
              {/* Article content */}
              <div className="prose prose-lg prose-purple max-w-none">
                <div className="text-xl text-gray-600 mb-8 leading-relaxed font-light border-l-4 border-purple-500 pl-6 bg-gradient-to-r from-purple-50 to-transparent py-4 rounded-r-lg">
                  {selectedPost.resumen}
                </div>
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                  {selectedPost.contenido}
                </div>
              </div>
              
              {/* Tags */}
              {selectedPost.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-purple-600" />
                    Tags relacionados
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium hover:from-purple-200 hover:to-pink-200 transition-all duration-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
          
          {/* Comments Section */}
          <BlogComments 
            postId={selectedPost.id}
            comments={comments}
            onAddComment={addComment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Blog actualizado diariamente
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent leading-tight">
              Fragancias
              <span className="block text-4xl md:text-6xl font-light text-white/80 mt-2">& Perfumes</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/70 max-w-4xl mx-auto leading-relaxed font-light">
              Sumérgete en el universo olfativo más exclusivo. Descubre reseñas expertas, 
              guías detalladas y las tendencias que están redefiniendo el mundo de las fragancias.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => window.location.href = '/#catalog'}
                className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-amber-500/25 flex items-center space-x-2"
              >
                <span>🛍️</span>
                <span>Ver Catálogo</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
              <button
                onClick={() => {
                  const articlesSection = document.querySelector('.articles-section');
                  articlesSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-2xl border border-white/30 flex items-center space-x-2"
              >
                <span>📚</span>
                <span>Ver Artículos</span>
                <span className="group-hover:translate-y-1 transition-transform">↓</span>
              </button>
              
              <button
                onClick={() => {
                  const featuredSection = document.querySelector('.featured-section');
                  featuredSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center space-x-2"
              >
                <span>⭐</span>
                <span>Destacados</span>
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{currentPosts.length} Artículos Exclusivos</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Contenido Premium</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modern wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-20">
            <path fill="rgb(249 250 251)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Modern Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium mb-4">
                <Star className="h-4 w-4 mr-2" />
                Contenido Destacado
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Artículos <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Imprescindibles</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Los posts más populares y mejor valorados por nuestra comunidad
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Featured post principal */}
              {featuredPosts[0] && (
                <article
                  className="lg:row-span-2 group cursor-pointer"
                  onClick={() => setSelectedPost(featuredPosts[0])}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 group-hover:-translate-y-1">
                    <div className="relative overflow-hidden h-80 lg:h-96">
                      <img
                        src={featuredPosts[0].imagenPrincipal || '/images/blog-default.jpg'}
                        alt={featuredPosts[0].titulo}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/blog-default.jpg';
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '1';
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Floating badge */}
                      <div className="absolute top-6 left-6">
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-white font-medium text-sm">Destacado</span>
                        </div>
                      </div>
                      
                      {/* Stats overlay */}
                      <div className="absolute top-6 right-6 flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                          <Eye className="h-3 w-3 text-white" />
                          <span className="text-white text-sm font-medium">{featuredPosts[0].vistas}</span>
                        </div>
                      </div>
                      
                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {featuredPosts[0].categoria}
                          </span>
                          <div className="flex items-center text-white/80 text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(featuredPosts[0].fechaPublicacion)}
                          </div>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-purple-200 transition-colors">
                          {featuredPosts[0].titulo}
                        </h3>
                        <p className="text-white/80 mb-4 line-clamp-2 leading-relaxed">
                          {featuredPosts[0].resumen}
                        </p>
                        <div className="flex items-center text-white/70">
                          <User className="h-4 w-4 mr-2" />
                          <span className="font-medium">{featuredPosts[0].autor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}
              
              {/* Featured posts secundarios */}
              <div className="space-y-8">
                {featuredPosts.slice(1, 3).map((post, index) => (
                  <article
                    key={post.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="flex bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                      <div className="relative w-40 h-32 flex-shrink-0">
                        <img
                          src={post.imagenPrincipal || '/images/blog-default.jpg'}
                          alt={post.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/blog-default.jpg';
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.opacity = '1';
                          }}
                          style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                        <div className="absolute top-2 left-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700">
                            {post.categoria}
                          </span>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Eye className="h-3 w-3 mr-1" />
                            {post.vistas}
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {post.titulo}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.resumen}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {post.autor}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(post.fechaPublicacion)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Modern Filters */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1">
              <div className="bg-white rounded-3xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Encuentra tu contenido ideal</h3>
                  <p className="text-gray-600">Filtra y busca entre nuestros artículos especializados</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Advanced Search */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🔍 Buscar artículos
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Busca por título, contenido o autor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:shadow-lg"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🏷️ Filtrar por categoría
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 group-hover:shadow-lg appearance-none cursor-pointer"
                      >
                        <option value="">Todas las categorías</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Filter Stats */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2">
                      <span className="font-semibold text-purple-700">{filteredPosts.length}</span>
                      <span>artículos encontrados</span>
                    </div>
                    {searchTerm && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full px-4 py-2">
                        <span>🔍</span>
                        <span>Buscando: <strong>{searchTerm}</strong></span>
                      </div>
                    )}
                    {selectedCategory && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2">
                        <span>🏷️</span>
                        <span>Categoría: <strong>{selectedCategory}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de Posts */}
        <section>
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 text-lg mb-4">Error al cargar los artículos</div>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
          
          {!error && filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg mb-4">No se encontraron artículos</div>
              <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
            </div>
          )}
          
          {!error && (loading && currentPosts.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg mb-4">Cargando artículos...</div>
            </div>
          )}
          
          {filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.imagenPrincipal || '/images/blog-default.jpg'}
                        alt={post.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/blog-default.jpg';
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.opacity = '1';
                        }}
                        style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                      />
                      {post.destacado && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 flex items-center text-white/90 text-sm bg-black/50 rounded-full px-2 py-1">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.vistas}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {post.categoria}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(post.fechaPublicacion)}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {post.titulo}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.resumen}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {post.autor}
                        </div>
                        {post.tags.length > 0 && (
                          <div className="flex items-center">
                            <Tag className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {post.tags.length} tag{post.tags.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BlogPage;
