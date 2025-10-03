import apiClient from './client';

export const getMyConversations = async () => {
  const res = await apiClient.get('/conversation/list');
  return res.data?.data ?? [];
};

export const getConversationById = async (conversationId) => {
  const res = await apiClient.get(`/conversation/${conversationId}`);
  return res.data?.data;
};