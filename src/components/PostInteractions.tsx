
import { useState } from 'react';
import { Heart, MessageSquare, Share, Send, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PostInteractionsProps {
  postId: string;
  initialLikes: number;
  initialComments: any[];
  onComment?: (comment: string) => void;
  onLike?: () => void;
}

const PostInteractions = ({ 
  postId, 
  initialLikes = 0, 
  initialComments = [],
  onComment,
  onLike
}: PostInteractionsProps) => {
  const { user, profile } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const handleLike = () => {
    if (!user) {
      toast.error('Faça login para curtir este post');
      return;
    }
    
    // Toggle like status
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    
    if (onLike) {
      onLike();
    }
    
    // In a real app, we would update the database
  };
  
  const handleAddComment = () => {
    if (!user) {
      toast.error('Faça login para comentar neste post');
      return;
    }
    
    if (!newComment.trim()) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      author: {
        id: user.id,
        name: profile?.owner_name || user.email,
        photo: profile?.photo_url,
        isVerified: profile?.owner_name === 'Outliersofc'
      },
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    
    if (onComment) {
      onComment(newComment);
    }
    
    // In a real app, we would update the database
  };
  
  const handleShare = (type: 'link' | 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    
    switch (type) {
      case 'link':
        navigator.clipboard.writeText(postUrl)
          .then(() => {
            toast.success('Link copiado para a área de transferência');
            setShowShareOptions(false);
          })
          .catch(() => {
            toast.error('Falha ao copiar o link');
          });
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(postUrl)}`, '_blank');
        break;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-t border-b border-gray-700 py-2">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike} 
            className={`flex items-center space-x-1 ${liked ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart size={20} className={liked ? 'fill-current' : ''} />
            <span>{likes}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="flex items-center space-x-1 text-gray-400 hover:text-white"
          >
            <MessageSquare size={20} />
            <span>{comments.length}</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowShareOptions(!showShareOptions)} 
              className="flex items-center space-x-1 text-gray-400 hover:text-white"
            >
              <Share size={20} />
              <span>Compartilhar</span>
            </button>
            
            {showShareOptions && (
              <div className="absolute left-0 mt-2 p-2 bg-outliers-gray rounded-md shadow-lg z-10 border border-gray-700 min-w-[200px]">
                <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                  <span className="text-sm text-white">Compartilhar</span>
                  <button 
                    onClick={() => setShowShareOptions(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => handleShare('link')} 
                  className="flex items-center space-x-2 w-full text-left p-2 text-gray-300 hover:bg-outliers-blue/20 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span>Copiar link</span>
                </button>
                <button 
                  onClick={() => handleShare('facebook')} 
                  className="flex items-center space-x-2 w-full text-left p-2 text-gray-300 hover:bg-outliers-blue/20 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4267B2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span>Facebook</span>
                </button>
                <button 
                  onClick={() => handleShare('linkedin')} 
                  className="flex items-center space-x-2 w-full text-left p-2 text-gray-300 hover:bg-outliers-blue/20 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0077B5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span>LinkedIn</span>
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')} 
                  className="flex items-center space-x-2 w-full text-left p-2 text-gray-300 hover:bg-outliers-blue/20 rounded transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.257-.764.966-.93 1.164-.173.207-.345.223-.644.075-.3-.15-1.267-.466-2.414-1.485-.893-.795-1.484-1.77-1.66-2.07-.176-.3-.019-.465.13-.613.136-.135.301-.345.451-.523.146-.172.194-.296.296-.495.1-.198.05-.372-.025-.521-.075-.148-.672-1.62-.922-2.216-.242-.579-.486-.5-.672-.51a11.85 11.85 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.48 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.032-1.378l-.36-.214-3.742.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.266c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.412-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showComments && (
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            {user && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={profile?.photo_url || ''} />
                <AvatarFallback className="bg-outliers-blue/20 text-outliers-blue">
                  {profile?.owner_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="input-dark flex-1"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-outliers-blue hover:bg-outliers-blue/80"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
            {comments.length > 0 ? comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={comment.author.photo || ''} />
                  <AvatarFallback className="bg-outliers-blue/20 text-outliers-blue">
                    {comment.author.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 bg-outliers-gray/50 rounded-md p-2">
                  <div className="flex items-center">
                    <span className="font-medium text-white text-sm">
                      {comment.author.name}
                    </span>
                    {comment.author.isVerified && (
                      <span className="inline-flex items-center bg-outliers-blue rounded-full p-0.5 ml-1" title="Perfil Verificado">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(comment.timestamp).toLocaleString('pt-BR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm mt-1">{comment.content}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button className="text-xs text-gray-400 hover:text-white">
                      Curtir
                    </button>
                    <span className="text-gray-500">•</span>
                    <button className="text-xs text-gray-400 hover:text-white">
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-400 py-4">
                Seja o primeiro a comentar
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostInteractions;
