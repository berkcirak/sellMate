import apiClient from './client';

export const createComment = async ({ postId, content }) => {
  const res = await apiClient.post('/comment', { postId, content });
  return res.data?.data;
};

export const getCommentsByPost = async (postId) => {
  const res = await apiClient.get(`/comment/post/${postId}`);
  return res.data?.data ?? [];
};