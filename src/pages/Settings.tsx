
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Bell, Shield, Eye } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import Navbar from '@/components/Navbar';

const formSchema = z.object({
  emailNotifications: z.boolean(),
  contentNotifications: z.boolean(),
  privacyMode: z.boolean(),
});

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: true,
      contentNotifications: true,
      privacyMode: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Here we would normally save these settings to Supabase
      // For now we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Email enviado para redefinição de senha');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.message || 'Erro ao solicitar redefinição de senha');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-virtus-offwhite mb-2">Configurações</h1>
            <p className="text-gray-400">Gerencie suas preferências e segurança na VIRTUS Community</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-virtus-offwhite mb-4 flex items-center">
                    <Bell size={20} className="mr-2 text-virtus-gold" />
                    Notificações
                  </h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-virtus-offwhite">Notificações por e-mail</FormLabel>
                            <FormDescription className="text-gray-400">
                              Receba notificações por e-mail sobre novos conteúdos e eventos
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-virtus-offwhite">Notificações de conteúdo</FormLabel>
                            <FormDescription className="text-gray-400">
                              Receba alertas quando novos artigos ou vídeos forem publicados
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-virtus-offwhite mb-4 flex items-center">
                    <Eye size={20} className="mr-2 text-virtus-gold" />
                    Privacidade
                  </h2>
                  
                  <FormField
                    control={form.control}
                    name="privacyMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-virtus-offwhite">Modo de privacidade</FormLabel>
                          <FormDescription className="text-gray-400">
                            Oculte suas interações (likes, comentários) de outros usuários
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-virtus-offwhite mb-4 flex items-center">
                    <Shield size={20} className="mr-2 text-virtus-gold" />
                    Segurança
                  </h2>
                  
                  <div className="rounded-lg border border-gray-700 p-4">
                    <h3 className="text-virtus-offwhite font-medium mb-2">Alteração de senha</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Enviaremos um e-mail para {user.email} com instruções para redefinir sua senha.
                    </p>
                    
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={loading}
                      className="px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold hover:bg-virtus-gold/10 transition-colors text-sm font-medium"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="inline-block animate-spin mr-2" />
                          Processando...
                        </>
                      ) : 'Redefinir senha'}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-md btn-gold text-base font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="inline-block animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : 'Salvar configurações'}
                  </button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <h2 className="text-xl font-bold text-virtus-offwhite mb-4">Zona de Perigo</h2>
            
            <div className="border border-red-500/30 rounded-lg p-4 bg-red-900/10">
              <h3 className="text-red-400 font-medium mb-2">Excluir conta</h3>
              <p className="text-gray-400 text-sm mb-4">
                Esta ação é permanente e irá remover todos os seus dados, conteúdos e interações da plataforma.
              </p>
              
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-red-700/30 text-red-400 hover:bg-red-700/50 transition-colors text-sm font-medium"
              >
                Excluir minha conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
