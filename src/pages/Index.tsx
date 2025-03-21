
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, PlayCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 md:py-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div 
              className={`md:w-1/2 space-y-6 transition-all duration-700 transform 
                ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-10'}`}
            >
              <div className="inline-block px-3 py-1 rounded-full border border-virtus-gold/30 bg-virtus-gold/10 mb-4">
                <span className="text-sm font-medium text-virtus-gold">Comunidade Exclusiva</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-virtus-offwhite">
                Bem-vindo à <span className="text-virtus-gold text-shadow-gold">VIRTUS</span> Community
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Uma comunidade exclusiva para empreendedores que buscam crescimento, conexões e conhecimento para transformar seus negócios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/register" 
                  className="px-8 py-4 rounded-md btn-gold text-base font-medium"
                >
                  Junte-se à Comunidade <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-base font-medium flex items-center justify-center"
                >
                  Faça Login
                </Link>
              </div>
            </div>
            <div 
              className={`md:w-1/2 mt-16 md:mt-0 transition-all duration-700 delay-300 
                ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
            >
              <div className="relative">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-virtus-gold/20 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="glass-panel rounded-2xl overflow-hidden relative z-10 gold-glow">
                  <div className="aspect-video bg-virtus-darkgray flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="text-2xl font-bold text-virtus-gold mb-4">Comunidade Virtus</h3>
                      <p className="text-gray-300 mb-6">Conteúdos exclusivos, lives e networking com outros empreendedores.</p>
                      <button className="animate-pulse-gold w-16 h-16 rounded-full bg-virtus-gold flex items-center justify-center text-virtus-black">
                        <PlayCircle size={32} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className={`py-20 bg-virtus-darkgray transition-all duration-700 delay-500 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-virtus-offwhite mb-6">
              O que oferecemos para <span className="text-virtus-gold">você</span>
            </h2>
            <p className="text-gray-300">
              Nossa comunidade foi criada para conectar empreendedores e oferecer conteúdo exclusivo para o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={48} className="text-virtus-gold" />,
                title: "Comunidade Exclusiva",
                description: "Conecte-se com empreendedores que compartilham seus objetivos e desafios."
              },
              {
                icon: <BookOpen size={48} className="text-virtus-gold" />,
                title: "Conteúdo Premium",
                description: "Acesse conteúdos exclusivos produzidos por especialistas em negócios."
              },
              {
                icon: <PlayCircle size={48} className="text-virtus-gold" />,
                title: "Lives Interativas",
                description: "Participe de transmissões ao vivo com mentores e faça perguntas em tempo real."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass-panel rounded-xl p-8 card-hover"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-virtus-gold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className={`py-20 bg-virtus-black transition-all duration-700 delay-700 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto gold-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-virtus-offwhite mb-6">
              Pronto para transformar seu <span className="text-virtus-gold">negócio</span>?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Junte-se à nossa comunidade hoje e tenha acesso a conteúdos exclusivos, networking e muito mais.
            </p>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-md btn-gold text-base font-medium inline-flex items-center"
            >
              Cadastre-se Agora <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-virtus-darkgray py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-playfair font-bold text-virtus-gold">VIRTUS</span>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} Virtus Community. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-virtus-gold transition-colors">Termos</a>
              <a href="#" className="text-gray-400 hover:text-virtus-gold transition-colors">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-virtus-gold transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
