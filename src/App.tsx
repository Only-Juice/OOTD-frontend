import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
const Home = React.lazy(() => import('./components/Home'));
const Cart = React.lazy(() => import('./components/Cart'));
const Login = React.lazy(() => import('./components/Login'));
const UserPage = React.lazy(() => import('./components/UserPage'));
const NavBar = React.lazy(() => import('./components/NavBar'));
const SearchResults = React.lazy(() => import('./components/SearchResults'));
const ProductResult = React.lazy(() => import('./components/ProductResult'));
import './styles/App.css';
import { Container } from 'react-bootstrap';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GoToTop from './components/GoToTOP';


const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const queryClient = new QueryClient();


  useEffect(() => {
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
    queryClient.invalidateQueries();
  };

  useEffect(() => {
    if (isModalOpen === undefined) return;
    if (isModalOpen) {
      handleLogout();
    }
  }, [isModalOpen]);

  return (
    <QueryClientProvider client={queryClient}>
      <GoToTop />
      <Router>
        <NavBar
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
            <Route path="/user" element={<UserPage setIsModalOpen={setIsModalOpen} />} />
            <Route path="/product/:id" element={<ProductResult />} />
            <Route path="/profile" element={<Navigate to="/user?tab=profile" />} />
            <Route path="/orders" element={<Navigate to="/user?tab=orders" />} />
            <Route path="/*" element={<img src="https://http.cat/images/404.jpg" alt="404 Not Found" />} />
          </Routes>
        </Container>
        <Login
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />

      </Router>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider >
  );
};

export default App;