// frontend/src/pages/PostDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../services/api/posts';
import PostCard from '../components/posts/PostCard';
import '../styles/pages/post-detail.css';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = await getPost(postId);
        setPost(postData);
      } catch (e) {
        console.error('Error fetching post:', e);
        setError('Gönderi yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  if (loading) return <div className="post-detail-page"><div className="loading">Yükleniyor…</div></div>;
  if (error) return <div className="post-detail-page"><div className="error">{error}</div></div>;
  if (!post) return <div className="post-detail-page"><div className="error">Gönderi bulunamadı</div></div>;

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <div className="back-link">
          <Link to="/feed" className="back-button">
            ← Geri Dön
          </Link>
        </div>
        
        <div className="post-detail-content">
          <PostCard post={post} showComments={true} commentsExpanded={true} />
        </div>
      </div>
    </div>
  );
}