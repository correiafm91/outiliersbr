
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage (temporary solution)
      localStorage.setItem('outliers-user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        id: Date.now().toString(),
      }));
      localStorage.setItem('outliers-token', 'mock-jwt-token');
      
      toast.success("Registro concluído com sucesso!");
      navigate('/create-profile');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro ao registrar. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-outliers-blue hover:underline mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao início
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
            <p className="text-gray-400">Entre para a comunidade Outliers e transforme seu networking</p>
          </div>
          
          <div className="glass-panel rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Nome completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-outliers-blue/50"
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-outliers-blue/50"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-outliers-blue/50"
                    placeholder="Crie uma senha"
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-outliers-blue"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                  Confirme sua senha
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-outliers-blue/50"
                    placeholder="Confirme sua senha"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-md btn-blue text-base font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    Criar conta
                    <CheckCircle size={18} className="ml-2" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-outliers-blue hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
