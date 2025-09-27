// frontend/src/pages/SearchPage.jsx
import { useEffect, useState } from 'react';
import { searchUsers } from '../services/api/user';
import { searchPosts } from '../services/api/posts';
import { useNavigate } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import '../styles/pages/search.css';

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
    <div className="search-page">
      <div className="search-container">
        <main className="search-content">
          <h2 className="section-title">"{q}" için arama sonuçları</h2>

          <section className="search-section">
            <h3>Kullanıcılar</h3>
            {users.length === 0 ? (
              <div className="empty-state">Sonuç yok</div>
            ) : (
              <div className="search-users-list">
                {users.map(u => (
                  <div
                    key={u.id}
                    className="search-user-item"
                    onClick={() => navigate(`/profile/${u.id}`)}
                  >
                    <div className="search-user-avatar">
                      {u.profileImage ? (
                        <img src={getFullImageUrl(u.profileImage)} alt="" />
                      ) : (
                        <div className="search-user-initials">
                          {u.firstName?.[0]}{u.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="search-user-info">
                      <div className="search-user-name">{u.firstName} {u.lastName}</div>
                      <div className="search-user-email">@{u.email?.split('@')[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="search-section">
            <h3>İlanlar</h3>
            {posts.length === 0 ? (
              <div className="empty-state">Sonuç yok</div>
            ) : (
              <div className="search-posts-list">
                {posts.map(p => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </section>

          {loading && <div className="loading-state">Yükleniyor…</div>}
        </main>
      </div>
    </div>
  );
}