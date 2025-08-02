import React from 'react';

export function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              Blog de Fragancias
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Descubre el fascinante mundo de los perfumes con nuestras guías expertas, 
              reseñas exclusivas y las últimas tendencias en fragancias
            </p>
            <div className="flex items-center justify-center space-x-8 text-amber-200">
              <div className="flex items-center space-x-2">
                <span>⭐ Contenido Exclusivo</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔍 Guías Expertas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔥 Tendencias</span>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 -left-8 w-24 h-24 bg-amber-300/20 rounded-full blur-lg"></div>
          <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-orange-300/20 rounded-full blur-lg"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contenido del blog */}
        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-8xl mb-8">📝</div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Blog en Construcción
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Estamos preparando contenido increíble sobre fragancias, reseñas de perfumes, 
              guías de compra y las últimas tendencias en el mundo de los aromas.
            </p>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Qué encontrarás próximamente?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Reseñas Expertas</h4>
                    <p className="text-gray-600">Análisis detallados de las mejores fragancias</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Guías de Compra</h4>
                    <p className="text-gray-600">Consejos para elegir el perfume perfecto</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🔥</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Tendencias</h4>
                    <p className="text-gray-600">Lo último en el mundo de las fragancias</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🌿</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ingredientes</h4>
                    <p className="text-gray-600">Conoce las notas y composiciones</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-500 mb-8">
              Mientras tanto, explora nuestro catálogo de perfumes y encuentra tu fragancia ideal.
            </p>
            <a 
              href="#catalog" 
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Ver Catálogo de Perfumes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
