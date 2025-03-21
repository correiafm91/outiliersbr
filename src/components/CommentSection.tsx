
import { useState } from 'react';
import { Send, ThumbsUp } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
}

interface CommentSectionProps {
  contentId: string;
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const CommentSection = ({ contentId, comments, onAddComment }: CommentSectionProps) => {
  const [commentText, setCommentText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      newSet.add(commentId);
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
            disabled={!commentText.trim()}
            className="px-4 py-2 rounded-r-md btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex animate-fade-in">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-virtus-darkgray/70 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-virtus-offwhite">{comment.user.name}</h4>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <button 
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={likedComments.has(comment.id)}
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
            Seja o primeiro a comentar!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
