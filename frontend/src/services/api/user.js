import apiClient from './client';

export const getMyProfile = async () => {
  const res = await apiClient.get('/user/profile');
  return res.data?.data;
};
export const getUserById = async (userId) => {
  const res = await apiClient.get(`/user/${userId}`);
  return res.data?.data;
};

export const followUser = async (userId) => {
  const res = await apiClient.post(`/user/${userId}/follow`);
  return res.data;
};

export const unfollowUser = async (userId) => {
  const res = await apiClient.delete(`/user/${userId}/unfollow`);
  return res.data;
};

export const getFollowers = async (userId) =>
  apiClient.get(`/user/${userId}/followers`).then(r => r.data.data);

export const getFollowing = async (userId) =>
  apiClient.get(`/user/${userId}/following`).then(r => r.data.data);

export const searchUsers = async (q) =>
  apiClient.get(`/user/search`, { params: { q } }).then(r => r.data?.data);

export const updateProfile = async (formData) => {
  // Önce kendi profil bilgilerini al
  const myProfile = await getMyProfile();
  const res = await apiClient.put(`/user/${myProfile.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data?.data;
};
export const verifyPassword = async (password) => {
  const res = await apiClient.post('/user/verify-password', { password });
  return res.data?.data;
};

export const deleteProfile = async () => {
  // Önce kendi profil bilgilerini al
  const myProfile = await getMyProfile();
  const res = await apiClient.delete(`/user/${myProfile.id}`);
  return res.data;
};