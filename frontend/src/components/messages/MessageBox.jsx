import React, { useState, useEffect, useRef } from 'react';
import { getMessagesByConversation } from '../../services/api/message';
import { getMyProfile } from '../../services/api/user';
import { useMessageWebSocket } from '../../services/websocket/messageWebSocket';
import '../../styles/components/message-box.css';

export default function MessageBox({ conversation, otherUser, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  // WebSocket hook'u
  const { 
    isConnected, 
    sendMessageViaWebSocket, 
    subscribeToConversation, 
    joinUser 
  } = useMessageWebSocket();

  // Current user ID'yi al
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const myProfile = await getMyProfile();
        if (myProfile?.id) {
          setCurrentUserId(myProfile.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (isOpen) {
      fetchCurrentUser();
      joinUser(); // WebSocket'e join et
    }
  }, [isOpen, joinUser]);

  // Mesajları yükle
  useEffect(() => {
    const loadMessages = async () => {
      if (!conversation?.id) return;
      
      setLoading(true);
      try {
        const messagesData = await getMessagesByConversation(conversation.id);
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && conversation?.id) {
      loadMessages();
    }
  }, [isOpen, conversation?.id]);

  useEffect(() => {
    if (!conversation?.id || !isConnected) {
      return;
    }
  
    
    const subscription = subscribeToConversation(conversation.id, (newMessage) => {
      
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === newMessage.id);
        if (exists) {
          return prev;
        }
        
        return [...prev, newMessage];
      });
    });
  
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [conversation?.id, isConnected, subscribeToConversation]);

  // Mesaj gönderme
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !otherUser?.id) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const sentMessage = await sendMessageViaWebSocket(otherUser.id, messageContent);
      
      if (sentMessage && currentUserId) {
        const optimisticMessage = {
          ...sentMessage,
          senderId: currentUserId,
          id: `temp_${Date.now()}`
        };
        setMessages(prev => [...prev, optimisticMessage]);
        
        // Conversation list'i yenile
        const event = new CustomEvent('conversationListRefresh');
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent);
    }
  };

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Mesajları scroll et
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mesaj zamanını formatla
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="message-box-overlay">
      <div className="message-box">
        <div className="message-box-header">
          <div className="message-box-user-info">
            <div className="message-box-avatar">
              {otherUser?.profileImage ? (
                <img src={otherUser.profileImage} alt={otherUser.firstName} />
              ) : (
                <div className="avatar-placeholder">
                  {otherUser?.firstName?.charAt(0)}{otherUser?.lastName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="message-box-user-details">
              <h4>{otherUser?.firstName} {otherUser?.lastName}</h4>
              <div className="connection-status">
                <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                  {isConnected ? '🟢 Bağlı' : '🔴 Bağlantı yok'}
                </span>
              </div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="message-box-content">
          {loading ? (
            <div className="loading">Mesajlar yükleniyor...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <p>Henüz mesaj yok. İlk mesajı sen gönder!</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => {
                const senderId = message.senderId ? parseInt(message.senderId) : null;
                const isMe = currentUserId && senderId && senderId === currentUserId;
                
                return (
                  <div key={message.id} className={`message-item ${isMe ? 'sent' : 'received'}`}>
                    <div className="message-content">
                      {message.content}
                    </div>
                    <div className="message-time">
                      {formatMessageTime(message.createdAt)}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="message-input-container">
            <div className="message-input-wrapper">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                className="message-input"
                rows="1"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className="send-button"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}