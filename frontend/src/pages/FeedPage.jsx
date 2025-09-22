import { useEffect, useState, useCallback } from 'react';
import { fetchFeed, createPost } from '../services/api/posts';
import PostCard from '../components/posts/PostCard';
import PostForm from '../components/posts/PostForm';
import '../styles/pages/feed.css';
import '../styles/components/modal.css';

export default function FeedPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async (next = 0) => {
    try {
      setLoading(true);
      const data = await fetchFeed({ page: next, size });
      setItems(prev => (next === 0 ? data : [...prev, ...data]));
      setPage(next);
    } catch (error) {
      setErr('Akış yüklenirken bir hata oluştu.');
      console.error('Feed load error:', error);
    } finally {
      setLoading(false);
    }
  }, [size]);

  const handlePostSubmit = async (formData) => {
    try {
      setPosting(true);
      await createPost(formData);
      // Yeni post eklendi, feed'i yenile
      await load(0);
    } catch (error) {
      setErr('Post paylaşılırken bir hata oluştu.');
      console.error('Post create error:', error);
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    load(0);
  }, [load]);

  return (
    <div className="feed-page">
      <div className="feed-container">
        <header className="feed-header">
          <h1 className="feed-title">Akış</h1>
          <p className="feed-subtitle">Takip ettiklerinin paylaşımları</p>
        </header>

        <main className="feed-content">
          {/* Quick Post Box */}
          <div className="quick-post-box" onClick={() => setShowPostForm(true)}>
            <div className="quick-post-content">
              <div className="quick-post-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="quick-post-text">Gönderi Oluştur</div>
              <div className="quick-post-hint">Yeni bir ilan paylaş</div>
            </div>
          </div>

          {/* Post Form Modal */}
          <PostForm 
            onSubmit={handlePostSubmit} 
            loading={posting}
            isOpen={showPostForm}
            onClose={() => setShowPostForm(false)}
          />

          {err ? (
            <div className="error-state">{err}</div>
          ) : null}

          {loading && items.length === 0 ? (
            <div className="loading-state">Yükleniyor…</div>
          ) : null}

          {(!loading && items.length === 0 && !err) ? (
            <div className="empty-state">Henüz gösterilecek gönderi yok.</div>
          ) : null}

          {items.map(p => <PostCard key={p.id} post={p} />)}
        </main>

        <div className="load-more">
          <button
            onClick={() => load(page + 1)}
            className="load-more-btn"
            disabled={loading}
          >
            {loading ? 'Yükleniyor…' : 'Daha Fazla Yükle'}
          </button>
        </div>
      </div>
    </div>
  );
}