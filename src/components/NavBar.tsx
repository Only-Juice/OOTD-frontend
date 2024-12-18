import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import UserBadge from './UserBadge';
import { NavBarProps } from '../types';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navbar, Nav, Container, Button, Form, Spinner } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const NavBar: React.FC<NavBarProps> = ({ theme, setIsModalOpen, toggleTheme, handleLogout }) => {
    const navigate = useNavigate();
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    const { isPending, data, refetch } = useQuery({
        queryKey: [`UserInfo`],
        queryFn: () => {
            const token = localStorage.getItem('token');
            if (!token) return null;
            return fetch('/api/User/Get', {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
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
        <Navbar className='shadow' bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="lg">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" style={linkStyle} className="d-flex align-items-center">
                    <span className="d-none d-sm-block">Oh Online Tea Delivery</span>
                    <span className="d-sm-none">OOTD</span>
                    {/* <span>Oh Online Tea Delivery</span> */}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarNav" />
                <Search />
                <Navbar.Collapse id="navbarNav">
                    <Nav className="ms-auto d-flex align-items-center">
                        <Nav.Link as={Link} to="/cart" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faShoppingCart} /> Cart
                        </Nav.Link>
                        {!isPending ? (
                            <>
                                {data && data.Username ? (
                                    <>
                                        <Nav.Link as={Link} to="/user" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} className="d-flex align-items-center">
                                            <UserBadge username={data.Username} />
                                        </Nav.Link>
                                        <Button variant="link" className="nav-link d-flex align-items-center" onClick={() => {
                                            Toast.fire({
                                                icon: "success",
                                                title: "登出成功"
                                            }); handleLogout(); refetch(); navigate("/");
                                        }} style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
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
                            className='ms-5 d-flex align-items-center nav-link'
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
