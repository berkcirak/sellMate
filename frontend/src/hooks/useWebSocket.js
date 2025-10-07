import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (url = '/ws') => {
  const [isConnected, setIsConnected] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      // SockJS kullan - Native WebSocket yerine
      const socket = new SockJS(`http://localhost:8080${url}`);
      
      const client = new Client({
        webSocketFactory: () => socket,
        debug: () => {
        },
        onConnect: () => {
          setIsConnected(true);
          setStompClient(client);
        },
        onStompError: () => {
       
          setIsConnected(false);
        },
        onWebSocketClose: () => {
          setIsConnected(false);
          setStompClient(null);
          setTimeout(connect, 5000);
        }
      });

      clientRef.current = client;
      client.activate();
    };

    connect();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [url]);

  const subscribe = (destination, callback) => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      });
      return subscription;
    }
    return null;
  };

  const publish = (destination, message) => {
    if (stompClient && isConnected) {
      stompClient.publish({
        destination,
        body: JSON.stringify(message)
      });
    }
  };

  return {
    isConnected,
    stompClient,
    subscribe,
    publish
  };
};