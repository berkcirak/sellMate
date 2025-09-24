// frontend/src/pages/SearchPage.jsx
import { useEffect, useState } from 'react';
import { searchUsers } from '../services/api/user';
import { searchPosts } from '../services/api/posts';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import '../styles/pages/feed.css';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
  };

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const query = sp.get('q') || '';
    setQ(query);
    if (!query) {
      setUsers([]); setPosts([]); return;
    }
    (async () => {
      try {
        setLoading(true);
        const [u, p] = await Promise.all([
          searchUsers(query),
          searchPosts(query),
        ]);
        setUsers(u || []);
        setPosts(p || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]);

  return (
    <div className="feed-page">
      <div className="feed-container">
        <main className="feed-content">
          <h2 className="section-title">“{q}” için arama sonuçları</h2>

          <section>
            <h3>Kullanıcılar</h3>
            {users.length === 0 ? <div className="empty-state">Sonuç yok</div> : (
              <div className="follow-list">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="follow-item"
                    onClick={() => navigate(`/profile/${u.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="follow-avatar">
                      {u.profileImage ? <img src={getFullImageUrl(u.profileImage)} alt="" /> : (
                        <div className="follow-initials">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                      )}
                    </div>
                    <div className="follow-info">
                      <div className="follow-name">{u.firstName} {u.lastName}</div>
                      <div className="follow-email">@{u.email?.split('@')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={{ marginTop: 24 }}>
            <h3>İlanlar</h3>
            {posts.length === 0 ? <div className="empty-state">Sonuç yok</div> : posts.map(p => (
              <PostCard key={p.id} post={p} />
            ))}
          </section>

          {loading ? <div className="loading-state">Yükleniyor…</div> : null}
        </main>
      </div>
    </div>
  );
}