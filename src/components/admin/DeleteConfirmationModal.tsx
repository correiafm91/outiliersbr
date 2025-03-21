
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  contentId: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteConfirmationModal = ({ 
  isOpen, 
  contentId, 
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) => {
  if (!isOpen || !contentId) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-panel rounded-xl w-full max-w-md animate-fade-in">
        <div className="p-6">
          <h2 className="text-xl font-bold text-virtus-offwhite mb-4">Confirmar Exclusão</h2>
          <p className="text-gray-300 mb-6">
            Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-virtus-darkgray transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(contentId)}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
