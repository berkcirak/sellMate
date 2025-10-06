import { useEffect, useState, useRef } from 'react';
import { sendMessage, getMessagesByConversation } from '../../services/api/message';
import { getMyProfile } from '../../services/api/user';
import '../../styles/components/message-box.css';

export default function MessageBox({ conversation, otherUser, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Current user ID'yi al
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const myProfile = await getMyProfile();
        if (myProfile?.id) {
          setCurrentUserId(myProfile.id);
          console.log('✅ Current User ID loaded:', myProfile.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (isOpen) {
      fetchCurrentUser();
    }
  }, [isOpen]);

  useEffect(() => {
    if (conversation?.id && isOpen) {
      loadMessages();
    }
  }, [conversation?.id, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessagesByConversation(conversation.id);
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const messageData = await sendMessage({
        userId: otherUser.id,
        content: newMessage.trim()
      });
      
      // Mesajı listeye ekle
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="message-box-overlay" onClick={onClose}>
      <div className="message-box" onClick={(e) => e.stopPropagation()}>
        <div className="message-box-header">
          <div className="message-box-user-info">
            <div className="message-box-avatar">
              {otherUser?.profileImage ? (
                <img src={getFullImageUrl(otherUser.profileImage)} alt="" />
              ) : (
                <div className="message-box-avatar-initials">
                  {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
                </div>
              )}
            </div>
            <div className="message-box-name">
              {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Bilinmeyen Kullanıcı'}
            </div>
          </div>
          <button className="message-box-close" onClick={onClose}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="message-box-content">
          {loading ? (
            <div className="loading-state">Mesajlar yükleniyor...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">Henüz mesaj yok</div>
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
        </div>

        <form onSubmit={handleSendMessage} className="message-box-input">
          <div className="input-wrapper">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesaj yazın..."
              className="message-input"
              disabled={sending}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <div className="loading-spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid currentColor',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}