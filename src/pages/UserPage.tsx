import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Card, Spin, Layout, Grid } from 'antd';
import UserProfile from '../components/UserProfile';
import UserOrders from '../components/UserOrders'; // Assuming you have this component
import UserBadge from '../components/UserBadge';
import UserReport from '../components/UserReport';
// import UserSettings from './UserSettings'; // Assuming you have this component
import ChangePassword from '../components/ChangePassword';
import { UserInfo } from '../types';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
const { useBreakpoint } = Grid;

interface UserPageProps {
    isLoading: boolean;
    isPending: boolean;
    data: UserInfo;
    refetch: () => void;
}

const UserPage: React.FC<UserPageProps> = ({ isLoading, isPending, data, refetch }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);
    const changePassword = queryParams.get('changePassword');
    const screens = useBreakpoint();

    useEffect(() => {
        const newQueryParams = new URLSearchParams(queryParams.toString());
        if (queryParams.get('changePassword') && activeKey !== 'profile') {
            newQueryParams.delete('changePassword');
        }
        newQueryParams.set('tab', activeKey);
        navigate(`?${newQueryParams.toString()}`, { replace: true });
    }, [activeKey]);

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    const changeActiveKey = (key: string) => {
        const newQueryParams = new URLSearchParams(queryParams.toString());
        newQueryParams.delete('changePassword');
        newQueryParams.set('tab', key);
        navigate(`?${newQueryParams.toString()}`, { replace: true });
        setActiveKey(key);
    }

    const menuItems = [
        { key: 'profile', label: '編輯個人檔案' },
        { key: 'orders', label: '我的訂單' },
        { key: 'request', label: '我的回報' },
    ]


    return (
        <Spin spinning={isPending}>
            <Card title="用戶頁面" className="mt-2">
                <Layout>
                    {screens.md && (
                        <Sider style={{ background: '#fff' }}>
                            <div className='mb-3'>
                                {data && data.Username && <UserBadge username={data.Username} />}
                            </div>
                            <Menu
                                mode="inline"
                                selectedKeys={[activeKey]}
                                onClick={({ key }) => changeActiveKey(key)}
                                items={menuItems}
                            >
                            </Menu>
                        </Sider>
                    )}
                    <Layout>
                        {!screens.md && (
                            <Menu
                                selectedKeys={[activeKey]}
                                onClick={({ key }) => changeActiveKey(key)}
                                mode="horizontal"
                                items={menuItems}
                            />
                        )}

                        <Content>
                            {!changePassword && activeKey === 'profile' && <UserProfile isLoading={isLoading} data={data} refetch={refetch} />}
                            {activeKey === 'orders' && <UserOrders />}
                            {changePassword && activeKey === 'profile' && <ChangePassword />}
                            {activeKey === 'request' && <UserReport/>}
                            {/* {activeKey === 'settings' && <UserSettings userInfo={data} />} */}
                        </Content>
                    </Layout>
                </Layout>
            </Card >
        </Spin >
    );
};

export default UserPage;