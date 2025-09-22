import React from 'react';
import RegisterForm from '../components/forms/RegisterForm';
import '../styles/pages/register.css';
const RegisterPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;