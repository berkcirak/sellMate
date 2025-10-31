import apiClient from './client';

export const fetchFeed = async ({ page = 0, size = 20 } = {}) => {
  const res = await apiClient.get('/posts/feed', { params: { page, size } });
  return res.data?.data ?? [];
};

export const createPost = async (formData) => {
 const res = await apiClient.post('/posts', formData, {
   headers: {
     'Content-Type': 'multipart/form-data',
   },
 });
 return res.data?.data;
};
export const searchPosts = async (q) =>
  apiClient.get(`/posts/search`, { params: { q } }).then(r => r.data?.data);

export const getPostsByUser = async (userId) => {
  const res = await apiClient.get(`/posts/user/${userId}`);
  return res.data?.data ?? [];
}
export const getPost = async (postId) => {
  const res = await apiClient.get(`/posts/${postId}`);
  return res.data?.data;
};
export const getPostByCommentId = async (commentId) => {
  const res = await apiClient.get(`/posts/bycomment/${commentId}`);
  return res.data?.data;
};

export const updatePost = async (postId, payload) => {
  const res = await apiClient.put(`/posts/${postId}`, payload);
  return res.data?.data;
};

// YENİ: silme
export const deletePost = async (postId) => {
  const res = await apiClient.delete(`/posts/${postId}`);
  return res.data;
};