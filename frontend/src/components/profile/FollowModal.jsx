// frontend/src/components/profile/FollowModal.jsx
import { useEffect, useState } from 'react';
import { getFollowers, getFollowing, followUser, unfollowUser } from '../../services/api/user';
import Modal from '../ui/Modal';
import '../../styles/components/follow-modal.css';

export default function FollowModal({ isOpen, onClose, userId, type, currentUserId, onFollowChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followStates, setFollowStates] = useState({});

  useEffect(() => {
    if (isOpen && userId) {
      loadUsers();
    }
  }, [isOpen, userId, type]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = type === 'followers'
        ? await getFollowers(userId)
        : await getFollowing(userId);
      
      setUsers(data || []);
      
      // Her kullanıcı için takip durumunu kontrol et
      const states = {};
      for (const user of data || []) {
        if (user.id !== currentUserId) {
          const isFollowing = await checkFollowStatus(user.id);
          states[user.id] = isFollowing;
        }
      }
      setFollowStates(states);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async (targetUserId) => {
    try {
      const followingList = await getFollowing(currentUserId);
      return followingList.some(user => user.id === targetUserId);
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      const isCurrentlyFollowing = followStates[targetUserId];
      
      if (isCurrentlyFollowing) {
        await unfollowUser(targetUserId);
        setFollowStates(prev => ({ ...prev, [targetUserId]: false }));
        // Ana sayfaya bildir
        onFollowChange?.(targetUserId, false);
      } else {
        await followUser(targetUserId);
        setFollowStates(prev => ({ ...prev, [targetUserId]: true }));
        // Ana sayfaya bildir
        onFollowChange?.(targetUserId, true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="follow-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            {type === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}
          </h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading">Yükleniyor...</div>
          ) : (
            <div className="users-list">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.profileImage ? (
                        <img src={getFullImageUrl(user.profileImage)} alt="" />
                      ) : (
                        <div className="user-initials">
                          {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                      <div className="user-email">@{user.email.split('@')[0]}</div>
                    </div>
                  </div>
                  
                  {user.id !== currentUserId && (
                    <button
                      className={`follow-button ${followStates[user.id] ? 'following' : 'not-following'}`}
                      onClick={() => handleFollowToggle(user.id)}
                    >
                      {followStates[user.id] ? 'Takip Ediliyor' : 'Takip Et'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}