
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, FileText, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 bg-outliers-dark/90 backdrop-blur-lg shadow-md' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <img 
            src="https://i.postimg.cc/YSzyP9rT/High-resolution-stock-photo-A-professional-commercial-image-showcasing-a-grey-letter-O-logo-agains.jpg" 
            alt="Outliers Logo" 
            className="h-8 w-auto"
          />
          <span className="text-2xl font-montserrat font-bold text-outliers-blue animate-smooth group-hover:text-shadow-blue">
            OUTLIERS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm uppercase tracking-wider hover:text-outliers-blue transition-colors ${
              location.pathname === '/' ? 'text-outliers-blue' : 'text-white'
            }`}
          >
            Início
          </Link>
          
          {user && profile ? (
            <>
              <Link 
                to="/home" 
                className={`text-sm uppercase tracking-wider hover:text-outliers-blue transition-colors ${
                  location.pathname === '/home' ? 'text-outliers-blue' : 'text-white'
                }`}
              >
                Comunidade
              </Link>
              <Link 
                to="/content" 
                className={`text-sm uppercase tracking-wider hover:text-outliers-blue transition-colors ${
                  location.pathname === '/content' ? 'text-outliers-blue' : 'text-white'
                }`}
              >
                Meus Conteúdos
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-outliers-blue transition-colors outline-none">
                  <User size={16} />
                  Perfil
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-outliers-gray border border-gray-700 text-white">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      {profile.photo_url ? (
                        <img 
                          src={profile.photo_url} 
                          alt={profile.owner_name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-outliers-blue/20 flex items-center justify-center">
                          <span className="text-outliers-blue font-medium">
                            {profile.owner_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{profile.owner_name}</span>
                        <span className="text-xs text-gray-400">{profile.business_name}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="hover:bg-outliers-blue/10 cursor-pointer" onClick={() => window.location.href = '/edit-profile'}>
                    <User size={16} className="mr-2" />
                    Editar Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-outliers-blue/10 cursor-pointer" onClick={() => window.location.href = '/settings'}>
                    <Settings size={16} className="mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-outliers-blue/10 cursor-pointer" onClick={() => window.location.href = '/create-content'}>
                    <Plus size={16} className="mr-2" />
                    Criar Conteúdo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="hover:bg-outliers-blue/10 cursor-pointer" onClick={signOut}>
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`text-sm uppercase tracking-wider hover:text-outliers-blue transition-colors ${
                  location.pathname === '/login' ? 'text-outliers-blue' : 'text-white'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm px-5 py-2 rounded-md btn-blue uppercase tracking-wider"
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X size={24} className="text-outliers-blue" />
          ) : (
            <Menu size={24} className="text-outliers-blue" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden fixed inset-0 bg-outliers-dark/95 backdrop-blur-lg z-40 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
          <Link 
            to="/" 
            className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Início
          </Link>
          
          {user && profile ? (
            <>
              <Link 
                to="/home" 
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comunidade
              </Link>
              <Link 
                to="/content" 
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Meus Conteúdos
              </Link>
              <Link 
                to="/edit-profile" 
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Editar Perfil
              </Link>
              <Link 
                to="/settings" 
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Configurações
              </Link>
              <Link 
                to="/create-content" 
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Criar Conteúdo
              </Link>
              <button 
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-xl uppercase tracking-wide hover:text-outliers-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-xl px-8 py-3 rounded-md btn-blue uppercase tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                Cadastre-se
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
