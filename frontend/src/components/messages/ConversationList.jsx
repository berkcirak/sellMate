import { useEffect, useState } from 'react';
import { getMyConversations } from '../../services/api/conversation';
import { getUserById } from '../../services/api/user';
import '../../styles/components/conversation-list.css';

export default function ConversationList({ onSelectConversation, selectedConversationId }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [conversationUsers, setConversationUsers] = useState({});

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await getMyConversations();
        setConversations(data);

        // Her konuşma için diğer kullanıcının bilgilerini al
        const userPromises = data.map(async (conv) => {
          const otherUserId = conv.userAId !== localStorage.getItem('currentUserId') 
            ? conv.userAId 
            : conv.userBId;
          try {
            const user = await getUserById(otherUserId);
            return { conversationId: conv.id, user };
          } catch (error) {
            console.error('Error fetching user:', error);
            return { conversationId: conv.id, user: null };
          }
        });

        const userResults = await Promise.all(userPromises);
        const usersMap = {};
        userResults.forEach(({ conversationId, user }) => {
          usersMap[conversationId] = user;
        });
        setConversationUsers(usersMap);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

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
            const isSelected = selectedConversationId === conversation.id;
            
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
                    {user ? `${user.firstName} ${user.lastName}` : 'Bilinmeyen Kullanıcı'}
                  </div>
                  <div className="conversation-preview">
                    Son mesaj görüntülenemiyor
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