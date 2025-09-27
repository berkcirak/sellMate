import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { likePost, unlikePost, getPostLikeCount, getMyLikes } from '../../services/api/like';
import { createComment, getCommentsByPost } from '../../services/api/comment';

let MY_LIKES_CACHE; // { loaded: boolean, postIds: Set<number> }

export default function PostCard({ post, commentsExpanded = false }) {
 const user = post.user || {};
 const images = post.imageUrls || [];
 const createdAt = new Date(post.createdAt);
 const navigate = useNavigate();
 const [likeCount, setLikeCount] = useState(typeof post.likeCount === 'number' ? post.likeCount : 0);
 const [liked, setLiked] = useState(false);

 const [commentOpen, setCommentOpen] = useState(commentsExpanded);
 const [comments, setComments] = useState([]);
 const [commentLoading, setCommentLoading] = useState(false);
 const [commentText, setCommentText] = useState('');
 const [commentCount, setCommentCount] = useState(0);

 const getFullImageUrl = (url) => {
   if (!url) return '';
   if (url.startsWith('/uploads/')) {
     return `http://localhost:8080${url}`;
   }
   return url;
 };
 const handlePostClick = () => {
  navigate(`/post/${post.id}`);
};
 useEffect(() => {
   let mounted = true;
   (async () => {
     try {
       const count = await getPostLikeCount(post.id);
       if (mounted) setLikeCount(count ?? 0);
     } catch {
      //
     }
     // Load my likes once and cache
     try {
       if (!MY_LIKES_CACHE || !MY_LIKES_CACHE.loaded) {
         const myLikes = await getMyLikes();
         MY_LIKES_CACHE = {
           loaded: true,
           postIds: new Set((myLikes || []).map(l => l.post?.id ?? l.postId).filter(Boolean)),
         };
       }
       if (mounted && MY_LIKES_CACHE?.postIds?.has(post.id)) {
         setLiked(true);
       }
     } catch {
      //
     }
     // Preload comments to get accurate count
     try {
       const list = await getCommentsByPost(post.id);
       if (mounted) {
         setCommentCount(Array.isArray(list) ? list.length : 0);
         // don't open list yet; keep comments cached for quick open
         setComments(Array.isArray(list) ? list : []);
       }
     } catch {
      //
      }
   })();
   return () => { mounted = false; };
 }, [post.id]);

 const onToggleLike = async () => {
   try {
     if (liked) {
       await unlikePost(post.id);
       setLiked(false);
       setLikeCount((c) => Math.max(0, c - 1));
       if (MY_LIKES_CACHE?.postIds) MY_LIKES_CACHE.postIds.delete(post.id);
     } else {
       await likePost(post.id);
       setLiked(true);
       setLikeCount((c) => c + 1);
       if (MY_LIKES_CACHE?.postIds) MY_LIKES_CACHE.postIds.add(post.id);
     }
   } catch {
    //
   }
 };

 const loadComments = async () => {
   try {
     setCommentLoading(true);
     const list = await getCommentsByPost(post.id);
     setComments(Array.isArray(list) ? list : []);
     setCommentCount(Array.isArray(list) ? list.length : 0);
   } finally {
     setCommentLoading(false);
   }
 };

 const onToggleComments = async () => {
   const next = !commentOpen;
   setCommentOpen(next);
   if (next && comments.length === 0) {
     await loadComments();
   }
 };

 const onSubmitComment = async (e) => {
   e.preventDefault();
   const content = commentText.trim();
   if (!content) return;
   try {
     const created = await createComment({ postId: post.id, content });
     if (created) {
       setComments((prev) => [created, ...prev]);
       setCommentCount((c) => c + 1);
     } else {
       await loadComments();
     }
     setCommentText('');
   } catch {
    //
   }
 };

 const formatDate = (date) => {
   const now = new Date();
   const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
   if (diffInHours < 1) return 'Az önce';
   if (diffInHours < 24) return `${diffInHours} saat önce`;
   if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} gün önce`;
   return date.toLocaleDateString('tr-TR');
 };

 const formatPrice = (price) => {
   return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
 };

 const getCategoryLabel = (category) => {
   const categories = {
     'ELECTRONICS': 'Elektronik',
     'CLOTHING': 'Giyim',
     'HOME': 'Ev & Yaşam',
     'SPORTS': 'Spor',
     'BOOKS': 'Kitap',
     'VEHICLES': 'Araç',
     'OTHER': 'Diğer'
   };
   return categories[category] || category;
 };

 return (
  <article className="post-card">
    <header className="post-header" style={{ cursor: user.id ? 'pointer' : 'default' }}
      onClick={() => user.id && navigate(`/profile/${user.id}`)}>
      <div className="post-avatar">
        {user.profileImage ? (
          <img src={getFullImageUrl(user.profileImage)} alt="" />
        ) : (
          <div className="post-avatar-initials">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        )}
        <div className="post-status"></div>
      </div>
      <div className="post-info">
        <div className="post-name">
          {user.firstName} {user.lastName}
          <span className="post-time"> • {formatDate(createdAt)}</span>
        </div>
        <div className="post-username">@{user.email?.split('@')[0]}</div>
      </div>
    </header>

    <div className="post-content" style={{ cursor: 'pointer' }} onClick={handlePostClick}>
      <div className="product-info">
        <h3 className="product-title">{post.title}</h3>
        <div className="product-meta">
          <span className="product-category">{getCategoryLabel(post.category)}</span>
          <span className="product-price">{formatPrice(post.price)}</span>
        </div>
        {post.description ? <p className="product-description">{post.description}</p> : null}
      </div>
    </div>

    {images.length > 0 ? (
      <div className="post-images" style={{ cursor: 'pointer' }} onClick={handlePostClick}>
        {images.length === 1 ? (
          <div className="post-image-single">
            <img src={getFullImageUrl(images[0])} alt={post.title} />
          </div>
        ) : images.length === 2 ? (
          <div className="post-image-grid">
            {images.map((src, i) => (
              <img key={i} src={getFullImageUrl(src)} alt={`${post.title} ${i + 1}`} />
            ))}
          </div>
        ) : (
          <div className="post-image-grid">
            <img src={getFullImageUrl(images[0])} alt={post.title} />
            <div className="post-image-overlay">
              <img src={getFullImageUrl(images[1])} alt={`${post.title} 2`} />
              <div className="post-image-count">+{images.length - 2}</div>
            </div>
          </div>
        )}
      </div>
    ) : null}

    <footer className="post-footer">
      <div className="post-actions">
        <div className="post-action-group">
          <button className="post-action post-action-like" onClick={onToggleLike} style={{ color: liked ? '#e0245e' : undefined }}>
            <div className="post-action-icon">
              <svg width="20" height="20" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="post-action-count">{likeCount}</span>
          </button>

          <button className="post-action post-action-comment" onClick={onToggleComments}>
            <div className="post-action-icon">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="post-action-count">{commentCount}</span>
          </button>
        </div>
      </div>

      {commentOpen ? (
        <div className="comments-section" style={{ marginTop: 12 }}>
          <form onSubmit={onSubmitComment} className="comment-form" style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Yorum yaz..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
              style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
            />
            <button type="submit" className="comment-submit" disabled={commentLoading || !commentText.trim()} style={{ padding: '8px 12px', borderRadius: 6 }}>
              Gönder
            </button>
          </form>

          <div className="comment-list" style={{ marginTop: 10 }}>
            {commentLoading && comments.length === 0 ? (
              <div className="loading-state">Yorumlar yükleniyor…</div>
            ) : (comments.length === 0 ? (
              <div className="empty-state">Henüz yorum yok.</div>
            ) : (
              comments.map((c) => {
                const cu = c.user || {};
                const cDate = c.createdAt ? new Date(c.createdAt) : null;
                return (
                  <div key={c.id} className="comment-item" style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div className="comment-avatar" style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: '#eee', flex: '0 0 32px' }}>
                      {cu.profileImage ? (
                        <img src={getFullImageUrl(cu.profileImage)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                          {cu.firstName?.[0]}{cu.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="comment-body" style={{ flex: 1 }}>
                      <div className="comment-meta" style={{ fontSize: 12, color: '#666' }}>
                        <strong>{cu.firstName} {cu.lastName}</strong>
                        {cDate ? <span> • {formatDate(cDate)}</span> : null}
                      </div>
                      <div className="comment-content" style={{ marginTop: 4 }}>
                        {c.content}
                      </div>
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  </article>
);
}