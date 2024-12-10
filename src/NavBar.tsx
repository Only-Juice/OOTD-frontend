import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search';
import UserBadge from './UserBadge';
import { NavBarProps } from './types';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NavBar: React.FC<NavBarProps> = ({ user, theme, setIsModalOpen, toggleTheme, handleLogout, setResults, setError, setSearchPerformed }) => {
    return (
        <nav className={`navbar navbar-expand-lg d-flex ${theme === 'dark' ? 'bg-gray navbar-dark' : 'bg-white navbar-light'}`} >
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Oh Online Tea Delivery</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="container-fluid">
                        <Search setResults={setResults} setError={setError} setSearchPerformed={setSearchPerformed} />
                    </div>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/cart"><FontAwesomeIcon icon={faShoppingCart} /> Cart</Link>
                        </li>
                        {user && user.Username ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/user"><UserBadge username={user.Username} /></Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={() => setIsModalOpen(true)}>Login</button>
                            </li>
                        )}
                        <li className="nav-item">
                            <div className="form-check form-switch d-flex align-items-center">
                                <input className="form-check-input" type="checkbox" id="themeSwitch" onChange={toggleTheme} />
                                <label className="form-check-label nav-link ms-2" htmlFor="themeSwitch">Toggle Theme</label>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav >
    );
};

export default NavBar;
