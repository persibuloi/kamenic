import React, { useState } from 'react';
import { MessageCircle, Send, User, Calendar, ThumbsUp, Reply, CheckCircle, X } from 'lucide-react';
import { BlogComment, CommentFormData } from '../types/blog';

interface BlogCommentsProps {
  postId: string;
  comments: BlogComment[];
  onAddComment: (commentData: CommentFormData) => Promise<void>;
}

export function BlogComments({ postId, comments, onAddComment }: BlogCommentsProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<CommentFormData>({
    nombre: '',
    email: '',
    comentario: ''
  });

  // Filtrar comentarios aprobados
  const approvedComments = comments.filter(comment => comment.estado === 'Aprobado');
  
  // Separar comentarios principales y respuestas
  const mainComments = approvedComments.filter(comment => !comment.respuestaA);
  const replies = approvedComments.filter(comment => comment.respuestaA);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.comentario.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddComment(formData);
      setFormData({ nombre: '', email: '', comentario: '' });
      setShowForm(false);
      setShowSuccessModal(true); // Mostrar popup de confirmación
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      // Aquí podrías agregar un popup de error si quieres
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCommentReplies = (commentId: string) => {
    return replies.filter(reply => reply.respuestaA === commentId);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1">
        <div className="bg-white rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Comentarios</h3>
                <p className="text-gray-600">{approvedComments.length} comentarios</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {showForm ? 'Cancelar' : 'Escribir comentario'}
            </button>
          </div>

          {/* Comment Form */}
          {showForm && (
            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">💬 Comparte tu opinión</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👤 Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📧 Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💭 Comentario *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.comentario}
                    onChange={(e) => setFormData({ ...formData, comentario: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none"
                    placeholder="Comparte tu opinión sobre este artículo..."
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-500">
                    * Tu comentario será revisado antes de publicarse
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar comentario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {mainComments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">¡Sé el primero en comentar!</h4>
                <p className="text-gray-600 mb-4">Comparte tu opinión sobre este artículo</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Escribir comentario
                </button>
              </div>
            ) : (
              mainComments.map((comment) => {
                const commentReplies = getCommentReplies(comment.id);
                return (
                  <div key={comment.id} className="space-y-4">
                    {/* Main Comment */}
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <h5 className="font-semibold text-gray-900">{comment.nombre}</h5>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(comment.fechaComentario)}
                              </div>
                            </div>
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-500 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">0</span>
                            </button>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{comment.comentario}</p>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {commentReplies.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {commentReplies.map((reply) => (
                          <div key={reply.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h6 className="font-medium text-gray-900 text-sm">{reply.nombre}</h6>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(reply.fechaComentario)}
                                  </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{reply.comentario}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-8 text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Comentario enviado!
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-8 leading-relaxed">
                Tu comentario ha sido recibido y está en proceso de revisión. 
                Una vez aprobado por nuestro equipo, aparecerá publicado en el blog.
              </p>
              
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Entendido
              </button>
            </div>
            
            {/* Close X Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
