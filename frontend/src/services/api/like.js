import apiClient from './client';

export const likePost = async (postId) => {
  const res = await apiClient.post('/likes', { postId });
  return res.data?.data;
};

export const unlikePost = async (postId) => {
  const res = await apiClient.delete(`/likes/posts/${postId}`);
  return res.data?.data;
};

export const getPostLikeCount = async (postId) => {
  const res = await apiClient.get(`/likes/posts/${postId}/count`);
  return res.data?.data ?? 0;
};

export const getPostLikes = async (postId) => {
  const res = await apiClient.get(`/likes/posts/${postId}`);
  return res.data?.data ?? [];
};

export const getMyLikes = async () => {
  const res = await apiClient.get('/likes/my-likes');
  return res.data?.data ?? [];
};

export const getUserLikes = async (userId) => {
  const res = await apiClient.get(`/${userId}`);
  return res.data?.data ?? [];
};