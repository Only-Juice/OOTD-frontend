import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { LoginProps } from '../types';

const Login: React.FC<LoginProps> = ({ isModalOpen, setIsModalOpen, email, setEmail, password, setPassword, fetchUserInfo }) => {
    const [error, setError] = useState<string | null>(null);

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
                    setError('登入失敗');
                }
                return response.json();
            })
            .then(data => {
                console.log('Login successful:', data);
                localStorage.setItem('token', data);
                setIsModalOpen(false);
                fetchUserInfo(data);
            })
            .catch(() => setError('登入失敗'));
    };

    return (
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>登入</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>電子郵件:</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>密碼:</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Form.Group>
                    <Button className='mb-3' variant="success" type="submit">登入</Button>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="me-auto btn-lg w-25" variant="danger" onClick={() => setIsModalOpen(false)}>返回</Button>
                <div className="ms-auto text-end">
                    <p>還不是會員? <a href="#">註冊</a></p>
                    <p>忘記 <a href="#">密碼?</a></p>
                </div>
            </Modal.Footer>
        </Modal >
    );
};

export default Login;
