import { useWebSocket } from '../../hooks/useWebSocket';
import { sendMessage } from '../api/message';

export const useMessageWebSocket = () => {
  const { isConnected, subscribe, publish } = useWebSocket();

  // Mesaj gönderme (WebSocket + REST API)
  const sendMessageViaWebSocket = async (userId, content) => {
    try {
      const messageResponse = await sendMessage({ userId, content });
      publish('/app/message.send', {
        userId,
        content
      });
      
      return messageResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const subscribeToConversation = (conversationId, callback) => {
    if (!isConnected) {
      return null;
    }
    const topic = `/topic/conversation.${conversationId}`;
    
    const subscription = subscribe(topic, (message) => {
      callback(message);
    });
    
    
    return subscription;
  };

  // Kullanıcı online durumunu dinleme
  const subscribeToUserOnline = (callback) => {
    return subscribe('/topic/user.online', callback);
  };

  // Kullanıcı join
  const joinUser = () => {
    publish('/app/user.join', {});
  };

  return {
    isConnected,
    sendMessageViaWebSocket,
    subscribeToConversation,
    subscribeToUserOnline,
    joinUser
  };
};