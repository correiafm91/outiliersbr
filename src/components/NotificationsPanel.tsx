
import { useState, useEffect } from 'react';
import { Bell, X, Settings, Heart, MessageSquare, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatLocalDateTime } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Notification = {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  content: string;
  sender_id?: string;
  sender_name?: string;
  sender_photo?: string;
  content_id?: string;
  created_at: string;
  read: boolean;
};

const NotificationsPanel = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        // In a real app, we would fetch from the notifications table
        // For now, we'll create mock notifications
        const mockNotifications: Notification[] = [
          {
            id: '1',
            user_id: user.id,
            type: 'like',
            content: 'curtiu seu post "Estratégias de Networking Empresarial"',
            sender_id: 'user-2',
            sender_name: 'Outliersofc',
            sender_photo: 'https://i.postimg.cc/YSzyP9rT/High-resolution-stock-photo-A-professional-commercial-image-showcasing-a-grey-letter-O-logo-agains.jpg',
            content_id: 'content-1',
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            read: false
          },
          {
            id: '2',
            user_id: user.id,
            type: 'comment',
            content: 'comentou em seu post "Como fazer networking efetivo"',
            sender_id: 'user-3',
            sender_name: 'Maria Silva',
            sender_photo: '',
            content_id: 'content-2',
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
            read: false
          },
          {
            id: '3',
            user_id: user.id,
            type: 'follow',
            content: 'começou a seguir você',
            sender_id: 'user-4',
            sender_name: 'João Martins',
            sender_photo: '',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            read: true
          },
          {
            id: '4',
            user_id: user.id,
            type: 'system',
            content: 'Bem-vindo à Outliers! Complete seu perfil para começar a fazer networking.',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            read: true
          }
        ];

        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up real-time listener for new notifications
    // This would be implemented with Supabase Realtime in a production app
    const channel = supabase
      .channel('notification-changes')
      .on('broadcast', { event: 'new-notification' }, (payload) => {
        // Add the new notification to the list
        setNotifications(prev => [payload.payload as Notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const togglePanel = () => {
    setIsOpen(!isOpen);

    // Mark notifications as read when opening the panel
    if (!isOpen && unreadCount > 0) {
      // In a real app, we would update the database
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-400" />;
      case 'comment':
        return <MessageSquare size={16} className="text-green-400" />;
      case 'follow':
        return <UserPlus size={16} className="text-blue-400" />;
      default:
        return <Bell size={16} className="text-yellow-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="relative text-gray-300 hover:text-outliers-blue transition-colors"
        aria-label="Notificações"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-outliers-gray border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium">Notificações</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                className="text-xs text-outliers-blue hover:underline"
              >
                Marcar tudo como lido
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin h-5 w-5 border-2 border-outliers-blue border-t-transparent rounded-full"></div>
              </div>
            ) : notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-700 hover:bg-outliers-gray/70 transition-colors ${
                      !notification.read ? 'bg-outliers-blue/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {notification.sender_id ? (
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={notification.sender_photo || ''} />
                          <AvatarFallback className="bg-outliers-blue/20 text-outliers-blue">
                            {notification.sender_name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-outliers-blue/20 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white">
                          {notification.sender_name && (
                            <span className="font-medium">
                              {notification.sender_name}
                              {notification.sender_name === 'Outliersofc' && (
                                <span className="inline-flex items-center bg-outliers-blue rounded-full p-0.5 ml-1" title="Perfil Verificado">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </span>
                          )}{' '}
                          {notification.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatLocalDateTime(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400">
                Nenhuma notificação encontrada
              </div>
            )}
          </div>

          <div className="p-2 border-t border-gray-700">
            <button
              onClick={() => { /* Navigate to settings */ }}
              className="w-full text-center py-2 text-sm text-outliers-blue hover:underline flex items-center justify-center"
            >
              <Settings size={14} className="mr-1" />
              Configurar notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
