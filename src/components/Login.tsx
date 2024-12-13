import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { LoginProps } from '../types';

const Login: React.FC<LoginProps> = ({ isModalOpen, setIsModalOpen, email, setEmail, password, setPassword, fetchUserInfo }) => {
    const handleLogin = () => {
        fetch('/api/User/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: email, Password: password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Login successful:', data);
                localStorage.setItem('token', data);
                setIsModalOpen(false);
                fetchUserInfo(data);
            })
            .catch(error => console.error('Error logging in:', error));
    };

    return (
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button className='mb-3' variant="success" type="submit">Login</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="me-auto" variant="danger" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <div className="ms-auto text-end">
                    <p>Not a member? <a href="#">Sign Up</a></p>
                    <p>Forgot <a href="#">Password?</a></p>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default Login;