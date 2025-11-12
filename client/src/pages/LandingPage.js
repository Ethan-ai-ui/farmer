import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { recordQuestion, saveTip } = useUserData();

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [lastExchange, setLastExchange] = useState(null);
  const [tipSaved, setTipSaved] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');
    setTipSaved(false);

    try {
      const apiUrl = 'https://farmer-8aje.onrender.com/api/chat';
      const res = await axios.post(apiUrl, { message: query });
      const answer = res.data.response;
      setResponse(answer);
      setLastExchange({ prompt: query, answer });
      recordQuestion(query, answer);
      setQuery('');
    } catch (err) {
      console.error('API Error:', err);

      if (err.response) {
        const errorMsg = err.response.data?.error || 'Failed to get a response. Please try again.';
        setError(errorMsg);
      } else if (err.request) {
        setError(
          'Cannot connect to server. Make sure the backend is running on port 5000. Run "npm run server" in a separate terminal.'
        );
      } else {
        setError(`Error: ${err.message || 'An unexpected error occurred. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTip = () => {
    if (!lastExchange) {
      return;
    }
    saveTip(lastExchange.prompt, lastExchange.answer);
    setTipSaved(true);
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);

    switch (action) {
      case 'login':
        navigate('/login');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'logout':
        logout();
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div className="top-menu" ref={menuRef}>
        <button
          className="menu-button"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="Open menu"
        >
          ☰
        </button>
        {showMenu && (
          <div className="menu-dropdown">
            {isAuthenticated ? (
              <>
                <button className="menu-item" onClick={() => handleMenuAction('dashboard')}>
                  Dashboard
                </button>
                <button className="menu-item" onClick={() => handleMenuAction('logout')}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button className="menu-item" onClick={() => handleMenuAction('login')}>
                  Log In
                </button>
                <button className="menu-item" onClick={() => handleMenuAction('signup')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="container">
        <h1 className="title">
          {isAuthenticated ? `Hello ${currentUser?.name || 'Farmer'}!` : 'Farmer AI Search'}
        </h1>
        <p className="subtitle">
          {isAuthenticated
            ? 'Ask anything to your personal farming assistant.'
            : 'Ask any farming question'}
        </p>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about farming..."
              className="search-input"
              disabled={loading}
            />
            <button type="submit" className="search-button" disabled={loading || !query.trim()}>
              {loading ? '...' : '→'}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {response && (
          <div className="response-container">
            <div className="response-text">{response}</div>
            {isAuthenticated && (
              <div className="response-actions">
                <button
                  type="button"
                  className="response-save"
                  onClick={handleSaveTip}
                  disabled={tipSaved}
                >
                  {tipSaved ? 'Saved to dashboard' : 'Save to dashboard'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;


