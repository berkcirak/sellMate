// frontend/src/components/layout/Navbar.jsx
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/components/layout.css';
import '../../styles/components/navbar.css';

export default function Navbar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    setQ(sp.get('q') || '');
  }, [location.search]);

  const submit = useCallback(() => {
    const query = q.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [q, navigate]);

  const onKey = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="top-navbar">
      
      <div className="navbar-center">
        <div className="searchbar">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Kullanıcı veya ilan ara…"
            className="search-input"
            aria-label="Ara"
          />
          <button className="search-btn" onClick={submit} aria-label="Ara">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M21 21l-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="currentColor" fill="none" strokeWidth="2"/></svg>
          </button>
        </div>
      </div>
      <div className="navbar-right"></div>
    </div>
  );
}