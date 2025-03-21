
import { useState } from 'react';
import { Send, ThumbsUp, Loader2 } from 'lucide-react';
import { supabase, formatLocalDateTime } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CommentUser {
  owner_name: string;
  photo_url: string | null;
}

interface Comment {
  id: string;
  user_id: string;
  profiles?: CommentUser;
  content: string;
  created_at: string;
  likes: number;
}

interface CommentSectionProps {
  contentId: string;
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const CommentSection = ({ contentId, comments, onAddComment }: CommentSectionProps) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    
    setSubmitting(true);
    onAddComment(commentText);
    setCommentText('');
    setSubmitting(false);
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para curtir um comentário');
      return;
    }
    
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        
        setLikedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({
            comment_id: commentId,
            user_id: user.id,
          });
        
        setLikedComments(prev => {
          const newSet = new Set(prev);
          newSet.add(commentId);
          return newSet;
        });
      }
      
      // No need to refresh as we're updating local state
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Erro ao curtir comentário');
    }
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-700">
      <h3 className="text-virtus-offwhite font-medium mb-4">Comentários ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 px-4 py-2 rounded-l-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || submitting}
            className="px-4 py-2 rounded-r-md btn-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex animate-fade-in">
              {comment.profiles?.photo_url ? (
                <img
                  src={comment.profiles.photo_url}
                  alt={comment.profiles.owner_name}
                  className="w-10 h-10 rounded-full mr-3 flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-virtus-gold/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-virtus-gold font-medium">
                    {comment.profiles?.owner_name.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="bg-virtus-darkgray/70 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-virtus-offwhite">{comment.profiles?.owner_name}</h4>
                    <span className="text-xs text-gray-400">{formatLocalDateTime(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center mr-4 hover:text-virtus-gold transition-colors ${
                      likedComments.has(comment.id) ? 'text-virtus-gold' : ''
                    }`}
                  >
                    <ThumbsUp size={14} className="mr-1" />
                    <span>{comment.likes + (likedComments.has(comment.id) ? 1 : 0)}</span>
                  </button>
                  <button className="hover:text-virtus-gold transition-colors">
                    Responder
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-4">
            Seja o primeiro a comentar sobre Retórica de Marcas!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
