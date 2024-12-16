import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Nav, Card } from 'react-bootstrap';
import UserProfile from './UserProfile';
import UserOrders from './UserOrders'; // Assuming you have this component
import UserBadge from './UserBadge';
// import UserSettings from './UserSettings'; // Assuming you have this component
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import { FaPen } from "react-icons/fa";
import ChangePassword from './ChangePassword';


interface UserPageProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

const UserPage: React.FC<UserPageProps> = ({ setIsModalOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';
    const [activeKey, setActiveKey] = useState<string>(initialTab);
    const changePassword = queryParams.get('changePassword')

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
        const newQueryParams = new URLSearchParams(queryParams.toString());
        newQueryParams.set('tab', activeKey);
        navigate(`?${newQueryParams.toString()}`, { replace: true });
    }, []);

    const changeActiveKey = (key: string) => {
        const newQueryParams = new URLSearchParams(queryParams.toString());
        newQueryParams.delete('changePassword');
        newQueryParams.set('tab', key);
        navigate(`?${newQueryParams.toString()}`, { replace: true });
        setActiveKey(key);
    }

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
                            onSelect={(selectedKey) => changeActiveKey(selectedKey || '#profile')}
                        >
                            <Card>
                                <Card className='m-1'>
                                    <div className='ms-2 mt-2 mb-1'>
                                        {data && data.Username && <>
                                            <UserBadge username={data.Username} />
                                            <Nav.Link onClick={() => setActiveKey('profile')} className='text-secondary'>
                                                <FaPen className='me-2' />
                                                編輯個人檔案
                                            </Nav.Link>
                                        </>}
                                    </div>
                                </Card>
                                <Nav.Item>
                                    <Nav.Link eventKey="profile">個人檔案</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="orders">我的訂單</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="settings">設定</Nav.Link>
                                </Nav.Item>
                            </Card>
                        </Nav>
                    </Col>
                    <Col md={10}>
                        {!changePassword && activeKey === 'profile' && <UserProfile />}
                        {activeKey === 'orders' && <UserOrders />}
                        {changePassword && <ChangePassword />}
                        {/* {activeKey === '#settings' && <UserSettings userInfo={userInfo} />} */}
                    </Col>
                </Row>}
        </>
    );
};

export default UserPage;