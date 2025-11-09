import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import Layout from '../components/layout/Layout';
import ProfilePage from '../pages/ProfilePage';
import SearchPage from '../pages/SearchPage';
import PostDetailPage from '../pages/PostDetailPage';
import WalletPage from '../pages/WalletPage';
import NotificationPage from '../pages/NotificationPage';
// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function Protected({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

const AppRouter = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

           {/* Protected routes with sidebar */}
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route path="feed" element={<FeedPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route index element={<Navigate to="/feed" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;