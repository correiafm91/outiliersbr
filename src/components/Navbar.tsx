
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in (we'll implement actual auth later)
    const user = localStorage.getItem('virtus-user');
    setIsLoggedIn(!!user);

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

  const handleLogout = () => {
    localStorage.removeItem('virtus-user');
    localStorage.removeItem('virtus-token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 bg-virtus-black/90 backdrop-blur-lg shadow-md' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl font-playfair font-bold text-virtus-gold animate-smooth group-hover:text-shadow-gold">
            VIRTUS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm uppercase tracking-wider hover:text-virtus-gold transition-colors ${
              location.pathname === '/' ? 'text-virtus-gold' : 'text-virtus-offwhite'
            }`}
          >
            Início
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link 
                to="/home" 
                className={`text-sm uppercase tracking-wider hover:text-virtus-gold transition-colors ${
                  location.pathname === '/home' ? 'text-virtus-gold' : 'text-virtus-offwhite'
                }`}
              >
                Comunidade
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm uppercase tracking-wider hover:text-virtus-gold transition-colors">
                  <User size={16} />
                  Perfil
                </button>
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
                  <div className="glass-panel rounded-md shadow-lg overflow-hidden">
                    <Link to="/profile" className="block px-4 py-3 text-sm hover:bg-virtus-gold/10 transition-colors">
                      Meu Perfil
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-virtus-gold/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`text-sm uppercase tracking-wider hover:text-virtus-gold transition-colors ${
                  location.pathname === '/login' ? 'text-virtus-gold' : 'text-virtus-offwhite'
                }`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-sm px-5 py-2 rounded-md btn-gold uppercase tracking-wider"
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
            <X size={24} className="text-virtus-gold" />
          ) : (
            <Menu size={24} className="text-virtus-gold" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden fixed inset-0 bg-virtus-black/95 backdrop-blur-lg z-40 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
          <Link 
            to="/" 
            className="text-xl uppercase tracking-wide hover:text-virtus-gold transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Início
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link 
                to="/home" 
                className="text-xl uppercase tracking-wide hover:text-virtus-gold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comunidade
              </Link>
              <Link 
                to="/profile" 
                className="text-xl uppercase tracking-wide hover:text-virtus-gold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Meu Perfil
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-xl uppercase tracking-wide hover:text-virtus-gold transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-xl uppercase tracking-wide hover:text-virtus-gold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-xl px-8 py-3 rounded-md btn-gold uppercase tracking-wide"
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
