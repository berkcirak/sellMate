import apiClient from './client';

export const createOrder = async (postId) => {
  const res = await apiClient.post(`/orders/posts/${postId}`);
  return res.data?.data;
};

export const confirmOrder = async (orderId) => {
  const res = await apiClient.post(`/orders/${orderId}/confirm`);
  return res.data?.data;
};

export const cancelOrder = async (orderId) => {
  const res = await apiClient.post(`/orders/${orderId}/cancel`);
  return res.data?.data;
};