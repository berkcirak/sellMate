import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import '../styles/pages/login.css';
const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;