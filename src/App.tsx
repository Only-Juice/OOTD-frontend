import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const Home = React.lazy(() => import('./components/Home'));
const Cart = React.lazy(() => import('./components/Cart'));
const Login = React.lazy(() => import('./components/Login'));
const UserPage = React.lazy(() => import('./components/UserPage'));
const NavBar = React.lazy(() => import('./components/NavBar'));
const SearchResults = React.lazy(() => import('./components/SearchResults'));
const ProductResult = React.lazy(() => import('./components/ProductResult'));
import './styles/App.css';
import { Product, User, UserInfo } from './types';
import { Container } from 'react-bootstrap';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');



  const fetchUserInfo = (token: string) => {
    fetch('/api/User/Get', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            handleLogout();
          }
          throw new Error('Failed to fetch user info');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
        setUserInfo(data);
      })
      .catch(error => console.error('Error fetching user info:', error));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    }

    // Automatically detect browser theme
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

  useEffect(() => {
    if (isModalOpen) {
      handleLogout();
    }
  }, [isModalOpen]);

  return (
    <Router>
      <NavBar
        user={user}
        theme={theme}
        setIsModalOpen={setIsModalOpen}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
      />

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user" element={<UserPage userInfo={userInfo} fetchUserInfo={fetchUserInfo} setIsModalOpen={setIsModalOpen} />} />
          <Route path="/product/:id" element={<ProductResult />} />
          <Route path="/*" element={<img src="https://http.cat/images/404.jpg" alt="404 Not Found" />} />
        </Routes>
      </Container>
      <Login
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fetchUserInfo={fetchUserInfo}
      />

    </Router>
  );
};

export default App;