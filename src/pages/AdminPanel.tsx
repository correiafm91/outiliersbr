
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import AdminHeader from '../components/admin/AdminHeader';
import ContentTabs from '../components/admin/ContentTabs';
import ContentTable from '../components/admin/ContentTable';
import CreateContentModal from '../components/admin/CreateContentModal';
import DeleteConfirmationModal from '../components/admin/DeleteConfirmationModal';
import { useAdminContent } from '../hooks/useAdminContent';

const AdminPanel = () => {
  const {
    isAdmin,
    loading,
    content,
    activeTab,
    showCreateModal,
    showDeleteModal,
    setActiveTab,
    handleCreateContent,
    handleCloseCreateModal,
    handleSaveContent,
    handleDeleteContent,
    handleShowDeleteModal,
    handleCloseDeleteModal,
    handleTogglePublish,
    handleEditContent,
    formatDate
  } = useAdminContent();

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-virtus-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-virtus-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-virtus-black">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <AdminHeader onCreateContent={handleCreateContent} />
          <ContentTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <ContentTable 
            content={content} 
            onTogglePublish={handleTogglePublish}
            onEdit={handleEditContent}
            onDelete={handleShowDeleteModal}
            formatDate={formatDate}
          />
        </div>
      </div>
      
      {/* Modals */}
      <CreateContentModal 
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSave={handleSaveContent}
      />
      
      <DeleteConfirmationModal 
        isOpen={!!showDeleteModal}
        contentId={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteContent}
      />
    </div>
  );
};

export default AdminPanel;
