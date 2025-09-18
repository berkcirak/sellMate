import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';

const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    console.log('Form submitted with:', data);
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const emailIcon = (
    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const passwordIcon = (
    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <div className="card">
      {/* Header */}
      <div className="login-header">
        <h1 className="login-title">SellMate</h1>
        <p className="login-subtitle">Hesabınıza giriş yapın</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="input-group">
          <label className="input-label">E-posta Adresi</label>
          <div className="input-wrapper">
            {emailIcon}
            <input
              {...register('email', {
                required: validators.required,
                validate: validators.email
              })}
              type="email"
              className="input-field"
              placeholder="ornek@email.com"
            />
          </div>
          {errors.email && (
            <p className="input-error">{errors.email.message}</p>
          )}
        </div>

        <div className="input-group">
          <label className="input-label">Şifre</label>
          <div className="input-wrapper">
            {passwordIcon}
            <input
              {...register('password', {
                required: validators.required,
                validate: validators.minLength(4)
              })}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="input-error">{errors.password.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary btn-full"
        >
          {isLoading ? (
            <span className="btn-loading">
              <div className="spinner"></div>
              Giriş yapılıyor...
            </span>
          ) : (
            'Giriş Yap'
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="login-footer">
        <p className="footer-text">
          Hesabınız yok mu?{' '}
          <a href="/register" className="footer-link">
            Kayıt olun
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;