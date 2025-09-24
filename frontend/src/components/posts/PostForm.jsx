import { useState } from 'react';
import Modal from '../ui/Modal';
import '../../styles/components/modal.css';
import '../../styles/components/post-form.css';
const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Elektronik' },
  { value: 'CLOTHING', label: 'Giyim' },
  { value: 'HOME', label: 'Ev & Yaşam' },
  { value: 'SPORTS', label: 'Spor' },
  { value: 'BOOKS', label: 'Kitap' },
  { value: 'VEHICLES', label: 'Araç' },
  { value: 'FURNITURE', label: 'Mobilya' },
  { value: 'APPLIANCES', label: 'Beyaz Eşya' },
  { value: 'BEAUTY', label: 'Kozmetik & Kişisel Bakım' },
  { value: 'TOYS', label: 'Oyuncak' },
  { value: 'PET_SUPPLIES', label: 'Evcil Hayvan' },
  { value: 'GROCERIES', label: 'Market' },
  { value: 'HOBBIES', label: 'Hobi' },
  { value: 'ART', label: 'Sanat' },
  { value: 'MUSIC', label: 'Müzik' },
  { value: 'GARDEN', label: 'Bahçe' },
  { value: 'OFFICE', label: 'Ofis & Kırtasiye' },
  { value: 'JEWELRY', label: 'Takı & Aksesuar' },
  { value: 'SHOES', label: 'Ayakkabı' },
  { value: 'BABY', label: 'Anne & Bebek' },
  { value: 'OTHER', label: 'Diğer' }
];

export default function PostForm({ onSubmit, loading = false, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: []
  });

  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('description', formData.description);
    postData.append('price', formData.price);
    postData.append('category', formData.category);
    
    formData.images.forEach((image) => {
      postData.append('images', image);
    });

    onSubmit(postData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      images: []
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-header">
        <h3 className="modal-title">Yeni İlan Paylaş</h3>
        <button className="modal-close" onClick={onClose}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="modal-body">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label className="form-label">Ürün Başlığı</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Örn: iPhone 14 Pro Max 256GB"
              required
              minLength={3}
              maxLength={70}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Açıklama</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input form-textarea"
              placeholder="Ürününüz hakkında detaylı bilgi verin..."
              required
              minLength={10}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fiyat</label>
            <div className="price-input-group">
              <span className="price-symbol">₺</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input price-input"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input form-select"
              required
            >
              <option value="">Kategori seçin</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Ürün Fotoğrafları</label>
            <div
              className={`image-upload ${dragOver ? 'dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('image-input').click()}
            >
              <div className="image-upload-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="image-upload-text">Fotoğraf ekle</div>
              <div className="image-upload-hint">Sürükle bırak veya tıkla (max 5 fotoğraf)</div>
            </div>

            <input
              id="image-input"
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {formData.images.length > 0 && (
              <div className="image-preview">
                {formData.images.map((image, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="image-preview-remove"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="form-btn form-btn-secondary"
              onClick={resetForm}
              disabled={loading}
            >
              Temizle
            </button>
            <button
              type="submit"
              className="form-btn form-btn-primary"
              disabled={loading}
            >
              {loading ? 'Paylaşılıyor...' : 'Paylaş'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}