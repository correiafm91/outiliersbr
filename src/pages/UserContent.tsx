
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Video, FileText, Trash2, Edit, PlayCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase, formatLocalDate } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const UserContent = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Check if profile exists
    if (!profile) {
      navigate('/create-profile');
      return;
    }
    
    // Load user's content from Supabase
    loadUserContent();
  }, [user, profile, navigate]);

  const loadUserContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Erro ao carregar seus conteúdos');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content')
        .update({ published: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setContent(prev => 
        prev.map(item => 
          item.id === id ? { ...item, published: !currentStatus } : item
        )
      );
      
      toast.success(currentStatus ? 'Conteúdo despublicado!' : 'Conteúdo publicado!');
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Erro ao atualizar status do conteúdo');
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setContent(prev => prev.filter(item => item.id !== id));
      setShowDeleteModal(null);
      
      toast.success('Conteúdo excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Erro ao excluir conteúdo');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => 
        activeTab === 'published' ? item.published : !item.published
      );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-outliers-dark">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-outliers-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Meus <span className="text-outliers-blue">Conteúdos</span>
                </h1>
                <p className="text-gray-300">
                  Gerencie os conteúdos que você criou na comunidade Outliers
                </p>
              </div>
              
              <Link
                to="/create-content"
                className="mt-4 md:mt-0 px-6 py-3 rounded-md btn-blue text-base font-medium flex items-center"
              >
                <PlusCircle size={18} className="mr-2" />
                Novo Conteúdo
              </Link>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === 'all' 
                    ? 'bg-outliers-blue text-white' 
                    : 'bg-outliers-gray text-gray-300 hover:bg-outliers-gray/70'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === 'published' 
                    ? 'bg-outliers-blue text-white' 
                    : 'bg-outliers-gray text-gray-300 hover:bg-outliers-gray/70'
                }`}
              >
                Publicados
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === 'drafts' 
                    ? 'bg-outliers-blue text-white' 
                    : 'bg-outliers-gray text-gray-300 hover:bg-outliers-gray/70'
                }`}
              >
                Rascunhos
              </button>
            </div>
          </div>
          
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-outliers-gray/70">
                    <th className="px-6 py-4 text-left text-sm font-medium text-outliers-blue">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-outliers-blue">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-outliers-blue">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-outliers-blue">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-outliers-blue">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                      <tr key={item.id} className="animate-fade-in hover:bg-outliers-gray/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 mr-3">
                              {(item.type === 'video' || item.type === 'live') && item.thumbnail_url ? (
                                <img 
                                  src={item.thumbnail_url} 
                                  alt={item.title}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                                  item.type === 'article' 
                                    ? 'bg-blue-500/20' 
                                    : item.type === 'video' 
                                      ? 'bg-purple-500/20' 
                                      : 'bg-red-500/20'
                                }`}>
                                  {item.type === 'article' ? (
                                    <FileText size={20} className="text-blue-400" />
                                  ) : item.type === 'video' ? (
                                    <Video size={20} className="text-purple-400" />
                                  ) : (
                                    <PlayCircle size={20} className="text-red-400" />
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium text-white">
                              {item.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {item.type === 'article' ? 'Artigo' : item.type === 'video' ? 'Vídeo' : 'Live'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatLocalDate(item.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.published 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item.published ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => handleTogglePublish(item.id, item.published)}
                              className={`p-1.5 rounded-md ${
                                item.published 
                                  ? 'bg-gray-600/30 text-gray-300 hover:bg-gray-600/50' 
                                  : 'bg-green-600/30 text-green-300 hover:bg-green-600/50'
                              }`}
                              title={item.published ? 'Despublicar' : 'Publicar'}
                            >
                              {item.published ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                              className="p-1.5 rounded-md bg-blue-600/30 text-blue-300 hover:bg-blue-600/50"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(item.id)}
                              className="p-1.5 rounded-md bg-red-600/30 text-red-300 hover:bg-red-600/50"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        {activeTab === 'all' 
                          ? 'Você ainda não criou nenhum conteúdo' 
                          : activeTab === 'published' 
                            ? 'Você não tem conteúdos publicados' 
                            : 'Você não tem conteúdos em rascunho'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {content.length === 0 && (
            <div className="mt-8 text-center">
              <Link 
                to="/create-content"
                className="px-6 py-3 rounded-md btn-blue text-base font-medium inline-flex items-center"
              >
                <PlusCircle size={18} className="mr-2" />
                Criar Meu Primeiro Conteúdo
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl w-full max-w-md animate-fade-in">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-outliers-gray transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteContent(showDeleteModal)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Excluindo...
                    </>
                  ) : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserContent;
