import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';

const RegisterForm = () => {
  const { register: registerUser, isLoading, error } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    console.log('Register form submitted with:', data);
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      await registerUser(formData);
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const userIcon = (
    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

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
        <p className="login-subtitle">Hesap oluşturun</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        {/* Profile Image Upload */}
        <div className="input-group">
          <label className="input-label">Profil Fotoğrafı</label>
          <div className="image-upload-container">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="preview-image" />
              ) : (
                <div className="image-placeholder">
                  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Fotoğraf Seç</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="profileImage" className="file-label">
              {imagePreview ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}
            </label>
          </div>
        </div>

        {/* First Name */}
        <div className="input-group">
          <label className="input-label">Ad</label>
          <div className="input-wrapper">
            {userIcon}
            <input
              {...register('firstName', {
                required: validators.required,
                minLength: { value: 2, message: 'Ad en az 2 karakter olmalıdır' },
                maxLength: { value: 50, message: 'Ad en fazla 50 karakter olabilir' }
              })}
              type="text"
              className="input-field"
              placeholder="Adınız"
            />
          </div>
          {errors.firstName && (
            <p className="input-error">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="input-group">
          <label className="input-label">Soyad</label>
          <div className="input-wrapper">
            {userIcon}
            <input
              {...register('lastName', {
                required: validators.required,
                minLength: { value: 2, message: 'Soyad en az 2 karakter olmalıdır' },
                maxLength: { value: 50, message: 'Soyad en fazla 50 karakter olabilir' }
              })}
              type="text"
              className="input-field"
              placeholder="Soyadınız"
            />
          </div>
          {errors.lastName && (
            <p className="input-error">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="input-group">
          <label className="input-label">Şifre</label>
          <div className="input-wrapper">
            {passwordIcon}
            <input
              {...register('password', {
                required: validators.required,
                minLength: { value: 4, message: 'Şifre en az 4 karakter olmalıdır' }
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

        {/* Confirm Password */}
        <div className="input-group">
          <label className="input-label">Şifre Tekrar</label>
          <div className="input-wrapper">
            {passwordIcon}
            <input
              {...register('confirmPassword', {
                required: 'Şifre tekrarı gereklidir',
                validate: (value) => value === password || 'Şifreler eşleşmiyor'
              })}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && (
            <p className="input-error">{errors.confirmPassword.message}</p>
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
              Kayıt oluşturuluyor...
            </span>
          ) : (
            'Hesap Oluştur'
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="login-footer">
        <p className="footer-text">
          Zaten hesabınız var mı?{' '}
          <a href="/login" className="footer-link">
            Giriş yapın
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;