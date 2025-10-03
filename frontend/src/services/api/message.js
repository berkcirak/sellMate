import apiClient from './client';

export const sendMessage = async ({ userId, content }) => {
  const res = await apiClient.post('/messages/send', { userId, content });
  return res.data?.data;
};

export const getMessagesByConversation = async (conversationId) => {
  const res = await apiClient.get(`/messages/${conversationId}`);
  return res.data?.data ?? [];
};