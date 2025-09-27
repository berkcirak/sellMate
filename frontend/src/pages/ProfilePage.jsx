// frontend/src/pages/ProfilePage.jsx
import { useEffect, useState, useCallback } from 'react';
import { getMyProfile, getUserById, followUser, unfollowUser, getFollowing } from '../services/api/user';
import { getPostsByUser, getPostByCommentId, getPost } from '../services/api/posts';
import { getUserLikes } from '../services/api/like';
import { getCommentsByUser } from '../services/api/comment';
import { useParams, Link } from 'react-router-dom';
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

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  // Modal'dan gelen takip durumu değişikliklerini handle et
  const handleModalFollowChange = useCallback((targetUserId, isNowFollowing) => {
    console.log('Modal follow change:', { targetUserId, isNowFollowing, modalType, meId: me?.id, authId: auth?.id });
    
    // Sadece kendi profilimdeyse sayıları güncelle
    if (auth?.id === me?.id) {
      // Kendi profilimdeyim, takip edilen sayısını güncelle
      setMe(prev => ({
        ...prev,
        followingCount: isNowFollowing 
          ? (prev.followingCount || 0) + 1 
          : Math.max(0, (prev.followingCount || 0) - 1)
      }));
    }
    // Başka birinin profilindeyse sayıları değiştirme (sabit kalsın)
  }, [auth?.id, me?.id]);

  const LikePostCard = ({ like }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchPost = async () => {
        try {
          const postData = await getPost(like.postId);
          setPost(postData);
        } catch (e) {
          console.error('Error fetching post:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }, [like.postId]);
  
    if (loading) return <div>Yükleniyor...</div>;
    if (!post) return <div>Gönderi bulunamadı</div>;
  
    return <PostCard post={post} />;
  };

  const CommentItem = ({ comment }) => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchPost = async () => {
        try {
          const postData = await getPostByCommentId(comment.id);
          setPost(postData);
        } catch (e) {
          console.error('Error fetching post by comment:', e);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }, [comment.id]);

    if (loading) {
      return (
        <div className="comment-item" style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {formatDate(new Date(comment.createdAt))}
            </div>
            <div style={{ flex: 1 }}>
              <div><strong>Gönderi:</strong> Yükleniyor...</div>
              <div style={{ marginTop: '4px' }}>{comment.content}</div>
            </div>
          </div>
        </div>
      );
    }

    if (!post) {
      return (
        <div className="comment-item" style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {formatDate(new Date(comment.createdAt))}
            </div>
            <div style={{ flex: 1 }}>
              <div><strong>Gönderi:</strong> Gönderi bulunamadı</div>
              <div style={{ marginTop: '4px' }}>{comment.content}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link 
        to={`/post/${post.id}`}
        className="comment-item"
        style={{ 
          display: 'block',
          padding: '12px', 
          borderBottom: '1px solid #eee',
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {formatDate(new Date(comment.createdAt))}
          </div>
          <div style={{ flex: 1 }}>
            <div><strong>Gönderi:</strong> {post.title || 'Bilinmeyen'}</div>
            <div style={{ marginTop: '4px' }}>{comment.content}</div>
          </div>
        </div>
      </Link>
    );
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

  // Check if current user is following the viewed user
  useEffect(() => {
    if (auth?.id && me?.id && auth.id !== me.id) {
      const checkFollowStatus = async () => {
        try {
          // Giriş yapan kullanıcının takip ettiklerini getir
          const followingList = await getFollowing(auth.id);
          // Bu kullanıcıyı takip edip etmediğini kontrol et
          const isFollowingUser = followingList.some(user => user.id === me.id);
          setIsFollowing(isFollowingUser);
        } catch (e) {
          console.error('Error checking follow status:', e);
          setIsFollowing(false);
        }
      };
      checkFollowStatus();
    }
  }, [auth?.id, me?.id]);

  const handleFollowToggle = async () => {
    if (!me?.id || !auth?.id || followLoading) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(me.id);
        setIsFollowing(false);
        // Takipçi sayısını güncelle
        setMe(prev => ({ ...prev, followersCount: Math.max(0, (prev.followersCount || 0) - 1) }));
      } else {
        await followUser(me.id);
        setIsFollowing(true);
        // Takipçi sayısını güncelle
        setMe(prev => ({ ...prev, followersCount: (prev.followersCount || 0) + 1 }));
      }
    } catch (e) {
      console.error('Error toggling follow:', e);
    } finally {
      setFollowLoading(false);
    }
  };

  if (err) return <div className="profile-page"><div className="profile-error">{err}</div></div>;
  if (!me) return <div className="profile-page"><div className="profile-loading">Yükleniyor…</div></div>;

  const created = me.createdAt ? new Date(me.createdAt).toLocaleString('tr-TR') : '-';
  const updated = me.updatedAt ? new Date(me.updatedAt).toLocaleString('tr-TR') : '-';
  const isOwnProfile = !userId || auth?.id === me.id;

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
          <div className="posts-list">
            {likes.map(like => (
              <LikePostCard key={like.id} like={like} />
            ))}
          </div>
        );
      
      case 'comments':
        return comments.length === 0 ? (
          <div className="empty-state">Henüz yorum yok.</div>
        ) : (
          <div className="comments-list">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
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
        <div className="profile-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          
          {/* Modern Follow Button */}
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              disabled={followLoading}
              className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}
            >
              {followLoading ? (
                <>
                  <div className="loading-spinner" style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid currentColor',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Yükleniyor...
                </>
              ) : (
                isFollowing ? 'Takip Ediliyor' : 'Takip Et'
              )}
            </button>
          )}
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
  
        {/* Modern Tabs */}
        <div className="profile-tabs">
          <div className="tab-buttons">
            {[
              { key: 'posts', label: 'Gönderiler' },
              { key: 'likes', label: 'Beğeniler' },
              { key: 'comments', label: 'Yorumlar' }
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="tab-content">
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
        onFollowChange={handleModalFollowChange}
      />
    </div>
  );
}