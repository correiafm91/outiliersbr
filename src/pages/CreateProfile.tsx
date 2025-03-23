
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, ArrowRight, Loader2, Check } from 'lucide-react';
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

const CreateProfile = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState(false);

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
    
    // Pre-fill form with user data if available
    if (user.email) {
      form.setValue('email', user.email);
    }
  }, [user, navigate, form]);

  // Check for verified status when owner name changes
  const watchOwnerName = form.watch('ownerName');
  
  useEffect(() => {
    setIsVerified(watchOwnerName === 'Outliersofc');
  }, [watchOwnerName]);

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
      setCurrentImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setCurrentImage(null);
    setCropMode(false);
  };

  const toggleCropMode = () => {
    setCropMode(!cropMode);
  };

  const handleImageAdjust = (adjustment: 'contrast' | 'brightness') => {
    // Simple image adjustment simulation
    // In a real app, you would use a library like react-image-crop
    toast.info(`Ajuste de ${adjustment === 'contrast' ? 'contraste' : 'brilho'} aplicado`);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      let photoUrl = null;
      
      // Upload photo if selected
      if (photoFile) {
        const fileName = `profile-${user.id}-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('outliers')
          .upload(`profiles/${fileName}`, photoFile);
        
        if (uploadError) throw uploadError;
        
        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('outliers')
            .getPublicUrl(`profiles/${fileName}`);
          
          photoUrl = urlData.publicUrl;
        }
      }
      
      // Create profile
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          business_name: values.businessName,
          owner_name: values.ownerName,
          email: values.email,
          bio: values.bio || null,
          photo_url: photoUrl,
        });
      
      if (error) throw error;
      
      // Refresh profile data in context
      await refreshProfile();
      
      toast.success('Perfil criado com sucesso!');
      navigate('/home');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || 'Erro ao criar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Complete seu perfil</h1>
            <p className="text-gray-400">Configure seu perfil para começar sua jornada na comunidade Outliers</p>
          </div>
          
          <div className="glass-panel rounded-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white">
                        Nome do seu negócio <span className="text-outliers-blue">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input-dark"
                          placeholder="Ex: Outliers Empreendimentos"
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
                      <FormLabel className="text-white">
                        Seu nome <span className="text-outliers-blue">*</span>
                      </FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input
                            {...field}
                            className="input-dark"
                            placeholder="Seu nome completo"
                          />
                        </FormControl>
                        {isVerified && (
                          <div className="ml-2 flex-shrink-0 bg-outliers-blue rounded-full p-1" title="Perfil Verificado">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white">
                        E-mail profissional <span className="text-outliers-blue">*</span>
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

                <div className="space-y-4">
                  <FormLabel className="block text-sm font-medium text-white">
                    Foto de perfil
                  </FormLabel>
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      {photoPreview ? (
                        <div className="relative">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-2 border-outliers-blue"
                          />
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="absolute -top-2 -right-2 bg-outliers-dark rounded-full p-1 text-red-500 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-outliers-gray border-2 border-dashed border-gray-500 flex items-center justify-center">
                          <Upload size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      <label 
                        htmlFor="photo-upload" 
                        className="px-4 py-2 rounded-md border border-outliers-blue/50 text-outliers-blue bg-transparent hover:bg-outliers-blue/10 transition-colors text-sm font-medium cursor-pointer flex items-center"
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
                      
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={toggleCropMode}
                          className="px-4 py-2 rounded-md border border-outliers-blue/50 text-outliers-blue bg-transparent hover:bg-outliers-blue/10 transition-colors text-sm font-medium"
                        >
                          {cropMode ? 'Aplicar corte' : 'Cortar imagem'}
                        </button>
                      )}
                    </div>
                    
                    {photoPreview && cropMode && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-white">Ajustes de imagem</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleImageAdjust('contrast')}
                            className="px-4 py-2 rounded-md bg-outliers-gray/70 text-white text-sm"
                          >
                            + Contraste
                          </button>
                          <button
                            type="button"
                            onClick={() => handleImageAdjust('brightness')}
                            className="px-4 py-2 rounded-md bg-outliers-gray/70 text-white text-sm"
                          >
                            + Brilho
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      A foto deve ter no máximo 5MB (Opcional)
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-white">
                        Sobre você e seu negócio (opcional)
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-outliers-blue/50"
                          placeholder="Conte um pouco sobre você e seu negócio..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-md btn-blue text-base font-medium flex items-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Concluir
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

export default CreateProfile;
