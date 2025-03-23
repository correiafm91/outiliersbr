
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, ChartNetwork, BarChart2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 md:py-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div 
              className={`md:w-1/2 space-y-6 transition-all duration-700 transform 
                ${isLoaded ? 'opacity-100' : 'opacity-0 -translate-y-10'}`}
            >
              <div className="inline-block px-3 py-1 rounded-full border border-outliers-blue/30 bg-outliers-blue/10 mb-4">
                <span className="text-sm font-medium text-outliers-blue">Networking Profissional</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Conecte-se com a rede <span className="text-outliers-blue text-shadow-blue">Outliers</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Junte-se à plataforma exclusiva de networking para profissionais que buscam conexões significativas e oportunidades de crescimento.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/register" 
                  className="px-8 py-4 rounded-md btn-blue text-base font-medium"
                >
                  Junte-se à Outliers <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 rounded-md border border-outliers-blue/50 text-outliers-blue bg-transparent hover:bg-outliers-blue/10 transition-colors text-base font-medium flex items-center justify-center"
                >
                  Entrar
                </Link>
              </div>
            </div>
            <div 
              className={`md:w-1/2 mt-16 md:mt-0 transition-all duration-700 delay-300 
                ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
            >
              <div className="relative">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-outliers-blue/20 blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="glass-panel rounded-2xl overflow-hidden relative z-10 blue-glow">
                  <div className="aspect-video bg-outliers-gray flex items-center justify-center">
                    <div className="text-center p-8">
                      <h3 className="text-2xl font-bold text-outliers-blue mb-4">Networking Empresarial</h3>
                      <p className="text-gray-300 mb-6">Conteúdo exclusivo, eventos de networking e conexões profissionais.</p>
                      <button className="animate-pulse-blue w-16 h-16 rounded-full bg-outliers-blue flex items-center justify-center text-white">
                        <ChartNetwork size={32} />
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
        className={`py-20 bg-outliers-gray transition-all duration-700 delay-500 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              O que oferecemos para <span className="text-outliers-blue">você</span>
            </h2>
            <p className="text-gray-300">
              Nossa rede é construída para conectar profissionais e oferecer oportunidades exclusivas para crescimento empresarial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={48} className="text-outliers-blue" />,
                title: "Rede de Especialistas",
                description: "Conecte-se com líderes do setor e profissionais que compartilham seus objetivos de negócios."
              },
              {
                icon: <BarChart2 size={48} className="text-outliers-blue" />,
                title: "Insights de Crescimento",
                description: "Acesse insights valiosos de mercado e análises de negócios para impulsionar seu sucesso."
              },
              {
                icon: <BookOpen size={48} className="text-outliers-blue" />,
                title: "Conhecimento do Setor",
                description: "Aprenda com especialistas através de conteúdo exclusivo e recursos profissionais."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="glass-panel rounded-xl p-8 card-hover"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-outliers-blue mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className={`py-20 bg-outliers-dark transition-all duration-700 delay-700 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto px-4">
          <div className="glass-panel rounded-2xl p-10 md:p-16 text-center max-w-4xl mx-auto blue-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para expandir sua <span className="text-outliers-blue">rede</span>?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Junte-se à nossa comunidade profissional hoje e acesse oportunidades exclusivas de networking, insights do setor e muito mais.
            </p>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-md btn-blue text-base font-medium inline-flex items-center"
            >
              Cadastre-se Agora <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-outliers-gray py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-montserrat font-bold text-outliers-blue">OUTLIERS</span>
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} Outliers Network. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-outliers-blue transition-colors">Termos</a>
              <a href="#" className="text-gray-400 hover:text-outliers-blue transition-colors">Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-outliers-blue transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
