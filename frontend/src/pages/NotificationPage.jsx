import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { markAsRead, markAllAsRead } from '../services/api/notification';
import '../styles/pages/notification.css';

export default function NotificationPage() {
  const { notifications, setNotifications, isConnected, connectionError, isLoading, unreadCount, refreshNotifications } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'COMMENT':
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'ORDER':
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'OFFER_CREATED':
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'OFFER_ACCEPTED':
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'OFFER_REJECTED':
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'LIKE':
        return '#e91e63';
      case 'COMMENT':
        return '#2196f3';
      case 'ORDER':
        return '#4caf50';
      case 'OFFER_CREATED':
        return '#ff9800';
      case 'OFFER_ACCEPTED':
        return '#4caf50';
      case 'OFFER_REJECTED':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(parseInt(notification.id));
      
      // ✅ setNotifications hook'tan geliyor artık
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('Bildirim okundu işaretlenirken hata:', err);
    }

    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await refreshNotifications();
    } catch (err) {
      console.error('Tüm bildirimler okundu işaretlenirken hata:', err);
    }
  };

  return (
    <div className="notification-page">
      <div className="notification-header">
        <h1>Bildirimler</h1>
        <div className="notification-header-actions">
          <span className="connection-status">
            {isLoading ? (
              <span className="status-loading">● Yükleniyor...</span>
            ) : isConnected ? (
              <span className="status-connected">● Bağlı</span>
            ) : (
              <span className="status-disconnected">● Bağlantı Yok</span>
            )}
          </span>
          {/* ✅ unreadCount göster (kullanılmış olur) */}
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} okunmamış</span>
          )}
          {notifications.length > 0 && (
            <button className="clear-btn" onClick={handleMarkAllAsRead}>
              Tümünü Okundu İşaretle
            </button>
          )}
        </div>
      </div>

      {connectionError && !isLoading && (
        <div className="notification-error">
          <p>⚠️ {connectionError}</p>
          <button onClick={() => window.location.reload()}>Yeniden Dene</button>
        </div>
      )}

      <div className="notification-content">
        {isLoading ? (
          <div className="notification-loading">
            <p>🔄 Bildirimler yükleniyor...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p>Henüz bildirim yok</p>
            <span>Yeni bildirimler burada görünecek</span>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="notification-item"
                onClick={() => handleNotificationClick(notification)}
              >
                <div
                  className="notification-icon"
                  style={{ color: getNotificationColor(notification.type) }}
                >
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-body">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}