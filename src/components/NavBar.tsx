import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import UserBadge from './UserBadge';
import { NavBarProps } from '../types';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar, Nav, Container, Button, Form, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';

const NavBar: React.FC<NavBarProps> = ({ theme, setIsModalOpen, toggleTheme, handleLogout }) => {
    const navigate = useNavigate();
    const { isFetching, data, refetch } = useQuery({
        queryKey: [`UserInfo`],
        queryFn: () => {
            if (!localStorage.getItem('token')) return null;
            return fetch('/api/User/Get', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    setIsModalOpen(true);
                    return null;
                }
                return res.json();
            })
        },
    });

    useEffect(() => {
        console.log('Refetching user info');
        refetch();
    }, [localStorage.getItem('token')]);



    const linkStyle = {
        color: theme === 'dark' ? 'white' : 'black',
        textDecoration: 'none',
        padding: '0.5rem',
        transition: 'background-color 0.3s ease',
    };

    const linkHoverStyle = {
        backgroundColor: theme === 'dark' ? '#555' : '#ddd',
    };

    return (
        <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" style={linkStyle} className="d-flex align-items-center">
                    <span className="d-none d-lg-block">Oh Online Tea Delivery</span>
                    <span className="d-lg-none">OOTD</span>
                </Navbar.Brand>
                <Search />
                <Navbar.Toggle aria-controls="navbarNav" />
                <Navbar.Collapse id="navbarNav">
                    <Nav className="ms-auto d-flex align-items-center">
                        <Nav.Link as={Link} to="/cart" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faShoppingCart} /> Cart
                        </Nav.Link>
                        {!isFetching ? (
                            <>
                                {data && data.Username ? (
                                    <>
                                        <Nav.Link as={Link} to="/user" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} className="d-flex align-items-center">
                                            <UserBadge username={data.Username} />
                                        </Nav.Link>
                                        <Button variant="link" className="nav-link d-flex align-items-center" onClick={() => { handleLogout(); refetch(); navigate("/"); }} style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="link" className="nav-link d-flex align-items-center" onClick={() => setIsModalOpen(true)} style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                                        Login
                                    </Button>
                                )}
                            </>) : <Spinner className='mx-3' animation="border" size="sm" />}
                        <Form.Check
                            type="switch"
                            id="themeSwitch"
                            label="Theme"
                            onChange={toggleTheme}
                            style={{ color: theme === 'dark' ? 'white' : 'black' }}
                        />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
