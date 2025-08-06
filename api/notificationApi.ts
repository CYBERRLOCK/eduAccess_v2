import supabase from '../supabase';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  isRead: boolean;
  created_at?: string;
}

// Create a new notification
export const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        title: notification.title,
        description: notification.description,
        timestamp: notification.timestamp,
        type: notification.type,
        is_read: notification.isRead,
      });

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

// Fetch all notifications
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data?.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      timestamp: item.timestamp,
      type: item.type,
      isRead: item.is_read,
      created_at: item.created_at,
    })) || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

// Create a notice published notification
export const createNoticePublishedNotification = async (noticeTitle: string): Promise<boolean> => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const notification: Omit<Notification, 'id' | 'created_at'> = {
    title: 'New Faculty Notice Published',
    description: `A new notice "${noticeTitle}" has been published.`,
    timestamp: currentDate,
    type: 'info',
    isRead: false,
  };

  return await createNotification(notification);
}; 