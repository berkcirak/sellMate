import { useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
 const user = post.user || {};
 const images = post.imageUrls || [];
 const createdAt = new Date(post.createdAt);
 const navigate = useNavigate();
 // Image URL'lerini tam URL'ye çevir
 const getFullImageUrl = (url) => {
   if (!url) return '';
   if (url.startsWith('/uploads/')) {
     return `http://localhost:8080${url}`;
   }
   return url;
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
   return new Intl.NumberFormat('tr-TR', {
     style: 'currency',
     currency: 'TRY'
   }).format(price);
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

     {/* Product Info */}
     <div className="post-content">
       <div className="product-info">
         <h3 className="product-title">{post.title}</h3>
         <div className="product-meta">
           <span className="product-category">{getCategoryLabel(post.category)}</span>
           <span className="product-price">{formatPrice(post.price)}</span>
         </div>
         {post.description && (
           <p className="product-description">{post.description}</p>
         )}
       </div>
     </div>

     {/* Product Images */}
     {images.length > 0 ? (
       <div className="post-images">
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
           <button className="post-action post-action-like">
             <div className="post-action-icon">
               <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
             </div>
             <span className="post-action-count">0</span>
           </button>

           <button className="post-action post-action-comment">
             <div className="post-action-icon">
               <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
             </div>
             <span className="post-action-count">0</span>
           </button>
         </div>
       </div>
     </footer>
   </article>
 );
}