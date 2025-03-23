
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Image, Video, Upload, X, Loader2, Upload as UploadIcon, Hash, ArrowRight, Globe, Users, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  title: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  type: z.enum(['article', 'video', 'live']),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  scheduled: z.boolean().default(false),
  scheduledDate: z.string().optional(),
});

const CreateContent = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'article',
      tags: [],
      published: false,
      isPublic: true,
      scheduled: false,
      scheduledDate: '',
    },
  });

  const contentType = form.watch('type');
  const isScheduled = form.watch('scheduled');
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    if (!profile) {
      navigate('/create-profile');
    }
  }, [user, profile, navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMediaFiles(e.dataTransfer.files);
    }
  };

  const handleMediaFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValid = isImage || isVideo;
      
      if (!isValid) {
        toast.error(`Arquivo não suportado: ${file.name}`);
      }
      
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`Arquivo muito grande: ${file.name} (máximo 50MB)`);
        return false;
      }
      
      return isValid;
    });
    
    if (validFiles.length === 0) return;
    
    setMediaFiles(prev => [...prev, ...validFiles]);
    
    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setMediaPreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (!currentTag.trim()) return;
    
    const formattedTag = currentTag.trim().startsWith('#') 
      ? currentTag.trim() 
      : `#${currentTag.trim()}`;
    
    const currentTags = form.getValues('tags') || [];
    
    if (!currentTags.includes(formattedTag)) {
      form.setValue('tags', [...currentTags, formattedTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const mediaUrls: string[] = [];
      
      // Upload media files
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const fileName = `content-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const fileExt = file.name.split('.').pop();
          const filePath = `content/${fileName}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('outliers')
            .upload(filePath, file);
          
          if (uploadError) throw uploadError;
          
          const { data: urlData } = supabase.storage
            .from('outliers')
            .getPublicUrl(filePath);
          
          mediaUrls.push(urlData.publicUrl);
        }
      }
      
      // Determine thumbnail if available
      const thumbnailUrl = mediaFiles.length > 0 && mediaFiles[0].type.startsWith('image/') 
        ? mediaUrls[0] 
        : null;
      
      // Determine video URL if available
      const videoUrl = mediaFiles.length > 0 && mediaFiles[0].type.startsWith('video/') 
        ? mediaUrls[0] 
        : null;
      
      const contentData = {
        author_id: user.id,
        title: values.title,
        content: values.content,
        type: values.type,
        published: values.published,
        scheduled_for: values.scheduled && values.scheduledDate ? new Date(values.scheduledDate).toISOString() : null,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        // Store media URLs and privacy setting in the content JSON
        media_urls: mediaUrls,
        is_public: values.isPublic,
        tags: values.tags || [],
      };
      
      const { error } = await supabase
        .from('content')
        .insert(contentData);
      
      if (error) throw error;
      
      toast.success('Conteúdo criado com sucesso!');
      navigate('/content');
    } catch (error: any) {
      console.error('Error creating content:', error);
      toast.error(error.message || 'Erro ao criar conteúdo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-outliers-dark">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Criar Conteúdo</h1>
            <p className="text-gray-400">Compartilhe conteúdo com a comunidade Outliers</p>
          </div>
          
          <div className="glass-panel rounded-xl p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-10 w-10 border border-outliers-blue/30">
                    <AvatarImage src={profile?.photo_url || ''} />
                    <AvatarFallback className="bg-outliers-gray text-white">
                      {profile?.owner_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="text-white font-medium flex items-center">
                      {profile?.owner_name || user?.email}
                      {profile?.owner_name === 'Outliersofc' && (
                        <div className="ml-1 flex-shrink-0 bg-outliers-blue rounded-full p-0.5" title="Perfil Verificado">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Globe className="h-3 w-3 mr-1" />
                        <span>Público</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <div className="text-gray-400">{new Date().toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => form.setValue('type', 'article')}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                        contentType === 'article' 
                          ? 'bg-outliers-blue text-white' 
                          : 'bg-outliers-gray text-white hover:bg-outliers-gray/70'
                      }`}
                    >
                      <Image size={16} className="mr-2" />
                      Artigo
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => form.setValue('type', 'video')}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                        contentType === 'video' 
                          ? 'bg-outliers-blue text-white' 
                          : 'bg-outliers-gray text-white hover:bg-outliers-gray/70'
                      }`}
                    >
                      <Video size={16} className="mr-2" />
                      Vídeo
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => form.setValue('type', 'live')}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                        contentType === 'live' 
                          ? 'bg-outliers-blue text-white' 
                          : 'bg-outliers-gray text-white hover:bg-outliers-gray/70'
                      }`}
                    >
                      <Video size={16} className="mr-2" />
                      Live
                    </button>
                  </div>
                
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Título <span className="text-outliers-blue">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título do seu conteúdo"
                            className="input-dark text-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Conteúdo <span className="text-outliers-blue">*</span></FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Compartilhe suas ideias, experiências ou conhecimentos..."
                            className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-outliers-blue/50 min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Mídia</label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                        dragActive 
                          ? 'border-outliers-blue bg-outliers-blue/10' 
                          : 'border-gray-600 hover:border-outliers-blue/50 hover:bg-outliers-gray/30'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <UploadIcon className="h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-300 text-center">
                          Arraste e solte arquivos aqui, ou <button
                            type="button"
                            className="text-outliers-blue hover:underline"
                            onClick={() => inputRef.current?.click()}
                          >
                            escolha arquivos
                          </button>
                        </p>
                        <p className="text-xs text-gray-500">
                          Suporta imagens e vídeos (máx. 50MB)
                        </p>
                        <input
                          ref={inputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleMediaFiles(e.target.files);
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    {mediaPreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="relative group rounded-lg overflow-hidden aspect-square">
                            {mediaFiles[index]?.type.startsWith('image/') ? (
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={preview}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Tags</label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Adicione tags (ex: networking)"
                        className="input-dark"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        className="ml-2 bg-outliers-blue hover:bg-outliers-blue/80"
                      >
                        <Hash size={16} />
                      </Button>
                    </div>
                    
                    {form.watch('tags')?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.watch('tags')?.map((tag) => (
                          <div
                            key={tag}
                            className="bg-outliers-blue/20 text-outliers-blue rounded-full px-3 py-1 text-sm flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 text-outliers-blue hover:text-white"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div>
                      <h3 className="text-white font-medium mb-2">Configurações de Publicação</h3>
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name="isPublic"
                          render={({ field }) => (
                            <div className="flex items-center justify-between p-3 rounded-md bg-outliers-gray/50">
                              <div className="flex items-center space-x-2">
                                <Globe size={18} className="text-gray-400" />
                                <div>
                                  <p className="text-white text-sm font-medium">Visibilidade Pública</p>
                                  <p className="text-gray-400 text-xs">Todos podem ver este conteúdo</p>
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="published"
                          render={({ field }) => (
                            <div className="flex items-center justify-between p-3 rounded-md bg-outliers-gray/50">
                              <div className="flex items-center space-x-2">
                                <Users size={18} className="text-gray-400" />
                                <div>
                                  <p className="text-white text-sm font-medium">Publicar agora</p>
                                  <p className="text-gray-400 text-xs">Publicar imediatamente ou salvar como rascunho</p>
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="scheduled"
                          render={({ field }) => (
                            <div className="flex items-center justify-between p-3 rounded-md bg-outliers-gray/50">
                              <div className="flex items-center space-x-2">
                                <Clock size={18} className="text-gray-400" />
                                <div>
                                  <p className="text-white text-sm font-medium">Agendar publicação</p>
                                  <p className="text-gray-400 text-xs">Escolha uma data para publicação automática</p>
                                </div>
                              </div>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                        
                        {isScheduled && (
                          <FormField
                            control={form.control}
                            name="scheduledDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="datetime-local"
                                    className="input-dark"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/content')}
                    className="border-gray-600 text-white hover:bg-outliers-gray/50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-outliers-blue hover:bg-outliers-blue/80"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Criar Conteúdo
                        <ArrowRight size={18} className="ml-2" />
                      </>
                    )}
                  </Button>
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
