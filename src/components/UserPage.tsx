import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Nav } from 'react-bootstrap';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders'; // Assuming you have this component
// import UserSettings from './UserSettings'; // Assuming you have this component

interface UserPageProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

const UserPage: React.FC<UserPageProps> = ({ setIsModalOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            setIsModalOpen(true);
        }
    }, [localStorage.getItem('token')]);

    useEffect(() => {
        navigate(`?tab=${activeKey}`, { replace: true });
    }, [activeKey, navigate]);

    return (
        <>
            <Row>
                <Col md={2}>
                    <Nav
                        className="flex-column"
                        variant="pills"
                        activeKey={activeKey}
                        onSelect={(selectedKey) => setActiveKey(selectedKey || '#profile')}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="profile">個人資訊</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="orders">我的訂單</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="settings">設定</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={10}>
                    {activeKey === 'profile' && <UserProfile />}
                    {activeKey === 'orders' && <UserOrders />}
                    {/* {activeKey === '#settings' && <UserSettings userInfo={userInfo} />} */}
                </Col>
            </Row>
        </>
    );
};

export default UserPage;