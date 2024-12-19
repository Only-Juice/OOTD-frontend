import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
const Home = React.lazy(() => import('./pages/Home'));
const Cart = React.lazy(() => import('./pages/Cart.tsx'));
const UserPage = React.lazy(() => import('./pages/UserPage'));
const SearchResults = React.lazy(() => import('./pages/SearchResults'));
const ProductResult = React.lazy(() => import('./pages/ProductResult'));
const C8763 = React.lazy(() => import('./pages/StarBurstStream.tsx'));
const ProductPVCResult = React.lazy(() => import('./pages/ProductPVCResult'));
const Register = React.lazy(() => import('./pages/Register.tsx'));
const CartResult = React.lazy(() => import('./pages/CartResult.tsx'));
const RickROll = React.lazy(() => import('./pages/NeverGonnaGiveYouUp'));
const C0 = React.lazy(() => import('./pages/YaoDong.tsx'));
import Login from './components/Login';
import GoToTop from './components/GoToTOP';
import NavBar from './components/NavBar';
import './styles/App.css';
import { Container } from 'react-bootstrap';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BriefStoreSearch from './components/BriefStoreSearch.tsx';


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

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      setIsModalOpen(true);
    }
  }, [localStorage, localStorage.getItem('token')]);

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
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/searchStore" element={<BriefStoreSearch />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cartresult" element={<CartResult />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/product/:id" element={<ProductResult />} />
            <Route path="/products/:id" element={<Navigate to="/product/:id" />} />
            <Route path="/PVC/:id" element={<ProductPVCResult />} />
            <Route path="/profile" element={<Navigate to="/user?tab=profile" />} />
            <Route path="/rickroll" element={<RickROll />} />
            <Route path="/c0" element={<C0 />} />
            <Route path="/c8763" element={<C8763 />} />
            <Route path="/orders" element={<Navigate to="/user?tab=orders" />} />
            <Route path="/changePassword" element={<Navigate to="/user?tab=profile&changePassword=true" />} />
            <Route path="/*" element={<img src="https://http.cat/images/404.jpg" alt="404 Not Found" style={{ width: '100%', height: '100%' }} />} />
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