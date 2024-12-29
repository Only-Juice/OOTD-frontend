import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
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
const Message = React.lazy(() => import('./pages/Message.tsx'));
const AboutUs = React.lazy(() => import('./pages/AboutUs.tsx'));
import GoToTop from './components/GoToTOP';
import './styles/App.css';
import { useQuery } from '@tanstack/react-query';
import Layout from './components/Layout.tsx';

const App: React.FC = () => {
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
  return (
    <>
      <GoToTop />
      <Router>
        <Routes>
          <Route path="/" element={<Layout isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} theme={theme} setTheme={setTheme} isPendingUserInfo={isPendingUserInfo} dataUserInfo={dataUserInfo} refetchUserInfo={refetchUserInfo} />}>
            <Route index element={<React.Suspense fallback={<div>Loading...</div>}><Home /></React.Suspense>} />
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
            <Route path="/message" element={<Message setIsModalOpen={setIsModalOpen} />} />
            <Route path="/orders" element={<Navigate to="/user?tab=orders" />} />
            <Route path="/changePassword" element={<Navigate to="/user?tab=profile&changePassword=true" />} />
            <Route path="/store/:storeID" element={<StorePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/*" element={<img src="https://http.cat/images/404.jpg" alt="404 Not Found" style={{ width: '100%', height: '100%' }} />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;