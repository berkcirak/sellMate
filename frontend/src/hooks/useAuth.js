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
      
      if (response.success && response.data && response.data.token) {
        const token = response.data.token;
        console.log('Token received:', token);
        
        localStorage.setItem('token', token);
        window.location.href = '/dashboard';
        
        return response;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      const errorMessage = err.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Register attempt with:', formData);
      
      const response = await authApi.register(formData);
      console.log('Register response:', response);
      
      if (response.success) {
        // Başarılı kayıt sonrası login sayfasına yönlendir
        window.location.href = '/login?registered=true';
        return response;
      } else {
        throw new Error('Kayıt oluşturulamadı');
      }
    } catch (err) {
      console.error('Register error:', err);
      
      const errorMessage = err.response?.data?.message || 'Kayıt olurken bir hata oluştu';
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
    register,
    logout,
    isAuthenticated,
    isLoading,
    error,
  };
};