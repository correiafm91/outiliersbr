
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, User, Search, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import NotificationsPanel from './NotificationsPanel';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-outliers-dark/90 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://i.postimg.cc/YSzyP9rT/High-resolution-stock-photo-A-professional-commercial-image-showcasing-a-grey-letter-O-logo-agains.jpg" 
                alt="Outliers Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="ml-2 text-xl font-bold text-white font-montserrat">Outliers</span>
            </Link>
          </div>

          {!isAuthPage && (
            <>
              <div className="hidden md:flex items-center space-x-6">
                {user ? (
                  <>
                    <Link to="/home" className="text-gray-300 hover:text-outliers-blue transition-colors">
                      Início
                    </Link>
                    <Link to="/content" className="text-gray-300 hover:text-outliers-blue transition-colors">
                      Meu Conteúdo
                    </Link>
                    <NotificationsPanel />
                    <MessageSquare className="h-5 w-5 text-gray-300 hover:text-outliers-blue cursor-pointer transition-colors" />
                    <div className="relative">
                      <Avatar 
                        className="h-8 w-8 cursor-pointer border border-outliers-blue/30"
                        onClick={() => navigate('/edit-profile')}
                      >
                        <AvatarImage src={profile?.photo_url || ''} />
                        <AvatarFallback className="bg-outliers-gray text-white">
                          {profile?.owner_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-white bg-outliers-blue hover:bg-outliers-blue/80 px-4 py-2 rounded transition-colors">
                      Entrar
                    </Link>
                    <Link to="/register" className="text-outliers-blue border border-outliers-blue hover:bg-outliers-blue/10 px-4 py-2 rounded transition-colors">
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && !isAuthPage && (
        <div className="md:hidden bg-outliers-gray border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center space-x-3 p-2">
                  <Avatar className="h-10 w-10 border border-outliers-blue/30">
                    <AvatarImage src={profile?.photo_url || ''} />
                    <AvatarFallback className="bg-outliers-gray text-white">
                      {profile?.owner_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-medium">
                      {profile?.owner_name || user.email}
                      {profile?.owner_name === 'Outliersofc' && (
                        <span className="verified-badge ml-1 text-xs">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {profile?.business_name || ''}
                    </div>
                  </div>
                </div>
                
                <Link to="/home" className="block p-2 text-white hover:bg-outliers-blue/20 rounded transition-colors">
                  Início
                </Link>
                <Link to="/content" className="block p-2 text-white hover:bg-outliers-blue/20 rounded transition-colors">
                  Meu Conteúdo
                </Link>
                <Link to="/edit-profile" className="block p-2 text-white hover:bg-outliers-blue/20 rounded transition-colors">
                  Editar Perfil
                </Link>
                <Link to="/settings" className="block p-2 text-white hover:bg-outliers-blue/20 rounded transition-colors">
                  Configurações
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center w-full p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full p-2 text-center text-white bg-outliers-blue hover:bg-outliers-blue/80 rounded transition-colors">
                  Entrar
                </Link>
                <Link to="/register" className="block w-full p-2 text-center text-outliers-blue border border-outliers-blue hover:bg-outliers-blue/10 rounded transition-colors">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
