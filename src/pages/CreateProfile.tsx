
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, ArrowRight, Camera, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '../components/Navbar';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    bio: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('virtus-user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Pre-fill form with user data
    setProfile(prev => ({
      ...prev,
      ownerName: parsedUser.name || '',
      email: parsedUser.email || '',
    }));
    
    // Check if profile already exists
    const profileData = localStorage.getItem('virtus-user-profile');
    if (profileData) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const nextStep = () => {
    if (step === 1) {
      if (!profile.businessName || !profile.ownerName) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create profile object
      const profileData = {
        ...profile,
        photoUrl: photoPreview,
        userId: user.id,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      // Store profile in localStorage (temporary solution)
      localStorage.setItem('virtus-user-profile', JSON.stringify(profileData));
      
      toast.success("Perfil criado com sucesso!");
      navigate('/home');
    } catch (error) {
      console.error("Profile creation error:", error);
      toast.error("Erro ao criar perfil. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-virtus-black">
        <Loader2 size={48} className="animate-spin text-virtus-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <div className="inline-block px-3 py-1 rounded-full border border-virtus-gold/30 bg-virtus-gold/10 mb-4">
              <span className="text-sm font-medium text-virtus-gold">Etapa {step} de 2</span>
            </div>
            <h1 className="text-3xl font-bold text-virtus-offwhite mb-2">Complete seu perfil</h1>
            <p className="text-gray-400">Configure seu perfil para começar sua jornada na VIRTUS Community</p>
          </div>
          
          <div className="glass-panel rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <label htmlFor="businessName" className="block text-sm font-medium text-virtus-offwhite">
                      Nome do seu negócio <span className="text-virtus-gold">*</span>
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      value={profile.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                      placeholder="Ex: Virtus Empreendimentos"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ownerName" className="block text-sm font-medium text-virtus-offwhite">
                      Seu nome <span className="text-virtus-gold">*</span>
                    </label>
                    <input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      required
                      value={profile.ownerName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-virtus-offwhite">
                      E-mail profissional <span className="text-virtus-gold">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                      placeholder="seu@empresa.com"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 rounded-md btn-gold text-base font-medium flex items-center"
                    >
                      Próximo
                      <ArrowRight size={18} className="ml-2" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-virtus-offwhite">
                      Foto de perfil
                    </label>
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
                            <Camera size={32} className="text-gray-400" />
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

                  <div className="space-y-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-virtus-offwhite">
                      Sobre você e seu negócio (opcional)
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md input-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-virtus-gold/50"
                      placeholder="Conte um pouco sobre você e seu negócio..."
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 rounded-md border border-virtus-gold/50 text-virtus-gold bg-transparent hover:bg-virtus-gold/10 transition-colors text-base font-medium"
                    >
                      Voltar
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
                          Concluir
                          <ArrowRight size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
