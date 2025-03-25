
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isAdmin } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  owner_name: string;
  business_name: string;
  email: string;
  bio: string | null;
  photo_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminStatus, setAdminStatus] = useState(false);
  const navigate = useNavigate();

  // Check auth status and load profile on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get user from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
          });
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
          
          // Check if user is admin
          const adminCheck = await isAdmin();
          setAdminStatus(adminCheck);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
            });
            await refreshProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    checkUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async (userId?: string) => {
    const id = userId || user?.id;
    if (!id) return;
    
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (profileData) {
        setProfile(profileData);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Real Supabase authentication
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Get updated user and profile data
      const { data: { user: updatedUser } } = await supabase.auth.getUser();
      
      if (updatedUser) {
        setUser({
          id: updatedUser.id,
          email: updatedUser.email || '',
        });
        
        await refreshProfile(updatedUser.id);
      }
      
      toast.success('Login successful!');
      navigate('/home');
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw new Error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Real Supabase registration
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) throw error;
      
      // Set user state - we don't need to create a profile here
      // as we'll redirect to the create-profile page
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
      }
      
      toast.success('Registration successful! Please complete your profile.');
      navigate('/create-profile');
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      setUser(null);
      setProfile(null);
      
      toast.success('Logout successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error during logout');
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: adminStatus,
    signIn,
    signUp,
    signOut,
    refreshProfile: () => refreshProfile(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
