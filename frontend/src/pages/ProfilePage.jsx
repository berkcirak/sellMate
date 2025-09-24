import { useEffect, useState, useCallback } from 'react';
import { getMyProfile, getUserById } from '../services/api/user';
import { getPostsByUser } from '../services/api/posts';
import { getUserLikes } from '../services/api/like';
import { getCommentsByUser } from '../services/api/comment';
import { useParams } from 'react-router-dom';
import FollowModal from '../components/profile/FollowModal';
import PostCard from '../components/posts/PostCard';
import '../styles/pages/profile.css';

export default function ProfilePage() {
  const { userId } = useParams();
  const [me, setMe] = useState(null);
  const [auth, setAuth] = useState(null);
  const [err, setErr] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('followers');
  
  // Tab states
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  const loadTabData = useCallback(async () => {
    if (!me?.id) return;
    
    setLoading(true);
    try {
      switch (activeTab) {
        case 'posts': {
          const postsData = await getPostsByUser(me.id);
          setPosts(postsData || []);
          break;
        }
        case 'likes': {
          const likesData = await getUserLikes(me.id);
          setLikes(likesData || []);
          break;
        }
        case 'comments': {
          const commentsData = await getCommentsByUser(me.id);
          setComments(commentsData || []);
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error('Error loading tab data:', e);
    } finally {
      setLoading(false);
    }
  }, [me?.id, activeTab]);

  useEffect(() => {
    (async () => {
      try {
        // Görüntülenen profil
        const data = userId ? await getUserById(userId) : await getMyProfile();
        setMe(data);
        // Giriş yapan kullanıcı
        const mine = await getMyProfile();
        setAuth(mine);
      } catch (e) {
        console.error('Profile fetch error:', e);
        setErr('Profil bilgileri alınamadı.');
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (me?.id) {
      loadTabData();
    }
  }, [me?.id, loadTabData]);

  if (err) return <div className="profile-page"><div className="profile-error">{err}</div></div>;
  if (!me) return <div className="profile-page"><div className="profile-loading">Yükleniyor…</div></div>;

  const created = me.createdAt ? new Date(me.createdAt).toLocaleString('tr-TR') : '-';
  const updated = me.updatedAt ? new Date(me.updatedAt).toLocaleString('tr-TR') : '-';

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  const renderTabContent = () => {
    if (loading) {
      return <div className="loading-state">Yükleniyor…</div>;
    }

    switch (activeTab) {
      case 'posts':
        return posts.length === 0 ? (
          <div className="empty-state">Henüz gönderi yok.</div>
        ) : (
          <div className="posts-list">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        );
      
      case 'likes':
        return likes.length === 0 ? (
          <div className="empty-state">Henüz beğeni yok.</div>
        ) : (
          <div className="likes-list">
            {likes.map(like => (
              <div key={like.id} className="like-item" style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDate(new Date(like.createdAt))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>Beğendi:</strong> {like.post?.title || 'Gönderi'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'comments':
        return comments.length === 0 ? (
          <div className="empty-state">Henüz yorum yok.</div>
        ) : (
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment-item" style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatDate(new Date(comment.createdAt))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div><strong>Gönderi:</strong> {comment.post?.title || 'Bilinmeyen'}</div>
                    <div style={{ marginTop: '4px' }}>{comment.content}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {me.profileImage ? (
              <img src={getFullImageUrl(me.profileImage)} alt="" />
            ) : (
              <div className="profile-initials">
                {(me.firstName?.[0] || '').toUpperCase()}{(me.lastName?.[0] || '').toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-title">
            <h1 className="profile-name">{me.firstName} {me.lastName}</h1>
            <div className="profile-email">{me.email}</div>
          </div>
        </div>

        {/* Follow Stats */}
        <div className="profile-stats">
          <button className="stat-item" onClick={() => openModal('followers')}>
            <span className="stat-number">{me.followersCount || 0}</span>
            <span className="stat-label">Takipçiler</span>
          </button>
          <button className="stat-item" onClick={() => openModal('following')}>
            <span className="stat-number">{me.followingCount || 0}</span>
            <span className="stat-label">Takip Edilenler</span>
          </button>
        </div>

        {/* Tabs - Takipçiler kısmının hemen altında */}
        <div className="profile-tabs" style={{ marginTop: '20px' }}>
          <div className="tab-buttons" style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
            {[
              { key: 'posts', label: 'Gönderiler' },
              { key: 'likes', label: 'Beğeniler' },
              { key: 'comments', label: 'Yorumlar' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.key ? '2px solid #007bff' : '2px solid transparent',
                  color: activeTab === tab.key ? '#007bff' : '#666',
                  fontWeight: activeTab === tab.key ? '600' : '400'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="tab-content" style={{ padding: '20px 0' }}>
            {renderTabContent()}
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <span className="profile-label">Kayıt Tarihi</span>
            <span className="profile-value">{created}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Güncelleme</span>
            <span className="profile-value">{updated}</span>
          </div>
        </div>
      </div>

      <FollowModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={me.id}
        type={modalType}
        currentUserId={auth?.id}
      />
    </div>
  );
}