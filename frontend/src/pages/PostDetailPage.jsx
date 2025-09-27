import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../services/api/posts';
import { getCommentsByPost } from '../services/api/comment';
import PostCard from '../components/posts/PostCard';
import '../styles/pages/post-detail.css';

export default function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          getPost(postId),
          getCommentsByPost(postId) // Değişiklik burada
        ]);
        setPost(postData);
        setComments(commentsData || []);
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
          <PostCard post={post} showComments={true} />
          
          <div className="comments-section">
            <h3>Yorumlar ({comments.length})</h3>
            {comments.length === 0 ? (
              <div className="empty-comments">Henüz yorum yok.</div>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}