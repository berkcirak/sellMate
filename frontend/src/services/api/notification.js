import apiClient from './client';

export const getNotifications = async () => {
  const res = await apiClient.get('/notifications');
  return res.data?.data || [];
};

export const getUnreadCount = async () => {
  const res = await apiClient.get('/notifications/unread-count');
  return res.data?.data || 0;
};

export const markAsRead = async (notificationId) => {
  const res = await apiClient.patch(`/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await apiClient.patch('/notifications/read-all');
  return res.data;
};