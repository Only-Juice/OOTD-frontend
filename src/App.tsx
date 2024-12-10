import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Modal from 'react-modal';
import Home from './Home';
import Search from './Search';
import Cart from './Cart';
import Login from './Login';
import UserPage from './UserPage';
import NavBar from './NavBar';
import SearchResults from './SearchResults';
import './App.css';
import { Product, User, UserInfo } from './types';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/Product/GetAllProducts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleLogin = () => {
    fetch('/api/User/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Email: email, Password: password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.Status) {
          console.log('Login successful:', data);
          localStorage.setItem('token', data.Message);
          setIsModalOpen(false);
          fetchUserInfo(data.Message);
        } else {
          throw new Error('Login failed');
        }
      })
      .catch(error => console.error('Error logging in:', error));
  };

  const fetchUserInfo = (token: string) => {
    fetch('/api/User/Get', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // Token 過期或無效
            handleLogout();
          }
          throw new Error('Failed to fetch user info');
        }
        return response.json();
      })
      .then(data => {
        if (data.Status) {
          setUser(data);
          setUserInfo(data);
        }
        else {
          handleLogout();
        }
      })
      .catch(error => console.error('Error fetching user info:', error));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    }

    // 自動判斷瀏覽器的主題
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDarkScheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', prefersDarkScheme ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserInfo(null);
  };

  return (
    <Router>
      <div className={`${theme === 'dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
        <NavBar
          user={user}
          theme={theme}
          setIsModalOpen={setIsModalOpen}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          setResults={setSearchResults}
          setError={setSearchError}
        />

        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/search" element={<Search setResults={setSearchResults} setError={setSearchError} />} />
          <Route path="/search-results" element={<SearchResults searchResults={searchResults} searchError={searchError} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<UserPage userInfo={userInfo} />} />
        </Routes>

        <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal-content">
          <h2>Login</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </form>
        </Modal>
      </div>
    </Router>
  );
};

export default App;