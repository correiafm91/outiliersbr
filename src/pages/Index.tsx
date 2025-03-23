
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
                <span className="text-sm font-medium text-outliers-blue">Professional Networking</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Connect with <span className="text-outliers-blue text-shadow-blue">Outliers</span> Network
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Join the exclusive business networking platform for professionals seeking meaningful connections and growth opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  to="/register" 
                  className="px-8 py-4 rounded-md btn-blue text-base font-medium"
                >
                  Join Outliers <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 rounded-md border border-outliers-blue/50 text-outliers-blue bg-transparent hover:bg-outliers-blue/10 transition-colors text-base font-medium flex items-center justify-center"
                >
                  Sign In
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
                      <h3 className="text-2xl font-bold text-outliers-blue mb-4">Business Networking</h3>
                      <p className="text-gray-300 mb-6">Exclusive content, networking events, and professional connections.</p>
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
              What we offer for <span className="text-outliers-blue">you</span>
            </h2>
            <p className="text-gray-300">
              Our network is built to connect professionals and offer exclusive opportunities for business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={48} className="text-outliers-blue" />,
                title: "Expert Network",
                description: "Connect with industry leaders and professionals who share your business goals."
              },
              {
                icon: <BarChart2 size={48} className="text-outliers-blue" />,
                title: "Growth Insights",
                description: "Access valuable market insights and business analytics to drive your success."
              },
              {
                icon: <BookOpen size={48} className="text-outliers-blue" />,
                title: "Industry Knowledge",
                description: "Learn from experts through exclusive content and professional resources."
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
              Ready to grow your <span className="text-outliers-blue">network</span>?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Join our professional community today and access exclusive networking opportunities, industry insights, and more.
            </p>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-md btn-blue text-base font-medium inline-flex items-center"
            >
              Sign Up Now <ArrowRight size={18} className="ml-2" />
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
              <p className="text-gray-400 mt-2">© {new Date().getFullYear()} Outliers Network. All rights reserved.</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-gray-400 hover:text-outliers-blue transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-outliers-blue transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-outliers-blue transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
