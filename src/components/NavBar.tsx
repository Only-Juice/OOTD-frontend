import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import UserBadge from './UserBadge';
import { NavBarProps } from '../types';
import { FaComments, FaShoppingCart } from "react-icons/fa";
import { Navbar, Nav, NavDropdown, Container, Form, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

const NavBar: React.FC<NavBarProps> = ({ theme, setIsModalOpen, toggleTheme, handleLogout, isPendingUserInfo, dataUserInfo, refetchUserInfo }) => {
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

    useEffect(() => {
        refetchUserInfo();
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
        <Navbar className='shadow mb-3' bg={theme === 'dark' ? 'dark' : 'light'} variant={theme === 'dark' ? 'dark' : 'light'} expand="xl">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" style={linkStyle} className="d-flex align-items-center">
                    <span className="d-none d-sm-block">Oh Online Tea Delivery</span>
                    <span className="d-sm-none">OOTD</span>
                    {/* <span>Oh Online Tea Delivery</span> */}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarNav" />
                <Search />
                <Navbar.Collapse id="navbarNav">
                    <Nav className="d-flex align-items-center">
                        <NavDropdown title={<><FaComments /> 訊息</>} style={{ whiteSpace: 'nowrap' }}>
                            <NavDropdown.Item as={Link} to="/message">訊息頁面</NavDropdown.Item>
                        </NavDropdown>

                        {!isPendingUserInfo ? (
                            <>
                                {dataUserInfo && dataUserInfo.Username ? (
                                    <>
                                        <NavDropdown title={<UserBadge username={dataUserInfo.Username} />} style={{ whiteSpace: 'nowrap' }}>
                                            <NavDropdown.Item as={Link} to="/user?tab=profile">用戶頁面</NavDropdown.Item>
                                            {dataUserInfo.IsAdministrator && <NavDropdown.Item as={Link} to="/admin">管理頁面</NavDropdown.Item>}
                                            <NavDropdown.Item onClick={() => {
                                                Toast.fire({
                                                    icon: "success",
                                                    title: "登出成功"
                                                }); handleLogout(); refetchUserInfo(); navigate("/");
                                            }}>
                                                登出
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                ) : (
                                    <Nav.Link onClick={() => setIsModalOpen(true)} style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} className="d-flex align-items-center">
                                        登入
                                    </Nav.Link>
                                )}
                            </>) : <Spinner className='mx-3' animation="border" size="sm" />}
                        <Nav.Link as={Link} to="/cart" style={linkStyle} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = linkHoverStyle.backgroundColor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''} className="d-flex align-items-center">
                            <FaShoppingCart /> 購物車
                        </Nav.Link>
                        <div className="ms-5 d-flex align-items-center">
                            <Form.Check
                                className={`nav-link ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                                type="switch"
                                id="themeSwitch"
                                label="主題"
                                onChange={toggleTheme}
                            />
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
