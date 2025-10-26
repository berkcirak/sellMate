// frontend/src/components/layout/Navbar.jsx
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyProfile } from '../../services/api/user';
import { getMyWallet } from '../../services/api/wallet';
import '../../styles/components/layout.css';
import '../../styles/components/navbar.css';

export default function Navbar() {
  const [q, setQ] = useState('');
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    setQ(sp.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [userData, walletData] = await Promise.all([
        getMyProfile(),
        getMyWallet()
      ]);
      setUser(userData);
      setWallet(walletData);
    } catch (error) {
      console.error('Kullanıcı verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const submit = useCallback(() => {
    const query = q.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [q, navigate]);

  const onKey = (e) => {
    if (e.key === 'Enter') submit();
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/profile/${user.id}`);
    }
  };

  const handleWalletClick = () => {
    navigate('/wallet');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: wallet?.currency || 'TRY' 
    }).format(price);
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
      
      <div className="navbar-right">
        {!loading && (
          <>
            {/* Bakiye - tıklanabilir */}
            <div className="wallet-balance" onClick={handleWalletClick} style={{ cursor: 'pointer' }}>
              <span className="balance-amount">
                {formatPrice(wallet?.balance || 0)}
              </span>
            </div>
            
            {/* Kullanıcı Adı */}
            <div className="user-profile" onClick={handleProfileClick}>
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}