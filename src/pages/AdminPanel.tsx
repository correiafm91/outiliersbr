
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Video, 
  FileText, 
  Trash2, 
  Edit, 
  Upload, 
  PlayCircle, 
  X, 
  Save,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import Navbar from '../components/Navbar';

// Mock content data for admin
const INITIAL_CONTENT = [
  {
    id: '1',
    title: 'Como escalar seu negócio em 2023',
    type: 'article',
    content: 'Neste artigo, exploramos as estratégias mais eficazes para escalar seu negócio no cenário atual. Descubra como alavancar seus resultados com técnicas testadas por especialistas.',
    createdAt: '2023-06-15T14:30:00Z',
    published: true
  },
  {
    id: '2',
    title: 'Gestão de Equipes Remotas',
    type: 'video',
    videoUrl: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
    duration: '32:45',
    createdAt: '2023-06-10T09:45:00Z',
    published: true
  },
  {
    id: '3',
    title: 'Finanças para Empreendedores',
    type: 'live',
    scheduledFor: '2023-06-30T19:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
    createdAt: '2023-06-05T11:20:00Z',
    published: false
  }
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'article',
    content: '',
    videoUrl: '',
    thumbnailUrl: '',
    scheduledFor: ''
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('virtus-token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // In a real app, we would check if the user has admin rights
    // For demo purposes, we'll assume the logged-in user is an admin
    setIsAdmin(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const handleCreateContent = () => {
    setNewContent({
      title: '',
      type: 'article',
      content: '',
      videoUrl: '',
      thumbnailUrl: '',
      scheduledFor: ''
    });
    setThumbnail(null);
    setThumbnailPreview(null);
    setShowCreateModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter menos de 5MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error("O arquivo deve ser uma imagem");
      return;
    }
    
    setThumbnail(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!newContent.title) {
        toast.error("O título é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      if (newContent.type === 'article' && !newContent.content) {
        toast.error("O conteúdo do artigo é obrigatório");
        setIsSubmitting(false);
        return;
      }
      
      if ((newContent.type === 'video' || newContent.type === 'live') && !thumbnailPreview) {
        toast.error("A miniatura é obrigatória para vídeos e lives");
        setIsSubmitting(false);
        return;
      }
      
      if (newContent.type === 'live' && !newContent.scheduledFor) {
        toast.error("A data da live é obrigatória");
        setIsSubmitting(false);
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new content
      const newContentItem = {
        id: Date.now().toString(),
        title: newContent.title,
        type: newContent.type,
        content: newContent.content,
        videoUrl: newContent.videoUrl,
        thumbnailUrl: thumbnailPreview || '',
        scheduledFor: newContent.scheduledFor,
        duration: '00:00',
        createdAt: new Date().toISOString(),
        published: false
      };
      
      setContent(prev => [newContentItem, ...prev]);
      setShowCreateModal(false);
      toast.success("Conteúdo criado com sucesso!");
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Erro ao criar conteúdo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContent(prev => prev.filter(item => item.id !== id));
      setShowDeleteModal(null);
      toast.success("Conteúdo excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Erro ao excluir conteúdo");
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setContent(prev => 
        prev.map(item => 
          item.id === id ? { ...item, published: !item.published } : item
        )
      );
      
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => 
        activeTab === 'published' ? item.published : !item.published
      );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-virtus-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-virtus-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="glass-panel rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-virtus-offwhite mb-2">
                  Painel <span className="text-virtus-gold">Administrativo</span>
                </h1>
                <p className="text-gray-300">
                  Gerencie os conteúdos da comunidade VIRTUS
                </p>
              </div>
              
              <button
                onClick={handleCreateContent}
                className="mt-4 md:mt-0 px-6 py-3 rounded-md btn-gold text-base font-medium flex items-center"
              >
                <PlusCircle size={18} className="mr-2" />
                Novo Conteúdo
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === 'all' 
                    ? 'bg-virtus-gold text-virtus-black' 
                    : 'bg-virtus-darkgray text-gray-300 hover:bg-virtus-darkgray/70'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('published')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === 'published' 
                    ? 'bg-virtus-gold text-virtus-black' 
                    : 'bg-virtus-darkgray text-gray-300 hover:bg-virtus-darkgray/70'
                }`}
              >
                Publicados
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeTab === 'drafts' 
                    ? 'bg-virtus-gold text-virtus-black' 
                    : 'bg-virtus-darkgray text-gray-300 hover:bg-virtus-darkgray/70'
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
                  <tr className="bg-virtus-darkgray/70">
                    <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Título</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-virtus-gold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                      <tr key={item.id} className="animate-fade-in hover:bg-virtus-darkgray/40 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10 mr-3">
                              {(item.type === 'video' || item.type === 'live') && item.thumbnailUrl ? (
                                <img 
                                  src={item.thumbnailUrl} 
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
                            <div className="text-sm font-medium text-virtus-offwhite">
                              {item.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {item.type === 'article' ? 'Artigo' : item.type === 'video' ? 'Vídeo' : 'Live'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(item.createdAt)}
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
                              onClick={() => handleTogglePublish(item.id)}
                              className={`p-1.5 rounded-md ${
                                item.published 
                                  ? 'bg-gray-600/30 text-gray-300 hover:bg-gray-600/50' 
                                  : 'bg-green-600/30 text-green-300 hover:bg-green-600/50'
                              }`}
                            >
                              {item.published ? 'Despublicar' : 'Publicar'}
                            </button>
                            <button
                              className="p-1.5 rounded-md bg-blue-600/30 text-blue-300 hover:bg-blue-600/50"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(item.id)}
                              className="p-1.5 rounded-md bg-red-600/30 text-red-300 hover:bg-red-600/50"
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
                        Nenhum conteúdo encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-virtus-offwhite">Novo Conteúdo</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-virtus-gold"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveContent} className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-virtus-offwhite">
                    Título <span className="text-virtus-gold">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={newContent.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                    placeholder="Digite o título do conteúdo"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="type" className="block text-sm font-medium text-virtus-offwhite">
                    Tipo de Conteúdo <span className="text-virtus-gold">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newContent.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                  >
                    <option value="article">Artigo</option>
                    <option value="video">Vídeo</option>
                    <option value="live">Live</option>
                  </select>
                </div>
                
                {newContent.type === 'article' && (
                  <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-medium text-virtus-offwhite">
                      Conteúdo <span className="text-virtus-gold">*</span>
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={8}
                      value={newContent.content}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                      placeholder="Digite o conteúdo do artigo..."
                    />
                  </div>
                )}
                
                {newContent.type === 'video' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="videoUrl" className="block text-sm font-medium text-virtus-offwhite">
                        URL do Vídeo
                      </label>
                      <input
                        id="videoUrl"
                        name="videoUrl"
                        type="text"
                        value={newContent.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                        placeholder="https://exemplo.com/video"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-virtus-offwhite">
                        Miniatura do Vídeo <span className="text-virtus-gold">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img
                              src={thumbnailPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-red-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Upload size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-400 text-sm mb-4">Clique para fazer upload da miniatura</p>
                            <label 
                              htmlFor="thumbnail-upload" 
                              className="px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-sm font-medium cursor-pointer"
                            >
                              Escolher Imagem
                            </label>
                          </div>
                        )}
                        <input 
                          id="thumbnail-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleThumbnailUpload} 
                          className="hidden" 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {newContent.type === 'live' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="scheduledFor" className="block text-sm font-medium text-virtus-offwhite">
                        Data e Hora da Live <span className="text-virtus-gold">*</span>
                      </label>
                      <input
                        id="scheduledFor"
                        name="scheduledFor"
                        type="datetime-local"
                        value={newContent.scheduledFor}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-virtus-offwhite">
                        Miniatura da Live <span className="text-virtus-gold">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img
                              src={thumbnailPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-red-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Upload size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-400 text-sm mb-4">Clique para fazer upload da miniatura</p>
                            <label 
                              htmlFor="thumbnail-upload" 
                              className="px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-sm font-medium cursor-pointer"
                            >
                              Escolher Imagem
                            </label>
                          </div>
                        )}
                        <input 
                          id="thumbnail-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleThumbnailUpload} 
                          className="hidden" 
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 rounded-md border border-gray-600 text-gray-300 hover:bg-virtus-darkgray transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-md btn-gold text-base font-medium flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-xl w-full max-w-md animate-fade-in">
            <div className="p-6">
              <h2 className="text-xl font-bold text-virtus-offwhite mb-4">Confirmar Exclusão</h2>
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-virtus-darkgray transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteContent(showDeleteModal)}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
