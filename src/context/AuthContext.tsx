
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

  // Função simulada para mock de login
  const mockSignIn = async (email: string) => {
    // Simula perfil de usuário para demonstração
    const mockProfile = {
      id: 'user-1',
      owner_name: email === 'teste@outliers.com' ? 'Outliersofc' : 'Usuário Teste',
      business_name: 'Outliers Network',
      email: email,
      bio: 'Plataforma de networking profissional',
      photo_url: email === 'teste@outliers.com' ? 'https://i.postimg.cc/YSzyP9rT/High-resolution-stock-photo-A-professional-commercial-image-showcasing-a-grey-letter-O-logo-agains.jpg' : null
    };
    
    setUser({
      id: 'user-1',
      email: email
    });
    
    setProfile(mockProfile);
    
    localStorage.setItem('outliers-user', JSON.stringify({
      id: 'user-1',
      email: email
    }));
    localStorage.setItem('outliers-profile', JSON.stringify(mockProfile));
    localStorage.setItem('outliers-token', 'mock-jwt-token');
  };

  // Check auth status and load profile on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Primeiro verificamos se há um usuário mockado no localStorage
        const storedUser = localStorage.getItem('outliers-user');
        const storedProfile = localStorage.getItem('outliers-profile');
        
        if (storedUser && storedProfile) {
          setUser(JSON.parse(storedUser));
          setProfile(JSON.parse(storedProfile));
          setLoading(false);
          return;
        }
        
        // Se não houver mock, tentamos o Supabase
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

    checkUser();
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    
    // Para o mock, vamos apenas retornar o perfil atual
    const storedProfile = localStorage.getItem('outliers-profile');
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
      return;
    }
    
    // Caso real com Supabase
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Tentamos o login mockado primeiro
      if (email === 'teste@outliers.com' && password === 'senha123') {
        await mockSignIn(email);
        toast.success('Login realizado com sucesso!');
        navigate('/home');
        return;
      }
      
      // Caso não seja o login mockado, tentamos o Supabase
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success('Login realizado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('Credenciais inválidas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Vamos simular o registro e retornar sucesso
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
      
      // Código do Supabase caso precise usar depois
      /*
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
      */
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Limpamos o localStorage para o mock
      localStorage.removeItem('outliers-user');
      localStorage.removeItem('outliers-profile');
      localStorage.removeItem('outliers-token');
      
      setUser(null);
      setProfile(null);
      
      // Caso esteja usando Supabase também
      await supabase.auth.signOut();
      
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao fazer logout');
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
    refreshProfile,
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
