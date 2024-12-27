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
const StorePage = React.lazy(() => import('./pages/Store.tsx'));
const AdminPage = React.lazy(() => import('./pages/Admin.tsx'));
import Login from './components/Login';
import GoToTop from './components/GoToTOP';
import NavBar from './components/NavBar';
import './styles/App.css';
import { Container } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

interface AppProps {
  queryClient: QueryClient;
}

const App: React.FC<AppProps> = ({ queryClient }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const { isLoading: isLoadinUserInfo, isPending: isPendingUserInfo, data: dataUserInfo, refetch: refetchUserInfo } = useQuery({
    queryKey: [`UserInfo`],
    queryFn: () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      return fetch('/api/User/GetUser', {
        headers: {
          'Authorization': `${token ? ('Bearer ' + token) : ''}`,
        },
      }).then((res) => {
        if (!res.ok) {
          localStorage.removeItem('token');
          return null;
        }
        return res.json();
      })
    },
  });


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

  const requiredLoginPaths = ['/cart', '/cartresult', '/user'];

  useEffect(() => {
    if (isModalOpen === undefined) return;
    if (isModalOpen) {
      handleLogout();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      if (requiredLoginPaths.includes(window.location.pathname)) {
        setIsModalOpen(true);
      }
    }
  }, [localStorage, localStorage.getItem('token')]);

  return (
    <>
      <GoToTop />
      <Router>
        <NavBar
          theme={theme}
          setIsModalOpen={setIsModalOpen}
          toggleTheme={toggleTheme}
          handleLogout={handleLogout}
          isPendingUserInfo={isPendingUserInfo}
          dataUserInfo={dataUserInfo}
          refetchUserInfo={refetchUserInfo}
        />

        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<Cart setIsModalOpen={setIsModalOpen} />} />
            <Route path="/cartresult" element={<CartResult />} />
            <Route path="/user" element={<UserPage isLoading={isLoadinUserInfo} isPending={isPendingUserInfo} data={dataUserInfo} refetch={refetchUserInfo} />} />
            <Route path="/product/:id" element={<ProductResult />} />
            <Route path="/products/:id" element={<Navigate to="/product/:id" />} />
            <Route path="/PVC/:id" element={<ProductPVCResult />} />
            <Route path="/profile" element={<Navigate to="/user?tab=profile" />} />
            <Route path="/rickroll" element={<RickROll />} />
            <Route path="/c0" element={<C0 />} />
            <Route path="/c8763" element={<C8763 />} />
            <Route path="/orders" element={<Navigate to="/user?tab=orders" />} />
            <Route path="/changePassword" element={<Navigate to="/user?tab=profile&changePassword=true" />} />
            <Route path="/store/:storeID" element={<StorePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/*" element={<img src="https://http.cat/images/404.jpg" alt="404 Not Found" style={{ width: '100%', height: '100%' }} />} />
          </Routes>
        </Container>
        <Login
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          refetchUserInfo={refetchUserInfo}
          dataUserInfo={dataUserInfo}
        />
      </Router>
    </>
  );
};

export default App;