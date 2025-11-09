import { useState } from 'react';
import axios from 'axios';
import { WalletCard } from './components/WalletCard';
import { WalletAnalysis } from './types';
import './App.css';

function App() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WalletAnalysis | null>(null);

  const analyzeWallet = async () => {
    if (!address.trim()) {
      setError('Please enter a Solana wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await axios.get(`/api/analyze/${address.trim()}`);

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to analyze wallet');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to analyze wallet. Please check the address and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeWallet();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Solana Card</h1>
        <p>Generate a beautiful profile card for any Solana wallet</p>
      </div>

      <div className="container">
        <div className="input-section">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Solana wallet address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              className="btn"
              onClick={analyzeWallet}
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Generate Card'}
            </button>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing wallet on Solana blockchain...</p>
          </div>
        )}

        {data && !loading && (
          <div className="result-section">
            <WalletCard data={data} />

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Wallet Tier</div>
                <div className="stat-value highlight">{data.whaleStatus.tier}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">SOL Balance</div>
                <div className="stat-value">{data.whaleStatus.solBalance.toFixed(4)}</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Days on Solana</div>
                <div className="stat-value">
                  {data.ogStatus.daysSinceFirst !== null
                    ? data.ogStatus.daysSinceFirst
                    : 'N/A'}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Last Active</div>
                <div className="stat-value">
                  {data.lastSeen.daysSinceLast !== null
                    ? data.lastSeen.daysSinceLast === 0
                      ? 'Today'
                      : `${data.lastSeen.daysSinceLast}d ago`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
