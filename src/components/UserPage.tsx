import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Nav } from 'react-bootstrap';
import { UserInfo } from '../types';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders'; // Assuming you have this component
// import UserSettings from './UserSettings'; // Assuming you have this component

const UserPage: React.FC<{ userInfo: UserInfo | null, setIsModalOpen: (isOpen: boolean) => void }> = ({ userInfo, setIsModalOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);

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
                            <Nav.Link eventKey="profile">Profile</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="orders">Orders</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="settings">Settings</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={10}>
                    {activeKey === 'profile' && <UserProfile userInfo={userInfo} />}
                    {activeKey === 'orders' && <UserOrders userInfo={userInfo} setIsModalOpen={setIsModalOpen} />}
                    {/* {activeKey === '#settings' && <UserSettings userInfo={userInfo} />} */}
                </Col>
            </Row>
        </>
    );
};

export default UserPage;