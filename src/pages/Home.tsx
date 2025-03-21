import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);

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
    
    // Load content from Supabase
    const loadContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select(`
            *,
            profiles:author_id(owner_name, photo_url),
            comments:comments(
              id,
              content,
              created_at,
              user_id,
              profiles:user_id(owner_name, photo_url),
              likes
            )
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Error loading content:', error);
        toast.error('Erro ao carregar conteúdos');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, [user, profile, navigate]);

  const toggleComments = (contentId: string) => {
    if (showComments === contentId) {
      setShowComments(null);
    } else {
      setShowComments(contentId);
    }
  };

  const handleLike = async (contentId: string) => {
    if (!user) return;
    
    try {
      // Check if user already liked this content
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('content_id', contentId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingLike) {
        // Unlike if already liked
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        
        toast.success('Like removido!');
      } else {
        // Add like
        await supabase
          .from('likes')
          .insert({
            content_id: contentId,
            user_id: user.id,
          });
        
        toast.success('Conteúdo curtido!');
      }
      
      // Refresh content
      const { data: updatedContent } = await supabase
        .from('content')
        .select(`
          *,
          profiles:author_id(owner_name, photo_url),
          comments:comments(
            id,
            content,
            created_at,
            user_id,
            profiles:user_id(owner_name, photo_url),
            likes
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (updatedContent) {
        setContent(updatedContent);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Erro ao processar ação');
    }
  };

  const handleBookmark = () => {
    toast.success("Conteúdo salvo para ver mais tarde!");
  };

  const handleShare = (title: string) => {
    // Generate a shareable link
    const shareUrl = `${window.location.origin}/content/${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Link copiado para a área de transferência!");
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Erro ao copiar link");
    });
  };

  const handleAddComment = async (contentId: string, commentText: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content_id: contentId,
          user_id: user.id,
          content: commentText,
        });
      
      if (error) throw error;
      
      toast.success('Comentário adicionado com sucesso!');
      
      // Refresh content
      const { data: updatedContent } = await supabase
        .from('content')
        .select(`
          *,
          profiles:author_id(owner_name, photo_url),
          comments:comments(
            id,
            content,
            created_at,
            user_id,
            profiles:user_id(owner_name, photo_url),
            likes
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (updatedContent) {
        setContent(updatedContent);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erro ao adicionar comentário');
    }
  };

  if (loading) {
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-2/3 space-y-8">
              <div className="glass-panel p-6 rounded-xl animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-virtus-offwhite mb-2">
                  Bem-vindo à <span className="text-virtus-gold">Retórica de Marcas</span>
                </h1>
                <p className="text-gray-300">
                  Explore a arte de criar marcas memoráveis com a VIRTUS. Nossa comunidade exclusiva traz conteúdos especializados em Retórica de Marcas, um serviço único desenvolvido para transformar sua identidade de negócio.
                </p>
              </div>
              
              {content.length > 0 ? (
                content.map((item) => (
                  <div key={item.id} className="glass-panel rounded-xl overflow-hidden animate-fade-up card-hover">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        {item.profiles?.photo_url ? (
                          <img
                            src={item.profiles.photo_url}
                            alt={item.profiles.owner_name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-virtus-gold/20 flex items-center justify-center mr-3">
                            <span className="text-virtus-gold font-medium">
                              {item.profiles?.owner_name.charAt(0) || 'V'}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-virtus-offwhite">{item.profiles?.owner_name || 'VIRTUS'}</h3>
                          <p className="text-sm text-gray-400">{formatLocalDate(item.created_at)}</p>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-virtus-gold mb-3">{item.title}</h2>
                      
                      {item.type === 'article' && item.content && (
                        <p className="text-gray-300 mb-4">{item.content}</p>
                      )}
                      
                      {(item.type === 'video' || item.type === 'live') && item.thumbnail_url && (
                        <div className="relative mb-4 rounded-lg overflow-hidden">
                          <img
                            src={item.thumbnail_url}
                            alt={item.title}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <button className="w-16 h-16 rounded-full bg-virtus-gold/80 hover:bg-virtus-gold transition-colors flex items-center justify-center">
                              <Play size={32} className="text-virtus-black ml-1" />
                            </button>
                          </div>
                          
                          {item.type === 'live' && (
                            <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-sm text-white flex items-center">
                              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                              AO VIVO
                            </div>
                          )}
                        </div>
                      )}
                      
                      {item.type === 'live' && item.scheduled_for && (
                        <div className="flex items-center text-gray-300 mb-4">
                          <Users size={16} className="mr-2" />
                          <span>Agendado para {formatLocalDateTime(item.scheduled_for)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-4 border-t border-gray-700">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => handleLike(item.id)}
                            className="flex items-center text-gray-400 hover:text-virtus-gold transition-colors"
                          >
                            <ThumbsUp size={18} className="mr-1" />
                            <span>Curtir</span>
                          </button>
                          
                          <button 
                            onClick={() => toggleComments(item.id)}
                            className="flex items-center text-gray-400 hover:text-virtus-gold transition-colors"
                          >
                            <MessageSquare size={18} className="mr-1" />
                            <span>{item.comments?.length || 0}</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={handleBookmark}
                            className="text-gray-400 hover:text-virtus-gold transition-colors"
                          >
                            <Bookmark size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleShare(item.title)}
                            className="text-gray-400 hover:text-virtus-gold transition-colors"
                          >
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {showComments === item.id && (
                        <CommentSection 
                          contentId={item.id} 
                          comments={item.comments || []}
                          onAddComment={(comment) => handleAddComment(item.id, comment)}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel rounded-xl p-8 text-center">
                  <h2 className="text-xl font-bold text-virtus-gold mb-4">Sem conteúdos disponíveis</h2>
                  <p className="text-gray-300 mb-4">
                    Não há conteúdos publicados no momento. Volte em breve para novidades sobre Retórica de Marcas.
                  </p>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Profile card */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <div className="flex items-center">
                  <div className="mr-4">
                    {profile.photo_url ? (
                      <img 
                        src={profile.photo_url} 
                        alt={profile.owner_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-virtus-gold"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-virtus-darkgray flex items-center justify-center border-2 border-virtus-gold">
                        <span className="text-xl font-bold text-virtus-gold">
                          {profile.owner_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-virtus-offwhite">{profile.owner_name}</h3>
                    <p className="text-sm text-gray-400">{profile.business_name}</p>
                  </div>
                </div>
                
                {profile.bio && (
                  <p className="text-gray-300 mt-4 text-sm">
                    {profile.bio}
                  </p>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Link 
                    to="/create-content" 
                    className="w-full px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold hover:bg-virtus-gold/10 transition-colors text-sm flex items-center justify-center"
                  >
                    <PlusCircle size={16} className="mr-2" />
                    Criar Conteúdo
                  </Link>
                </div>
              </div>
              
              {/* About Retórica de Marcas */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-virtus-offwhite mb-4">Sobre Retórica de Marcas</h3>
                <p className="text-gray-300 text-sm mb-4">
                  A Retórica de Marcas é um serviço exclusivo da VIRTUS que combina estratégia, psicologia e design para criar marcas com personalidade única e comunicação poderosa.
                </p>
                <p className="text-gray-300 text-sm">
                  Nossa metodologia exclusiva transforma negócios através de uma identidade autêntica e memorável, conectando-se profundamente com seu público-alvo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
