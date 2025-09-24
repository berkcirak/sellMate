import { useEffect, useState } from 'react';
import { getFollowers, getFollowing, followUser, unfollowUser } from '../../services/api/user';
import '../ui/Modal';
import '../../styles/components/follow-modal.css';

export default function FollowModal({ 
  isOpen, 
  onClose, 
  userId, 
  type = 'followers', // 'followers' veya 'following'
  currentUserId 
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(new Set());

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
      // Sadece kendi profilini görüntülerken kendini gizle
      const list = (data || []).filter(u => !(userId === currentUserId && u.id === currentUserId));
      setUsers(list);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      await followUser(targetUserId);
      setFollowing(prev => new Set([...prev, targetUserId]));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await unfollowUser(targetUserId);
      setFollowing(prev => {
        const newSet = new Set(prev);
        newSet.delete(targetUserId);
        return newSet;
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content follow-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{type === 'followers' ? 'Takipçiler' : 'Takip Edilenler'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading ? (
            <div className="loading">Yükleniyor...</div>
          ) : (
            <div className="follow-list">
              {users.map(user => {
                const isFollowing = following.has(user.id);
                const isCurrentUser = user.id === currentUserId;
                
                return (
                  <div key={user.id} className="follow-item">
                    <div className="follow-avatar">
                      {user.profileImage ? (
                        <img src={getFullImageUrl(user.profileImage)} alt="" />
                      ) : (
                        <div className="follow-initials">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    
                    <div className="follow-info">
                      <div className="follow-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="follow-email">@{user.email?.split('@')[0]}</div>
                    </div>
                    
                    {!isCurrentUser && (
                      <button 
                        className={`follow-btn ${isFollowing ? 'following' : 'not-following'}`}
                        onClick={() => isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                      >
                        {isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}