import { useState } from 'react';
import { authApi } from '../services/api/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Login attempt with:', { email, password });
      
      const response = await authApi.login({ email, password });
      console.log('Login response:', response);
      
      // Backend response yapısına göre token'ı al
      if (response.success && response.data && response.data.token) {
        const token = response.data.token;
        console.log('Token received:', token);
        
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', token);
        
        // Başarılı giriş sonrası dashboard'a yönlendir
        window.location.href = '/dashboard';
        
        return response;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Backend'den gelen error message'ı al
      const errorMessage = err.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    error,
  };
};