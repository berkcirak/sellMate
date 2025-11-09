// frontend/src/components/messages/ConversationList.jsx - Güncelle
import { useEffect, useState, useCallback } from 'react';
import { getMyConversations } from '../../services/api/conversation';
import { getUserById, getMyProfile } from '../../services/api/user';
import { getMessagesByConversation } from '../../services/api/message';
import '../../styles/components/conversation-list.css';

export default function ConversationList({ onSelectConversation, selectedConversationId, refreshTrigger }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversationUsers, setConversationUsers] = useState({});
  const [lastMessages, setLastMessages] = useState({});

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`;
    return messageDate.toLocaleDateString('tr-TR');
  };

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const myProfile = await getMyProfile();
      const currentUserId = myProfile?.id;
      
      const data = await getMyConversations();
      
      const userPromises = (data || []).map(async (conv) => {
        let otherUserId;
        
        if (conv.userAId === currentUserId) {
          otherUserId = conv.userBId;
        } else if (conv.userBId === currentUserId) {
          otherUserId = conv.userAId;
        } else {
          otherUserId = conv.userAId;
        }
        
        try {
          const [user, messages] = await Promise.all([
            getUserById(otherUserId),
            getMessagesByConversation(conv.id)
          ]);
          
          if (!user) {
            return null; // Silinmiş kullanıcı - filtrele
          }
          
          const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
          
          return { 
            conversationId: conv.id, 
            conversation: conv, 
            user, 
            lastMessage 
          };
        } catch (error) {
          console.error('Error loading conversation:', error);
          console.log('Kullanıcı bulunamadı (muhtemelen silinmiş):', otherUserId);
          return null; 
        }
      });

      const results = await Promise.all(userPromises);
      
      const validResults = results.filter(result => result !== null);
      
      const validConversations = validResults.map(r => r.conversation);
      setConversations(validConversations);
      
      const usersMap = {};
      const messagesMap = {};
      
      validResults.forEach(({ conversationId, user, lastMessage }) => {
        usersMap[conversationId] = user;
        messagesMap[conversationId] = lastMessage;
      });
      
      setConversationUsers(usersMap);
      setLastMessages(messagesMap);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Konuşmalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Refresh trigger'ı dinle
  useEffect(() => {
    if (refreshTrigger) {
      loadConversations();
    }
  }, [refreshTrigger, loadConversations]);

  if (loading) {
    return (
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h3>Mesajlar</h3>
        </div>
        <div className="loading-state">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h3>Mesajlar</h3>
        </div>
        <div className="error-state" style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#dc2626',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          margin: '10px'
        }}>
          {error}
          <button 
            onClick={loadConversations}
            style={{
              display: 'block',
              margin: '10px auto 0',
              padding: '8px 16px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h3>Mesajlar</h3>
      </div>
      
      {conversations.length === 0 ? (
        <div className="empty-state">Henüz mesaj yok</div>
      ) : (
        <div className="conversation-items">
          {conversations.map((conversation) => {
            const user = conversationUsers[conversation.id];
            const lastMessage = lastMessages[conversation.id];
            const isSelected = selectedConversationId === conversation.id;
            
            if (!user) {
              return null;
            }
            
            return (
              <div
                key={conversation.id}
                className={`conversation-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectConversation(conversation, user)}
              >
                <div className="conversation-avatar">
                  {user?.profileImage ? (
                    <img src={getFullImageUrl(user.profileImage)} alt="" />
                  ) : (
                    <div className="conversation-avatar-initials">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="conversation-preview">
                    {lastMessage ? (
                      <>
                        <span className="message-text">
                          {lastMessage.content}
                        </span>
                        <span className="message-time">
                          {formatDate(lastMessage.createdAt)}
                        </span>
                      </>
                    ) : (
                      'Henüz mesaj yok'
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}