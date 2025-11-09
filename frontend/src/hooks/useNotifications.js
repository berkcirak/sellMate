// frontend/src/hooks/useNotifications.js - Düzeltilmiş
import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { getMyProfile } from '../services/api/user';
import { getNotifications, getUnreadCount } from '../services/api/notification';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);

  // ✅ DB'den bildirimleri yükle
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const loadedNotifications = await getNotifications();
        setNotifications(loadedNotifications);
        
        // Okunmamış sayısını al
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (err) {
        console.error('❌ Bildirimler yüklenirken hata:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const connectWebSocket = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setConnectionError('Token bulunamadı. Lütfen giriş yapın.');
        setIsLoading(false);
        return;
      }

      let userId = localStorage.getItem('currentUserId');
      
      if (!userId) {
        try {
          const profile = await getMyProfile();
          if (profile && profile.id) {
            userId = profile.id.toString();
            localStorage.setItem('currentUserId', userId);
          } else {
            setConnectionError('Kullanıcı bilgisi alınamadı.');
            return;
          }
        } catch (error) {
          console.error('Kullanıcı bilgisi alınamadı:', error);
          setConnectionError('Kullanıcı bilgisi alınamadı.');
          return;
        }
      }

      const wsUrl = `${API_BASE_URL}/ws`;

      const client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: (str) => {
          if (str.includes('ERROR') || str.includes('CONNECTED') || str.includes('SUBSCRIBED')) {
            console.log('🔔 STOMP Debug:', str);
          }
        },
      });

      client.onConnect = () => {
        setIsConnected(true);
        setConnectionError(null);
        
        const destination = `/topic/users.${userId}.notifications`;
        
        const subscription = client.subscribe(
          destination,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((prev) => prev + 1);
            } catch (err) {
              console.error('❌ Bildirim parse hatası:', err);
            }
          }
        );
        
        subscriptionRef.current = subscription;
      };

      client.onStompError = (frame) => {
        const errorMsg = frame.headers['message'] || frame.body || 'Bilinmeyen hata';
        setIsConnected(false);
        setConnectionError(`STOMP Hatası: ${errorMsg}`);
      };

      client.onWebSocketError = (event) => {
        setConnectionError(`WebSocket Hatası: ${event.message || 'Bağlantı hatası'}`);
        setIsConnected(false);
      };

      client.onWebSocketClose = () => {
        setIsConnected(false);
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
          subscriptionRef.current = null;
        }
      };

      try {
        client.activate();
        clientRef.current = client;
      } catch (err) {
        setConnectionError(`Bağlantı hatası: ${err.message}`);
      }
    };

    connectWebSocket();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  const refreshNotifications = async () => {
    try {
      const loadedNotifications = await getNotifications();
      setNotifications(loadedNotifications);
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error('❌ Bildirimler yenilenirken hata:', err);
    }
  };

  return {
    notifications,
    setNotifications, // ✅ EKLE - NotificationPage'de kullanılıyor
    isConnected,
    connectionError,
    isLoading,
    unreadCount,
    refreshNotifications,
  };
}