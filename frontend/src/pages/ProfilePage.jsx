import { useEffect, useState } from 'react';
import { getMyProfile, getUserById } from '../services/api/user';
import { useParams } from 'react-router-dom';
import FollowModal from '../components/profile/FollowModal';
import '../styles/pages/profile.css';

export default function ProfilePage() {
  const { userId } = useParams();
  const [me, setMe] = useState(null);
  const [err, setErr] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('followers');

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = userId ? await getUserById(userId) : await getMyProfile();
        setMe(data);
      } catch (e) {
        console.error('Profile fetch error:', e);
        setErr('Profil bilgileri alınamadı.');
      }
    })();
  }, [userId]);

  if (err) return <div className="profile-page"><div className="profile-error">{err}</div></div>;
  if (!me) return <div className="profile-page"><div className="profile-loading">Yükleniyor…</div></div>;

  const created = me.createdAt ? new Date(me.createdAt).toLocaleString('tr-TR') : '-';
  const updated = me.updatedAt ? new Date(me.updatedAt).toLocaleString('tr-TR') : '-';

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
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
          <button className="stat-item" onClick={() => openModal('following')}>
            <span className="stat-number">{me.followingCount || 0}</span>
            <span className="stat-label">Takip Edilenler</span>
          </button>
          <button className="stat-item" onClick={() => openModal('followers')}>
            <span className="stat-number">{me.followersCount || 0}</span>
            <span className="stat-label">Takipçiler</span>
          </button>
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
        currentUserId={me.id}
      />
    </div>
  );
}