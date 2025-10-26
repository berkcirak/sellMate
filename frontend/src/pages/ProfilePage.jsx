// frontend/src/pages/ProfilePage.jsx
import { useEffect, useState, useCallback } from 'react';
import { getMyProfile, getUserById, followUser, unfollowUser, getFollowing, updateProfile, verifyPassword, deleteProfile } from '../services/api/user';
import { getPostsByUser, getPostByCommentId, getPost } from '../services/api/posts';
import { getUserLikes } from '../services/api/like';
import { getCommentsByUser } from '../services/api/comment';
import { useParams, Link } from 'react-router-dom';
import FollowModal from '../components/profile/FollowModal';
import PostCard from '../components/posts/PostCard';
import MessageBox from '../components/messages/MessageBox';
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

  // Message states - YENİ
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [messageConversation, setMessageConversation] = useState(null);

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    profileImage: null
  });
  const [editLoading, setEditLoading] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit profile states
  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };
  const handleEditProfile = () => {
    setEditForm({
      firstName: me?.firstName || '',
      lastName: me?.lastName || '',
      email: me?.email || '',
      password: '********', // Masked password
      profileImage: null
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profileImage: null
    });
  };

  const handleSaveProfile = async () => {
    try {
      setEditLoading(true);
      
      const formData = new FormData();
      
      // Sadece değişen alanları gönder
      if (editForm.firstName !== me?.firstName) {
        formData.append('firstName', editForm.firstName);
      }
      if (editForm.lastName !== me?.lastName) {
        formData.append('lastName', editForm.lastName);
      }
      if (editForm.email !== me?.email) {
        formData.append('email', editForm.email);
      }
      if (editForm.password !== '********' && editForm.password.trim() !== '') {
        formData.append('password', editForm.password);
      }
      if (editForm.profileImage) {
        formData.append('profileImage', editForm.profileImage);
      }

      const updatedUser = await updateProfile(formData);
      setMe(updatedUser);
      setIsEditing(false);
      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profile update error:', error);
      alert('Profil güncellenirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
    } finally {
      setEditLoading(false);
    }
  };
  const handleDeleteProfile = () => {
    setShowDeleteModal(true);
    setDeletePassword('');
  };
  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      
      // Önce password'ü doğrula
      const isValid = await verifyPassword(deletePassword);
      if (!isValid) {
        alert('Şifre yanlış!');
        return;
      }
      
      // Password doğruysa profili sil
      await deleteProfile();
      alert('Profil başarıyla silindi!');
      // Logout işlemi yapılabilir
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Delete profile error:', error);
      alert('Profil silinirken bir hata oluştu: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // Eğer kullanıcı masked password'u silerse, boş string yap
    if (value === '********') {
      setEditForm(prev => ({ ...prev, password: '' }));
    } else {
      setEditForm(prev => ({ ...prev, password: value }));
    }
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

  // Mesaj gönderme fonksiyonu - YENİ
  const handleSendMessage = () => {
    if (!me?.id || !auth?.id) return;
    
    // Conversation oluştur (backend otomatik oluşturacak)
    const conversation = {
      id: `temp_${Date.now()}`, // Geçici ID, backend gerçek ID verecek
      userAId: Math.min(auth.id, me.id),
      userBId: Math.max(auth.id, me.id)
    };
    
    setMessageConversation(conversation);
    setIsMessageBoxOpen(true);
  };

  // MessageBox kapatma fonksiyonu - YENİ
  const handleCloseMessageBox = () => {
    setIsMessageBoxOpen(false);
    setMessageConversation(null);
    const event = new CustomEvent('conversationListRefresh');
    window.dispatchEvent(event);
  };

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
        
        {/* Buttons Container - YENİ */}
        {!isOwnProfile && (
          <div className="profile-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Follow Button */}
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
            
            {/* Message Button - YENİ */}
            <button
              onClick={handleSendMessage}
              className="message-button"
            >
              <span>Mesaj At</span>
            </button>
          </div>
        )}

        {/* Edit Profile Button - sadece kendi profilinde */}
        {isOwnProfile && (
          <div className="profile-buttons">
            <button
              onClick={handleEditProfile}
              className="edit-profile-button"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                border: 'none',
                fontWeight: '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'rgba(245, 158, 11, 0.8)',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              Profili Düzenle
            </button>

            <button
              onClick={handleDeleteProfile}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '2rem',
                border: 'none',
                fontWeight: '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              Profili Sil
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Form */}
      {/* Modal Overlay */}
      {isEditing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.5rem' }}>Profili Düzenle</h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Form alanları buraya */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Ad
          </label>
          <input
            type="text"
            value={editForm.firstName}
            onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Soyad
          </label>
          <input
            type="text"
            value={editForm.lastName}
            onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            E-posta
          </label>
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Şifre
          </label>
          <input
            type="password"
            value={editForm.password}
            onChange={handlePasswordChange}
            placeholder="Yeni şifre girin (değiştirmek istemiyorsanız boş bırakın)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Şifre değiştirmek istemiyorsanız bu alanı boş bırakın
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Profil Fotoğrafı
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Profil fotoğrafı değiştirmek istemiyorsanız bu alanı boş bırakın
          </small>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            onClick={handleCancelEdit}
            disabled={editLoading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              background: '#fff',
              color: '#333',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            İptal
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={editLoading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              background: 'rgba(245, 158, 11, 0.8)',
              color: 'white',
              cursor: editLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              backdropFilter: 'blur(10px)'
            }}
          >
            {editLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
{showDeleteModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(5px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.5rem' }}>
        Profili Sil
      </h3>
      
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Bu işlem geri alınamaz! Profilinizi silmek için şifrenizi girin.
      </p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Şifre
        </label>
        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          placeholder="Şifrenizi girin"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowDeleteModal(false)}
          disabled={deleteLoading}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: '#fff',
            color: '#333',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          İptal
        </button>
        <button
          onClick={handleConfirmDelete}
          disabled={deleteLoading || !deletePassword.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.8)',
            color: 'white',
            cursor: deleteLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            backdropFilter: 'blur(10px)'
          }}
        >
          {deleteLoading ? 'Siliniyor...' : 'Profili Sil'}
        </button>
      </div>
    </div>
  </div>
)}

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

      {/* MessageBox - YENİ */}
      <MessageBox
        conversation={messageConversation}
        otherUser={me}
        isOpen={isMessageBoxOpen}
        onClose={handleCloseMessageBox}
      />
    </div>
  );
}