import React, { useEffect, useState } from 'react';
import { Alert, Card, Button, Skeleton } from 'antd';
import AddCouponForm from '../components/AddCouponForm';
import GiveCoupon from '../components/GiveCoupon';
import ModifyCoupon from '../components/ModifyCoupon';

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

    return (
        <Card>
            {token ? <><div className='mb-2' style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={() => setSelectedComponent('add')}>新增優惠券</Button>
                <Button onClick={() => setSelectedComponent('give')}>給優惠券</Button>
                <Button onClick={() => setSelectedComponent('modify')}>修改優惠券</Button>
            </div>
                <hr />
                {renderComponent()}</> :
                <Alert className='mb-2'
                    message="錯誤"
                    description="請先登入帳號"
                    type="error" showIcon />}
        </Card >
    );
};

export default Admin;