
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Share2, Bookmark, Play, Users, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '../components/Navbar';
import CommentSection from '../components/CommentSection';

// Mock content data (will be replaced with API calls in a real application)
const MOCK_CONTENT = [
  {
    id: '1',
    title: 'Como escalar seu negócio em 2023',
    type: 'article',
    content: 'Neste artigo, exploramos as estratégias mais eficazes para escalar seu negócio no cenário atual. Descubra como alavancaria seus resultados com técnicas testadas por especialistas.',
    author: {
      name: 'Ricardo Silva',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    createdAt: '2023-06-15T14:30:00Z',
    likes: 42,
    comments: [
      {
        id: 'c1',
        user: {
          name: 'Ana Beatriz',
          avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
        },
        content: 'Excelente conteúdo! Apliquei algumas dessas técnicas e já estou vendo resultados.',
        createdAt: '2023-06-16T10:15:00Z',
        likes: 5
      }
    ]
  },
  {
    id: '2',
    title: 'Gestão de Equipes Remotas',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
    videoUrl: '#',
    duration: '32:45',
    author: {
      name: 'Mariana Costa',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    createdAt: '2023-06-10T09:45:00Z',
    likes: 126,
    comments: []
  },
  {
    id: '3',
    title: 'Live: Finanças para Empreendedores',
    type: 'live',
    scheduledFor: '2023-06-30T19:00:00Z',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
    author: {
      name: 'Paulo Menezes',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    createdAt: '2023-06-05T11:20:00Z',
    participants: 230,
    comments: []
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const Home = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(MOCK_CONTENT);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('virtus-token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check if profile exists
    const profileData = localStorage.getItem('virtus-user-profile');
    if (!profileData) {
      navigate('/create-profile');
      return;
    }
    
    setProfile(JSON.parse(profileData));
    
    // Simulate loading content
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const toggleComments = (contentId: string) => {
    if (showComments === contentId) {
      setShowComments(null);
    } else {
      setShowComments(contentId);
    }
  };

  const handleLike = (contentId: string) => {
    setContent(prev => 
      prev.map(item => 
        item.id === contentId ? { ...item, likes: item.likes + 1 } : item
      )
    );
    toast.success("Conteúdo curtido!");
  };

  const handleBookmark = () => {
    toast.success("Conteúdo salvo para ver mais tarde!");
  };

  const handleShare = () => {
    toast.success("Link copiado para a área de transferência!");
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
                  Bem-vindo, <span className="text-virtus-gold">{profile?.ownerName.split(' ')[0]}</span>
                </h1>
                <p className="text-gray-300">
                  Confira os conteúdos exclusivos da nossa comunidade
                </p>
              </div>
              
              {content.map((item) => (
                <div key={item.id} className="glass-panel rounded-xl overflow-hidden animate-fade-up card-hover">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-virtus-offwhite">{item.author.name}</h3>
                        <p className="text-sm text-gray-400">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-virtus-gold mb-3">{item.title}</h2>
                    
                    {item.type === 'article' && (
                      <p className="text-gray-300 mb-4">{item.content}</p>
                    )}
                    
                    {(item.type === 'video' || item.type === 'live') && (
                      <div className="relative mb-4 rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <button className="w-16 h-16 rounded-full bg-virtus-gold/80 hover:bg-virtus-gold transition-colors flex items-center justify-center">
                            <Play size={32} className="text-virtus-black ml-1" />
                          </button>
                        </div>
                        
                        {item.type === 'video' && (
                          <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded text-sm text-white">
                            {item.duration}
                          </div>
                        )}
                        
                        {item.type === 'live' && (
                          <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-sm text-white flex items-center">
                            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                            AO VIVO
                          </div>
                        )}
                      </div>
                    )}
                    
                    {item.type === 'live' && (
                      <div className="flex items-center text-gray-300 mb-4">
                        <Users size={16} className="mr-2" />
                        <span>{item.participants} participantes</span>
                        <span className="mx-2">•</span>
                        <span>Agendado para {new Date(item.scheduledFor).toLocaleString('pt-BR')}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(item.id)}
                          className="flex items-center text-gray-400 hover:text-virtus-gold transition-colors"
                        >
                          <ThumbsUp size={18} className="mr-1" />
                          <span>{item.likes}</span>
                        </button>
                        
                        <button 
                          onClick={() => toggleComments(item.id)}
                          className="flex items-center text-gray-400 hover:text-virtus-gold transition-colors"
                        >
                          <MessageSquare size={18} className="mr-1" />
                          <span>{item.comments.length}</span>
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
                          onClick={handleShare}
                          className="text-gray-400 hover:text-virtus-gold transition-colors"
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {showComments === item.id && (
                      <CommentSection 
                        contentId={item.id} 
                        comments={item.comments}
                        onAddComment={(comment) => {
                          // In a real app, we would call an API to add the comment
                          toast.success("Comentário adicionado com sucesso!");
                          const newComment = {
                            id: `c${Date.now()}`,
                            user: {
                              name: profile.ownerName,
                              avatar: profile.photoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'
                            },
                            content: comment,
                            createdAt: new Date().toISOString(),
                            likes: 0
                          };
                          
                          setContent(prev => 
                            prev.map(c => 
                              c.id === item.id 
                                ? { ...c, comments: [...c.comments, newComment] } 
                                : c
                            )
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Profile card */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <div className="flex items-center">
                  <div className="mr-4">
                    {profile.photoUrl ? (
                      <img 
                        src={profile.photoUrl} 
                        alt={profile.ownerName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-virtus-gold"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-virtus-darkgray flex items-center justify-center border-2 border-virtus-gold">
                        <span className="text-xl font-bold text-virtus-gold">
                          {profile.ownerName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-virtus-offwhite">{profile.ownerName}</h3>
                    <p className="text-sm text-gray-400">{profile.businessName}</p>
                  </div>
                </div>
                
                {profile.bio && (
                  <p className="text-gray-300 mt-4 text-sm">
                    {profile.bio}
                  </p>
                )}
              </div>
              
              {/* Upcoming events */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-virtus-offwhite mb-4">Próximas Lives</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      id: 'live1',
                      title: 'Marketing Digital para Pequenos Negócios',
                      date: '28/06/2023 - 19:00',
                      host: 'Juliana Torres'
                    },
                    {
                      id: 'live2',
                      title: 'Gestão Financeira na Prática',
                      date: '05/07/2023 - 20:00',
                      host: 'Ricardo Almeida'
                    }
                  ].map(event => (
                    <div key={event.id} className="border border-gray-700 rounded-lg p-3 hover:border-virtus-gold/50 transition-colors">
                      <h4 className="font-medium text-virtus-gold">{event.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{event.date}</p>
                      <p className="text-xs text-gray-500 mt-1">por {event.host}</p>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold hover:bg-virtus-gold/10 transition-colors text-sm">
                  Ver todos
                </button>
              </div>
              
              {/* Community members */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-virtus-offwhite mb-4">Membros da Comunidade</h3>
                
                <div className="flex flex-wrap">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-1/4 p-1">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${10 + i}.jpg`}
                        alt="Community member"
                        className="w-full aspect-square rounded-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold hover:bg-virtus-gold/10 transition-colors text-sm">
                  Ver todos os membros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
