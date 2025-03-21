
interface ContentTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ContentTabs = ({ activeTab, setActiveTab }: ContentTabsProps) => {
  return (
    <div className="mb-8">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeTab === 'all' 
              ? 'bg-virtus-gold text-virtus-black' 
              : 'bg-virtus-darkgray text-gray-300 hover:bg-virtus-darkgray/70'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeTab === 'published' 
              ? 'bg-virtus-gold text-virtus-black' 
              : 'bg-virtus-darkgray text-gray-300 hover:bg-virtus-darkgray/70'
          }`}
        >
          Publicados
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeTab === 'drafts' 
              ? 'bg-virtus-gold text-virtus-black' 
              : 'bg-virtus-darkgray text-gray-300 hover:bg-virtus-darkgray/70'
          }`}
        >
          Rascunhos
        </button>
      </div>
    </div>
  );
};

export default ContentTabs;
