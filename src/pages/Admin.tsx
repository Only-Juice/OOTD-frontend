import React, { useState } from 'react';
import { Card, Button } from 'antd';
import AddCouponForm from '../components/AddCouponForm';
import GiveCoupon from '../components/GiveCoupon';
import ModifyCoupon from '../components/ModifyCoupon';

const Admin: React.FC = () => {
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

    return (
        <Card>
            <div className='mb-2' style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={() => setSelectedComponent('add')}>新增優惠券</Button>
                <Button onClick={() => setSelectedComponent('give')}>給優惠券</Button>
                <Button onClick={() => setSelectedComponent('modify')}>修改優惠券</Button>
            </div>
            {renderComponent()}
        </Card>
    );
};

export default Admin;