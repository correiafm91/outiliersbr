
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Navbar from '@/components/Navbar';

const formSchema = z.object({
  businessName: z.string().min(1, 'Nome do negócio é obrigatório'),
  ownerName: z.string().min(1, 'Seu nome é obrigatório'),
  email: z.string().email('Email inválido'),
  bio: z.string().optional(),
});

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      ownerName: '',
      email: '',
      bio: '',
    },
  });

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Check if profile exists
    if (!profile) {
      navigate('/create-profile');
      return;
    }
    
    // Pre-fill form with profile data
    form.reset({
      businessName: profile.business_name,
      ownerName: profile.owner_name,
      email: profile.email,
      bio: profile.bio || '',
    });
    
    // Load photo if exists
    if (profile.photo_url) {
      setPhotoPreview(profile.photo_url);
    }
  }, [user, profile, navigate, form]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter menos de 5MB");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error("O arquivo deve ser uma imagem");
      return;
    }
    
    setPhotoFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      let photoUrl = profile?.photo_url;
      
      // Upload new photo if changed
      if (photoFile) {
        const fileName = `profile-${user.id}-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('virtus')
          .upload(`profiles/${fileName}`, photoFile);
        
        if (uploadError) throw uploadError;
        
        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('virtus')
            .getPublicUrl(`profiles/${fileName}`);
          
          photoUrl = urlData.publicUrl;
        }
      } else if (photoPreview === null && profile?.photo_url) {
        // If user removed photo
        photoUrl = null;
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: values.businessName,
          owner_name: values.ownerName,
          email: values.email,
          bio: values.bio || null,
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data in context
      await refreshProfile();
      
      toast.success('Perfil atualizado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-virtus-offwhite mb-2">Editar Perfil</h1>
            <p className="text-gray-400">Atualize as informações do seu perfil na VIRTUS Community</p>
          </div>
          
          <div className="glass-panel rounded-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormLabel className="block text-sm font-medium text-virtus-offwhite">
                    Foto de perfil
                  </FormLabel>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {photoPreview ? (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-2 border-virtus-gold"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-virtus-darkgray rounded-full p-1 text-red-500 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-virtus-darkgray border-2 border-dashed border-gray-500 flex items-center justify-center">
                          <Upload size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <label 
                      htmlFor="photo-upload" 
                      className="px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-sm font-medium cursor-pointer flex items-center"
                    >
                      <Upload size={16} className="mr-2" />
                      {photoPreview ? 'Alterar foto' : 'Escolher foto'}
                    </label>
                    <input 
                      id="photo-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      A foto deve ter no máximo 5MB (Opcional)
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Nome do seu negócio <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input-dark"
                          placeholder="Ex: Virtus Empreendimentos"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Seu nome <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input-dark"
                          placeholder="Seu nome completo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        E-mail profissional <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="input-dark"
                          placeholder="seu@empresa.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Sobre você e seu negócio (opcional)
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                          placeholder="Conte um pouco sobre você e seu negócio..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/home')}
                    className="px-6 py-3 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-base font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-md btn-gold text-base font-medium flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Salvar Alterações
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
