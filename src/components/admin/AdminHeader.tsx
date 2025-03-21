
import { PlusCircle } from 'lucide-react';

interface AdminHeaderProps {
  onCreateContent: () => void;
}

const AdminHeader = ({ onCreateContent }: AdminHeaderProps) => {
  return (
    <div className="glass-panel rounded-xl p-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-virtus-offwhite mb-2">
            Painel <span className="text-virtus-gold">Administrativo</span>
          </h1>
          <p className="text-gray-300">
            Gerencie os conteúdos da comunidade VIRTUS de Retórica de Marcas
          </p>
        </div>
        
        <button
          onClick={onCreateContent}
          className="mt-4 md:mt-0 px-6 py-3 rounded-md btn-gold text-base font-medium flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          Novo Conteúdo
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
