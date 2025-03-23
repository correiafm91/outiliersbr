
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const Login = () => {
  const { signIn, loading: authLoading, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setLoginError(null);
    
    try {
      // Para simplificar, vamos simular login
      if (values.email === 'teste@outliers.com' && values.password === 'senha123') {
        // Mock do login para fins de demonstração
        localStorage.setItem('outliers-user', JSON.stringify({
          id: 'user-1',
          email: values.email,
        }));
        localStorage.setItem('outliers-token', 'mock-jwt-token');
        
        window.location.href = '/home';
        return;
      }
      
      await signIn(values.email, values.password);
      // Navigate is handled in the useEffect when user state changes
    } catch (error: any) {
      setLoginError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400">Entre na sua conta para acessar a comunidade Outliers</p>
          </div>
          
          {loginError && (
            <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          
          <div className="glass-panel rounded-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          className="input-dark transition-all duration-300 focus:ring-2 focus:ring-outliers-blue/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-white">Senha</FormLabel>
                        <Link to="/forgot-password" className="text-xs text-outliers-blue hover:underline">
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="input-dark transition-all duration-300 focus:ring-2 focus:ring-outliers-blue/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <button
                  type="submit"
                  disabled={loading || authLoading}
                  className="w-full py-3 rounded-md btn-blue font-medium flex items-center justify-center"
                >
                  {loading || authLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Entrando...
                    </>
                  ) : 'Entrar'}
                </button>

                <div className="text-center pt-4">
                  <p className="text-gray-400 text-sm">
                    Ainda não tem uma conta?{' '}
                    <Link to="/register" className="text-outliers-blue hover:underline">
                      Cadastre-se
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
