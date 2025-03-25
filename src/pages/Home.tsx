
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!user && !loading) {
      navigate('/login');
      return;
    }
    
    // Check if profile exists
    if (user && !profile && !loading) {
      navigate('/create-profile');
      return;
    }
  }, [user, profile, loading, navigate]);

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
                  Connect with industry leaders and expand your professional network. Outliers is your platform for meaningful business connections and opportunities.
                </p>
              </div>
              
              <div className="glass-panel rounded-xl p-8 text-center">
                <h2 className="text-xl font-bold text-outliers-blue mb-4">No content available</h2>
                <p className="text-gray-300 mb-4">
                  There are no posts available at the moment. Check back soon for updates.
                </p>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-8">
              {/* Profile card */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <div className="flex items-center">
                  <div className="mr-4 relative">
                    {profile?.photo_url ? (
                      <div className="relative">
                        <img 
                          src={profile.photo_url} 
                          alt={profile.owner_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-outliers-blue"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-outliers-gray flex items-center justify-center border-2 border-outliers-blue">
                        <span className="text-xl font-bold text-outliers-blue">
                          {profile?.owner_name.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-bold text-white">{profile?.owner_name || 'User'}</h3>
                    </div>
                    <p className="text-sm text-gray-400">{profile?.business_name || ''}</p>
                  </div>
                </div>
                
                {profile?.bio && (
                  <p className="text-gray-300 mt-4 text-sm">
                    {profile.bio}
                  </p>
                )}
              </div>
              
              {/* About Outliers */}
              <div className="glass-panel rounded-xl p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-4">About Outliers</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Outliers is a professional networking platform designed to connect visionary entrepreneurs and business professionals.
                </p>
                <p className="text-gray-300 text-sm">
                  Our platform helps you build meaningful business relationships, discover opportunities, and expand your professional network.
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
