import React, { useEffect, useState } from 'react';
import { Alert, Card, Layout, Menu } from 'antd';
import AddCouponForm from '../components/AddCouponForm';
import GiveCoupon from '../components/GiveCoupon';
import ModifyCoupon from '../components/ModifyCoupon';
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const Admin: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [selectedComponent, setSelectedComponent] = useState('add');

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'add':
                return <AddCouponForm />;
            case 'give':
                return <GiveCoupon />;
            case 'modify':
                return <ModifyCoupon />;
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

    return (
        <Card title="管理員頁面" className="mt-2">
            <Layout>
                <Sider style={{ background: '#fff' }}>
                    <Menu onClick={handleMenuClick} selectedKeys={[selectedComponent]} mode="inline">
                        <SubMenu key="coupon" title="優惠券管理">
                            <Menu.Item key="add">新增優惠券</Menu.Item>
                            <Menu.Item key="give">發放優惠券</Menu.Item>
                            <Menu.Item key="modify">修改優惠券</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content>
                        <Card>
                            {token ? (
                                renderComponent()
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