
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Bell, Shield, Eye, Smartphone, Lock } from 'lucide-react';
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
  followNotifications: z.boolean(),
  commentNotifications: z.boolean(),
  messageNotifications: z.boolean(),
  privateProfile: z.boolean(),
  twoFactorAuth: z.boolean(),
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
      followNotifications: true,
      commentNotifications: true,
      messageNotifications: true,
      privateProfile: false,
      twoFactorAuth: false,
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
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
            <p className="text-gray-400">Gerencie suas preferências e segurança na comunidade Outliers</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6 mb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Bell size={20} className="mr-2 text-outliers-blue" />
                    Notificações
                  </h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Notificações por e-mail</FormLabel>
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
                            <FormLabel className="text-white">Notificações de conteúdo</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="followNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Notificações de novos seguidores</FormLabel>
                            <FormDescription className="text-gray-400">
                              Receba alertas quando alguém começar a seguir você
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
                      name="commentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Notificações de comentários</FormLabel>
                            <FormDescription className="text-gray-400">
                              Receba alertas quando alguém comentar em seu conteúdo
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
                      name="messageNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Notificações de mensagens</FormLabel>
                            <FormDescription className="text-gray-400">
                              Receba alertas quando receber novas mensagens
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
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Eye size={20} className="mr-2 text-outliers-blue" />
                    Privacidade
                  </h2>
                  
                  <FormField
                    control={form.control}
                    name="privateProfile"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-white">Perfil privado</FormLabel>
                          <FormDescription className="text-gray-400">
                            Apenas conexões aprovadas podem ver seu conteúdo e interações
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
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Shield size={20} className="mr-2 text-outliers-blue" />
                    Segurança
                  </h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-white">Autenticação de dois fatores (2FA)</FormLabel>
                            <FormDescription className="text-gray-400">
                              Adicione uma camada extra de segurança à sua conta
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
                    
                    <div className="rounded-lg border border-gray-700 p-4">
                      <h3 className="text-white font-medium mb-2">Alteração de senha</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Enviaremos um e-mail para {user.email} com instruções para redefinir sua senha.
                      </p>
                      
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={loading}
                        className="px-4 py-2 rounded-md border border-outliers-blue/50 text-outliers-blue hover:bg-outliers-blue/10 transition-colors text-sm font-medium"
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
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Smartphone size={20} className="mr-2 text-outliers-blue" />
                    Preferências do Aplicativo
                  </h2>
                  
                  <div className="rounded-lg border border-gray-700 p-4">
                    <h3 className="text-white font-medium mb-2">Fuso Horário</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Seu fuso horário atual: <span className="text-white">São Paulo, Brasil (GMT-3)</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      Todas as datas e horários são exibidos conforme o fuso horário de São Paulo.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-md bg-outliers-blue text-white hover:bg-outliers-blue/80 transition-colors font-medium"
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
            <h2 className="text-xl font-bold text-white mb-4">Zona de Perigo</h2>
            
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
