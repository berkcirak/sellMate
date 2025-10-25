import apiClient from './client';

export const getMyWallet = async () => {
  const res = await apiClient.get('/wallet/my-wallet');
  return res.data?.data;
};

export const depositWallet = async (amount) => {
  const res = await apiClient.post('/wallet/deposit', { amount });
  return res.data?.data;
};

export const withdrawWallet = async (amount) => {
  const res = await apiClient.post('/wallet/withdraw', { amount });
  return res.data?.data;
};