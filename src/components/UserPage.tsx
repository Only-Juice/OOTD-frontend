import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Nav } from 'react-bootstrap';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders'; // Assuming you have this component
import UserBadge from './UserBadge';
// import UserSettings from './UserSettings'; // Assuming you have this component
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import { FaPen } from "react-icons/fa";


interface UserPageProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

const UserPage: React.FC<UserPageProps> = ({ setIsModalOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);

    const { isPending, data, refetch } = useQuery({
        queryKey: [`UserInfo`],
        queryFn: () => {
            if (!localStorage.getItem('token')) return null;
            return fetch('/api/User/Get', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        if (!localStorage.getItem('token')) {
            setIsModalOpen(true);
        }
        refetch();
    }, [localStorage.getItem('token')]);

    useEffect(() => {
        navigate(`?tab=${activeKey}`, { replace: true });
    }, [activeKey, navigate]);

    return (
        <>
            {isPending ? (
                <Loading />
            ) :
                <Row>
                    <Col md={2}>
                        <Nav
                            className="flex-column"
                            variant="pills"
                            activeKey={activeKey}
                            onSelect={(selectedKey) => setActiveKey(selectedKey || '#profile')}
                        >
                            <div className='mb-2'>
                                {data && data.Username && <>
                                    <UserBadge username={data.Username} />
                                    <Nav.Link onClick={() => setActiveKey('profile')} className='text-secondary'>
                                        <FaPen className='me-2' />
                                        編輯個人簡介
                                    </Nav.Link>
                                </>}
                            </div>
                            <Nav.Item>
                                <Nav.Link eventKey="profile">個人檔案</Nav.Link>
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
                </Row>}
        </>
    );
};

export default UserPage;