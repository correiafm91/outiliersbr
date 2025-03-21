
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatLocalDate } from '@/integrations/supabase/client';

// Types
interface ContentItem {
  id: string;
  title: string;
  type: string;
  content?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  scheduledFor?: string;
  createdAt: string;
  published: boolean;
}

// Initial content data
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

export const useAdminContent = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

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
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleSaveContent = (newContentItem: ContentItem) => {
    // Add the new content to the existing content array
    setContent(prevContent => [newContentItem, ...prevContent]);
    toast.success("Conteúdo criado com sucesso!");
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

  const handleShowDeleteModal = (id: string) => {
    setShowDeleteModal(id);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(null);
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

  const handleEditContent = (id: string) => {
    // This would be implemented in a real app to edit content
    console.log('Edit content with ID:', id);
    toast.info("Funcionalidade de edição será implementada em breve!");
  };

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => 
        activeTab === 'published' ? item.published : !item.published
      );

  return {
    isAdmin,
    loading,
    content: filteredContent,
    activeTab,
    showCreateModal,
    showDeleteModal,
    setActiveTab,
    handleCreateContent,
    handleCloseCreateModal,
    handleSaveContent,
    handleDeleteContent,
    handleShowDeleteModal,
    handleCloseDeleteModal,
    handleTogglePublish,
    handleEditContent,
    formatDate: formatLocalDate
  };
};
