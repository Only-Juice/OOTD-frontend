import React, { useEffect, useState } from 'react';
import { Alert, Card, Layout, Menu } from 'antd';
import { useMediaQuery } from 'react-responsive';
import AddCouponForm from '../components/AddCouponForm';
import GiveCoupon from '../components/GiveCoupon';
import ModifyCoupon from '../components/ModifyCoupon';
import GetRequest from '../components/GetRequest';
import StoreManage from '../components/StoreManage';
import UserManage from '../components/UserManage';
import type { UserInfo } from '../types';
const { Sider, Content } = Layout;

interface AdminProps {
    dataUserInfo: UserInfo | null;
}

const Admin: React.FC<AdminProps> = ({ dataUserInfo }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [selectedComponent, setSelectedComponent] = useState('add');
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'add':
                return <AddCouponForm />;
            case 'give':
                return <GiveCoupon />;
            case 'modify':
                return <ModifyCoupon />;
            case 'request':
                return <GetRequest />;
            case 'store':
                return <StoreManage />;
            case 'user':
                return <UserManage />;
            default:
                return null;
        }
    };

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, [localStorage.getItem('token')]);

    const handleMenuClick = (e: any) => {
        setSelectedComponent(e.key);
    };

    const menuItems = [
        {
            key: 'coupon',
            label: '優惠券管理',
            children: [
                { key: 'add', label: '新增優惠券' },
                { key: 'give', label: '發放優惠券' },
                { key: 'modify', label: '修改優惠券' },
            ],
        },
        { key: 'request', label: '請求查看' },
        { key: 'store', label: '店家管理' },
        { key: 'user', label: '用戶管理' },
    ]


    return (
        <Card title="管理員頁面" className="mt-2">
            <Layout>
                {!isMobile && (
                    <Sider style={{ background: '#fff' }}>
                        <Menu
                            onClick={handleMenuClick}
                            selectedKeys={[selectedComponent]}
                            mode="inline"
                            items={menuItems}
                        />
                    </Sider>
                )}
                <Layout>
                    <Content>
                        {isMobile && (
                            <Menu
                                onClick={handleMenuClick}
                                selectedKeys={[selectedComponent]}
                                mode="horizontal"
                                items={menuItems}
                            />
                        )}
                        <Card>
                            {token ? (
                                <>
                                    {dataUserInfo?.IsAdministrator ? (
                                        renderComponent()
                                    ) : (
                                        <Alert
                                            className='mb-2'
                                            message="錯誤"
                                            description="您沒有管理員權限"
                                            type="error"
                                            showIcon
                                        />
                                    )}
                                </>
                            ) : (
                                <Alert
                                    className='mb-2'
                                    message="錯誤"
                                    description="請先登入帳號"
                                    type="error"
                                    showIcon
                                />
                            )}
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Card>
    );
};

export default Admin;