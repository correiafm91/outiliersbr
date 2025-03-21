
import { useState } from 'react';
import { X, Upload, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NewContent {
  title: string;
  type: string;
  content: string;
  videoUrl: string;
  thumbnailUrl: string;
  scheduledFor: string;
}

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: any) => void;
}

const CreateContentModal = ({ isOpen, onClose, onSave }: CreateContentModalProps) => {
  const [newContent, setNewContent] = useState<NewContent>({
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
      
      onSave(newContentItem);
      onClose();
      toast.success("Conteúdo criado com sucesso!");
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Erro ao criar conteúdo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-virtus-offwhite">Novo Conteúdo</h2>
          <button 
            onClick={onClose}
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
                onClick={onClose}
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
  );
};

export default CreateContentModal;
