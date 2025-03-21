
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, Save, ArrowLeft, Loader2 } from 'lucide-react';
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from '@/components/Navbar';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  type: z.enum(['article', 'video', 'live']),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  scheduledFor: z.string().optional(),
  published: z.boolean().default(false),
});

const CreateContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'article',
      content: '',
      videoUrl: '',
      scheduledFor: '',
      published: false,
    },
  });

  const contentType = form.watch('type');

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setThumbnailFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailFile(null);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    try {
      // Validate based on content type
      if (values.type === 'article' && !values.content) {
        toast.error("O conteúdo do artigo é obrigatório");
        setLoading(false);
        return;
      }
      
      if ((values.type === 'video' || values.type === 'live') && !thumbnailFile) {
        toast.error("A miniatura é obrigatória para vídeos e lives");
        setLoading(false);
        return;
      }
      
      if (values.type === 'live' && !values.scheduledFor) {
        toast.error("A data da live é obrigatória");
        setLoading(false);
        return;
      }
      
      let thumbnailUrl = null;
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const fileName = `content-${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('virtus')
          .upload(`content/${fileName}`, thumbnailFile);
        
        if (uploadError) throw uploadError;
        
        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('virtus')
            .getPublicUrl(`content/${fileName}`);
          
          thumbnailUrl = urlData.publicUrl;
        }
      }
      
      // Create content
      const { data, error } = await supabase
        .from('content')
        .insert({
          author_id: user.id,
          title: values.title,
          type: values.type,
          content: values.content || null,
          video_url: values.videoUrl || null,
          thumbnail_url: thumbnailUrl,
          scheduled_for: values.type === 'live' ? values.scheduledFor : null,
          published: values.published,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success(`Conteúdo ${values.published ? 'publicado' : 'salvo como rascunho'} com sucesso!`);
      navigate('/content');
    } catch (error: any) {
      console.error('Error creating content:', error);
      toast.error(error.message || 'Erro ao criar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <button
              onClick={() => navigate('/content')}
              className="flex items-center text-gray-400 hover:text-virtus-gold mb-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              Voltar para Meus Conteúdos
            </button>
            <h1 className="text-3xl font-bold text-virtus-offwhite mb-2">Criar Novo Conteúdo</h1>
            <p className="text-gray-400">
              Compartilhe seu conhecimento sobre Retórica de Marcas com a comunidade VIRTUS
            </p>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Título <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input-dark"
                          placeholder="Digite o título do seu conteúdo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Tipo de Conteúdo <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="input-dark">
                            <SelectValue placeholder="Selecione o tipo de conteúdo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-virtus-darkgray border border-gray-700 text-virtus-offwhite">
                          <SelectItem value="article">Artigo</SelectItem>
                          <SelectItem value="video">Vídeo</SelectItem>
                          <SelectItem value="live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {contentType === 'article' && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-virtus-offwhite">
                          Conteúdo <span className="text-virtus-gold">*</span>
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            rows={10}
                            className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                            placeholder="Escreva o conteúdo do seu artigo aqui..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {contentType === 'video' && (
                  <>
                    <FormField
                      control={form.control}
                      name="videoUrl"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-virtus-offwhite">
                            URL do Vídeo <span className="text-virtus-gold">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="input-dark"
                              placeholder="https://exemplo.com/seu-video"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Cole o link do seu vídeo do YouTube, Vimeo ou outra plataforma
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Miniatura do Vídeo <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img
                              src={thumbnailPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-red-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Upload size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-400 text-sm mb-4">Clique para fazer upload da miniatura</p>
                            <label 
                              htmlFor="thumbnail-upload" 
                              className="px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-sm font-medium cursor-pointer"
                            >
                              Escolher Imagem
                            </label>
                          </div>
                        )}
                        <input 
                          id="thumbnail-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleThumbnailUpload} 
                          className="hidden" 
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {contentType === 'live' && (
                  <>
                    <FormField
                      control={form.control}
                      name="scheduledFor"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-virtus-offwhite">
                            Data e Hora da Live <span className="text-virtus-gold">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="datetime-local"
                              className="input-dark"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel className="text-virtus-offwhite">
                        Miniatura da Live <span className="text-virtus-gold">*</span>
                      </FormLabel>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img
                              src={thumbnailPreview}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={removeThumbnail}
                              className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-red-500 hover:text-red-400"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8">
                            <Upload size={32} className="text-gray-400 mb-2" />
                            <p className="text-gray-400 text-sm mb-4">Clique para fazer upload da miniatura</p>
                            <label 
                              htmlFor="thumbnail-upload" 
                              className="px-4 py-2 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-sm font-medium cursor-pointer"
                            >
                              Escolher Imagem
                            </label>
                          </div>
                        )}
                        <input 
                          id="thumbnail-upload" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleThumbnailUpload} 
                          className="hidden" 
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-700 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-virtus-offwhite">Publicar imediatamente</FormLabel>
                        <FormDescription className="text-gray-400">
                          Se desativado, o conteúdo será salvo como rascunho
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
                
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => navigate('/content')}
                    className="px-6 py-3 rounded-md border border-gray-600 text-gray-300 hover:bg-virtus-darkgray transition-colors"
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
                        Processando...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Salvar
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

export default CreateContent;
