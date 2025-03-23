
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ThumbsUp, MessageSquare, Bookmark, Share2, Play, Users } from 'lucide-react';
import { toast } from "sonner";
import { supabase, formatLocalDate, formatLocalDateTime } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import CommentSection from '@/components/CommentSection';

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
        toast.error('Error loading content');
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
        
        toast.success('Like removed!');
      } else {
        // Add like
        await supabase
          .from('likes')
          .insert({
            content_id: contentId,
            user_id: user.id,
          });
        
        toast.success('Content liked!');
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
      toast.error('Error processing action');
    }
  };

  const handleBookmark = () => {
    toast.success("Content saved for later!");
  };

  const handleShare = (title: string) => {
    // Generate a shareable link
    const shareUrl = `${window.location.origin}/content/${title.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error("Error copying link");
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
      
      toast.success('Comment added successfully!');
      
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
      toast.error('Error adding comment');
    }
  };

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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-2/3 space-y-8">
              <div className="glass-panel p-6 rounded-xl animate-fade-in">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Welcome to <span className="text-outliers-blue">Outliers</span>
                </h1>
                <p className="text-gray-300">
                  Connect with industry leaders and grow your professional network. Outliers is your platform for meaningful business connections and opportunities.
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
                          <div className="w-10 h-10 rounded-full bg-outliers-blue/20 flex items-center justify-center mr-3">
                            <span className="text-outliers-blue font-medium">
                              {item.profiles?.owner_name.charAt(0) || 'O'}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-white">{item.profiles?.owner_name || 'Outliers'}</h3>
                          <p className="text-sm text-gray-400">{formatLocalDate(item.created_at)}</p>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-outliers-blue mb-3">{item.title}</h2>
                      
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
                            <button className="w-16 h-16 rounded-full bg-outliers-blue/80 hover:bg-outliers-blue transition-colors flex items-center justify-center">
                              <Play size={32} className="text-white ml-1" />
                            </button>
                          </div>
                          
                          {item.type === 'live' && (
                            <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-sm text-white flex items-center">
                              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                              LIVE
                            </div>
                          )}
                        </div>
                      )}
                      
                      {item.type === 'live' && item.scheduled_for && (
                        <div className="flex items-center text-gray-300 mb-4">
                          <Users size={16} className="mr-2" />
                          <span>Scheduled for {formatLocalDateTime(item.scheduled_for)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-4 border-t border-gray-700">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => handleLike(item.id)}
                            className="flex items-center text-gray-400 hover:text-outliers-blue transition-colors"
                          >
                            <ThumbsUp size={18} className="mr-1" />
                            <span>Like</span>
                          </button>
                          
                          <button 
                            onClick={() => toggleComments(item.id)}
                            className="flex items-center text-gray-400 hover:text-outliers-blue transition-colors"
                          >
                            <MessageSquare size={18} className="mr-1" />
                            <span>{item.comments?.length || 0}</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={handleBookmark}
                            className="text-gray-400 hover:text-outliers-blue transition-colors"
                          >
                            <Bookmark size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleShare(item.title)}
                            className="text-gray-400 hover:text-outliers-blue transition-colors"
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
                  <h2 className="text-xl font-bold text-outliers-blue mb-4">No content available</h2>
                  <p className="text-gray-300 mb-4">
                    There are no posts available at the moment. Come back soon for updates.
                  </p>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Profile card */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <div className="flex items-center">
                  <div className="mr-4 relative">
                    {profile.photo_url ? (
                      <div className="relative">
                        <img 
                          src={profile.photo_url} 
                          alt={profile.owner_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-outliers-blue"
                        />
                        {profile.owner_name === "Outliersofc" && (
                          <div className="absolute -bottom-1 -right-1 bg-outliers-blue text-white rounded-full p-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-outliers-gray flex items-center justify-center border-2 border-outliers-blue">
                        <span className="text-xl font-bold text-outliers-blue">
                          {profile.owner_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold text-white">{profile.owner_name}</h3>
                      {profile.owner_name === "Outliersofc" && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-outliers-blue" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
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
                    className="w-full px-4 py-2 rounded-md border border-outliers-blue/50 text-outliers-blue hover:bg-outliers-blue/10 transition-colors text-sm flex items-center justify-center"
                  >
                    <Loader2 size={16} className="mr-2" />
                    Create Post
                  </Link>
                </div>
              </div>
              
              {/* About Outliers */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-4">About Outliers</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Outliers is a professional networking platform designed to connect forward-thinking entrepreneurs and business professionals.
                </p>
                <p className="text-gray-300 text-sm">
                  Our platform helps you build meaningful business relationships, discover opportunities, and grow your professional network.
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
