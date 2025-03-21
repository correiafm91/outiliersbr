
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
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
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const Login = () => {
  const { signIn, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await signIn(values.email, values.password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-virtus-offwhite mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400">Entre na sua conta para acessar a comunidade de Retórica de Marcas</p>
          </div>
          
          <div className="glass-panel rounded-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-virtus-offwhite">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="seu@email.com" 
                          className="input-dark transition-all duration-300 focus:ring-2 focus:ring-virtus-gold/50" 
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
                        <FormLabel className="text-virtus-offwhite">Senha</FormLabel>
                        <Link to="/forgot-password" className="text-xs text-virtus-gold hover:underline">
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          className="input-dark transition-all duration-300 focus:ring-2 focus:ring-virtus-gold/50" 
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
                  className="w-full py-3 rounded-md btn-gold font-medium flex items-center justify-center"
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
                    <Link to="/register" className="text-virtus-gold hover:underline">
                      Cadastre-se
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>O acesso administrativo é reservado para a equipe VIRTUS.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
