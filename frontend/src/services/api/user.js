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