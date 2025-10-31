// frontend/src/components/posts/PostCard.jsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { likePost, unlikePost, getPostLikeCount, getMyLikes } from '../../services/api/like';
import { createComment, getCommentsByPost, updateComment, deleteCommentById } from '../../services/api/comment';
import { createOrder } from '../../services/api/order';
import { createOffer } from '../../services/api/offer';
import { getMyProfile } from '../../services/api/user';
import { updatePost, deletePost } from '../../services/api/posts';

let MY_LIKES_CACHE; // { loaded: boolean, postIds: Set<number> }

export default function PostCard({ post, commentsExpanded = false, onPostChanged }) {
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
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [commentActionLoading, setCommentActionLoading] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editDescription, setEditDescription] = useState(post.description || '');
  const [editPrice, setEditPrice] = useState(post.price || 0);
  const [editSaving, setEditSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    const loadCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMyProfile();
          if (userData?.id) setCurrentUser({ id: userData.id });
        } catch {
          //
        }
      }
    };
    loadCurrentUser();
  }, [post.user?.id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const count = await getPostLikeCount(post.id);
        if (mounted) setLikeCount(count ?? 0);
      } catch (e) {
        console.error('likeCount load error', e);}

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
      }  catch (e) {
        console.error('myLikes load error', e);}

      try {
        const list = await getCommentsByPost(post.id);
        if (mounted) {
          setCommentCount(Array.isArray(list) ? list.length : 0);
          setComments(Array.isArray(list) ? list : []);
        }
      }catch (e) {
        console.error('comments load error', e);}
    })();
    return () => { mounted = false; };
  }, [post.id]);

  const isOwner = !!(currentUser && currentUser.id === post.user?.id);

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
    } catch (e) {
      console.error('toggle like error', e);}
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
    } catch (e) {
      console.error('submit comment error', e);}
  };

  const handleBuyNow = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      setIsLoading(true);
      await createOrder(post.id);
      alert('Sipariş oluşturuldu! 2 gün içinde teslim edilecek.');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('aktif sipariş')) {
        alert('Bu ürün için zaten aktif sipariş bulunmaktadır.');
      } else {
        alert('Sipariş oluşturulamadı: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeOffer = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setShowOfferModal(true);
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!offerPrice || parseFloat(offerPrice) <= 0) {
      alert('Geçerli bir fiyat girin');
      return;
    }
    try {
      setIsLoading(true);
      await createOffer(post.id, parseFloat(offerPrice));
      alert('Teklif gönderildi! Satıcı onayını bekliyor.');
      setShowOfferModal(false);
      setOfferPrice('');
    } catch (error) {
      alert('Teklif gönderilemedi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEdit = () => {
    setEditTitle(post.title || '');
    setEditDescription(post.description || '');
    setEditPrice(post.price || 0);
    setEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!isOwner) return;
    try {
      setEditSaving(true);
      const payload = {
        title: editTitle,
        description: editDescription,
        price: editPrice
      };
      const updated = await updatePost(post.id, payload);
      setEditOpen(false);
      if (onPostChanged) onPostChanged({ type: 'updated', post: updated });
      alert('Gönderi güncellendi');
    } catch (e) {
      alert('Güncelleme başarısız: ' + (e.response?.data?.message || e.message));
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!isOwner) return;
    if (!window.confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;
    try {
      setDeleting(true);
      await deletePost(post.id);
      if (onPostChanged) onPostChanged({ type: 'deleted', id: post.id });
      alert('Gönderi silindi');
    } catch (e) {
      alert('Silme başarısız: ' + (e.response?.data?.message || e.message));
    } finally {
      setDeleting(false);
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
  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;
    if (!window.confirm('Yorumu silmek istiyor musunuz?')) return;
    try {
      setCommentActionLoading(true);
      await deleteCommentById(commentId);
      setComments(prev => prev.filter(x => x.id !== commentId));
      setCommentCount(c => Math.max(0, c - 1));
    } catch (e) {
      alert('Yorum silinemedi: ' + (e.response?.data?.message || e.message));
    } finally {
      setCommentActionLoading(false);
      setMenuOpenId(null);
    }
  };
  
  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.content || '');
    setMenuOpenId(null);
  };
  
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };
  
  const saveEditComment = async (e) => {
    e.preventDefault();
    if (!editingCommentId || !editCommentText.trim()) return;
    try {
      setCommentActionLoading(true);
      const updated = await updateComment(editingCommentId, editCommentText.trim());
      setComments(prev =>
        prev.map(c => (c.id === editingCommentId ? { ...c, content: updated?.content ?? editCommentText.trim() } : c))
      );
      cancelEditComment();
    } catch (e) {
      alert('Yorum güncellenemedi: ' + (e.response?.data?.message || e.message));
    } finally {
      setCommentActionLoading(false);
    }
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

      {isOwner && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e5e9', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleOpenEdit}
            style={{
              flex: 1,
              padding: '8px 16px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Düzenle
          </button>
          <button
            onClick={handleDeletePost}
            disabled={deleting}
            style={{
              flex: 1,
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: deleting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {deleting ? 'Siliniyor...' : 'Sil'}
          </button>
        </div>
      )}

      {!isOwner && currentUser && post.isAvailable && (
        <div className="post-purchase-actions" style={{
          padding: '12px 16px',
          borderTop: '1px solid #e1e5e9',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={handleBuyNow}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '8px 16px',
              backgroundColor: '#1da1f2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {isLoading ? 'İşleniyor...' : 'Hemen Al'}
          </button>

          <button
            onClick={handleMakeOffer}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '8px 16px',
              backgroundColor: '#17bf63',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Teklif Yap
          </button>
        </div>
      )}

      {!isOwner && currentUser && !post.isAvailable && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#f0f8ff',
          borderTop: '1px solid #e1e5e9',
          textAlign: 'center',
          color: '#1da1f2',
          fontSize: '14px'
        }}>
          Bu ürün için aktif sipariş bulunmaktadır
        </div>
      )}

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
          <div className="comments-section">
            <form onSubmit={onSubmitComment} className="comment-form">
              <textarea
                placeholder="Yorum yaz..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="comment-input"
                rows="1"
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                type="submit"
                className="comment-submit"
                disabled={commentLoading || !commentText.trim()}
              >
                {commentLoading ? (
                  <>
                    <div className="loading-spinner" style={{
                      width: '12px',
                      height: '12px',
                      border: '2px solid currentColor',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Gönderiliyor...
                  </>
                ) : (
                  'Gönder'
                )}
              </button>
            </form>

            <div className="comment-list">
              {commentLoading && comments.length === 0 ? (
                <div className="loading-state">Yorumlar yükleniyor…</div>
              ) : (comments.length === 0 ? (
                <div className="empty-state">Henüz yorum yok.</div>
              ) : (
                comments.map((c) => {
                  const cu = c.user || {};
                  const cDate = c.createdAt ? new Date(c.createdAt) : null;
                  return (
                    <div key={c.id} className="comment-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div className="comment-avatar">
                        {cu.profileImage ? (
                          <img src={getFullImageUrl(cu.profileImage)} alt="" />
                        ) : (
                          <div>{cu.firstName?.[0]}{cu.lastName?.[0]}</div>
                        )}
                      </div>

                      <div className="comment-body" style={{ flex: 1, minWidth: 0 }}>
                        <div className="comment-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong>{cu.firstName} {cu.lastName}</strong>
                          {cDate ? <span>• {formatDate(cDate)}</span> : null}
                          
                          {/* Sağ üst köşe – sadece yorumu yazan kişiye göster */}
                          {currentUser?.id === cu.id && (
                            <div style={{ marginLeft: 'auto', position: 'relative' }}>
                              <button
                                type="button"
                                onClick={() => setMenuOpenId(menuOpenId === c.id ? null : c.id)}
                                aria-label="Yorum menüsü"
                                style={{
                                  border: 'none', background: 'transparent', cursor: 'pointer',
                                  width: 28, height: 28, borderRadius: 14, display: 'grid', placeItems: 'center'
                                }}
                              >
                                ⋯
                              </button>
                              {menuOpenId === c.id && (
                                <div
                                  style={{
                                    position: 'absolute', right: 0, top: 28, background: '#fff',
                                    border: '1px solid #e5e7eb', borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    zIndex: 5, minWidth: 140, overflow: 'hidden'
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => startEditComment(c)}
                                    style={{ display: 'block', width: '100%', padding: '8px 12px', border: 0, background: 'white', cursor: 'pointer', textAlign: 'left' }}
                                  >
                                    Düzenle
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteComment(c.id)}
                                    disabled={commentActionLoading}
                                    style={{ display: 'block', width: '100%', padding: '8px 12px', border: 0, background: 'white', cursor: 'pointer', textAlign: 'left', color: '#dc2626' }}
                                  >
                                    {commentActionLoading ? 'Siliniyor…' : 'Sil'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* İçerik veya inline edit formu */}
                        {editingCommentId === c.id ? (
                          <form onSubmit={saveEditComment} style={{ display: 'grid', gap: '8px' }}>
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              rows={3}
                              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                              autoFocus
                            />
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                onClick={cancelEditComment}
                                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                              >
                                İptal
                              </button>
                              <button
                                type="submit"
                                disabled={commentActionLoading || !editCommentText.trim()}
                                style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#f59e0b', color: '#fff', cursor: 'pointer' }}
                              >
                                {commentActionLoading ? 'Kaydediliyor…' : 'Kaydet'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="comment-content">{c.content}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        ) : null}
      </footer>

      {showOfferModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>
              Teklif Yap - {post.title}
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#666' }}>
              Liste fiyatı: {formatPrice(post.price)}
            </p>

            <form onSubmit={handleSubmitOffer}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  Teklif Fiyatı (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Teklif fiyatınızı girin"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: '#17bf63',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Gönderiliyor...' : 'Teklif Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleSaveEdit} style={{
            backgroundColor: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 420
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Gönderiyi Düzenle</h3>
            <div style={{ marginBottom: 12 }}>
              <label>Başlık</label>
              <input value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label>Açıklama</label>
              <textarea value={editDescription} onChange={(e)=>setEditDescription(e.target.value)} rows={4} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label>Fiyat</label>
              <input type="number" step="0.01" min="0" value={editPrice} onChange={(e)=>setEditPrice(e.target.value)} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={()=>setEditOpen(false)} style={{ padding: '8px 16px', background: '#f5f5f5', border: 0, borderRadius: 4, cursor: 'pointer' }}>İptal</button>
              <button type="submit" disabled={editSaving} style={{ padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 0, borderRadius: 4, cursor: editSaving ? 'not-allowed' : 'pointer' }}>
                {editSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}