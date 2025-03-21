
import { FileText, Video, PlayCircle, Edit, Trash2 } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  content?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  scheduledFor?: string;
  createdAt: string;
  published: boolean;
}

interface ContentTableProps {
  content: ContentItem[];
  onTogglePublish: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const ContentTable = ({ 
  content, 
  onTogglePublish, 
  onEdit, 
  onDelete,
  formatDate 
}: ContentTableProps) => {
  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-virtus-darkgray/70">
              <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Título</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Tipo</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Data</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-virtus-gold">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-virtus-gold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {content.length > 0 ? (
              content.map((item) => (
                <tr key={item.id} className="animate-fade-in hover:bg-virtus-darkgray/40 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 mr-3">
                        {(item.type === 'video' || item.type === 'live') && item.thumbnailUrl ? (
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded flex items-center justify-center ${
                            item.type === 'article' 
                              ? 'bg-blue-500/20' 
                              : item.type === 'video' 
                                ? 'bg-purple-500/20' 
                                : 'bg-red-500/20'
                          }`}>
                            {item.type === 'article' ? (
                              <FileText size={20} className="text-blue-400" />
                            ) : item.type === 'video' ? (
                              <Video size={20} className="text-purple-400" />
                            ) : (
                              <PlayCircle size={20} className="text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-virtus-offwhite">
                        {item.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.type === 'article' ? 'Artigo' : item.type === 'video' ? 'Vídeo' : 'Live'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.published 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {item.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        onClick={() => onTogglePublish(item.id)}
                        className={`p-1.5 rounded-md ${
                          item.published 
                            ? 'bg-gray-600/30 text-gray-300 hover:bg-gray-600/50' 
                            : 'bg-green-600/30 text-green-300 hover:bg-green-600/50'
                        }`}
                      >
                        {item.published ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => onEdit(item.id)}
                        className="p-1.5 rounded-md bg-blue-600/30 text-blue-300 hover:bg-blue-600/50"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-md bg-red-600/30 text-red-300 hover:bg-red-600/50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Nenhum conteúdo encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentTable;
