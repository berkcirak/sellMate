import apiClient from './client';

export const createOffer = async (postId, price) => {
  const res = await apiClient.post(`/offers/posts/${postId}`, { price });
  return res.data?.data;
};

export const acceptOffer = async (offerId) => {
  const res = await apiClient.post(`/offers/${offerId}/accept`);
  return res.data?.data;
};

export const rejectOffer = async (offerId) => {
  const res = await apiClient.post(`/offers/${offerId}/reject`);
  return res.data?.data;
};