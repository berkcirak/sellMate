import { useState, useEffect } from 'react';
import { getMyWallet, depositWallet, withdrawWallet } from '../services/api/wallet';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [iban, setIban] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      setLoading(true);
      const walletData = await getMyWallet();
      setWallet(walletData);
    } catch (error) {
      console.error('Cüzdan yüklenemedi:', error);
      alert('Cüzdan bilgileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Geçerli bir miktar girin');
      return;
    }

    try {
      setIsDepositing(true);
      await depositWallet(parseFloat(depositAmount));
      alert('Para yükleme başarılı!');
      setDepositAmount('');
      await loadWallet(); // Cüzdanı yenile
    } catch (error) {
      alert('Para yüklenemedi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Geçerli bir miktar girin');
      return;
    }
    if (!iban || iban.trim().length < 10) {
      alert('Geçerli bir IBAN girin');
      return;
    }

    try {
      setIsWithdrawing(true);
      await withdrawWallet(parseFloat(withdrawAmount));
      alert('Para çekme işlemi başarılı!');
      setWithdrawAmount('');
      setIban('');
      await loadWallet(); // Cüzdanı yenile
    } catch (error) {
      alert('Para çekilemedi: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: wallet?.currency || 'TRY' 
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Cüzdan yükleniyor...</div>
      </div>
    );
  }
  const formatIban = (value) => {
   // Sadece rakam al
   const cleanValue = value.replace(/[^0-9]/g, '');
   
   // 26 rakam formatında göster (XX XXXX XXXX XXXX XXXX XXXX XX)
   if (cleanValue.length > 0) {
     // İlk 2 rakam ayrı, sonra 4'lü gruplar
     let formatted = cleanValue;
     if (cleanValue.length > 2) {
       formatted = cleanValue.substring(0, 2) + ' ' + 
                   cleanValue.substring(2).replace(/(.{4})/g, '$1 ');
     }
     return formatted.trim();
   }
   return '';
 };
 return (
  <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
    <h1 style={{ marginBottom: '30px', color: '#333' }}>Cüzdanım</h1>

    {/* Cüzdan Bilgileri */}
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      border: '1px solid #e9ecef'
    }}>
      <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Bakiye</h2>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
        {formatPrice(wallet?.balance || 0)}
      </div>
      <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
        Para birimi: {wallet?.currency || 'TRY'}
      </div>
    </div>

    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
      {/* Para Yükleme */}
      <div style={{
        backgroundColor: '#e8f5e8',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #c3e6c3',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#155724' }}>Para Yükle</h3>
        <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Miktar (₺)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Yüklenecek miktar"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button
              type="submit"
              disabled={isDepositing}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isDepositing ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isDepositing ? 'Yükleniyor...' : 'Para Yükle'}
            </button>
          </div>
        </form>
      </div>

      {/* Para Çekme */}
      <div style={{
        backgroundColor: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ffeaa7',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>Para Çek</h3>
        <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Miktar (₺)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Çekilecek miktar"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              IBAN
            </label>
            <input
              type="text"
              value={formatIban(iban)}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^0-9]/g, '');
                if (cleanValue.length <= 26) {
                  setIban(cleanValue);
                }
              }}
              onKeyPress={(e) => {
                const char = String.fromCharCode(e.which);
                if (!/[0-9]/.test(char)) {
                  e.preventDefault();
                }
              }}
              placeholder="TR00 0000 0000 0000 0000 0000 00"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
              maxLength={30}
              required
            />
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button
              type="submit"
              disabled={isWithdrawing}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#ffc107',
                color: '#212529',
                border: 'none',
                borderRadius: '4px',
                cursor: isWithdrawing ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isWithdrawing ? 'Çekiliyor...' : 'Para Çek'}
            </button>
          </div>
        </form>
      </div>
    </div>

    {/* İşlem Geçmişi (opsiyonel) */}
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>Son İşlemler</h3>
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        border: '1px solid #e9ecef',
        textAlign: 'center',
        color: '#666'
      }}>
        İşlem geçmişi yakında eklenecek
      </div>
    </div>
  </div>
);
}