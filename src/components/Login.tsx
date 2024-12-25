import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { LoginProps } from '../types';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const Login: React.FC<LoginProps> = ({ isModalOpen, setIsModalOpen, refetchUserInfo, dataUserInfo }) => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
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

    const mutation = useMutation({
        mutationFn: () => fetch('/api/User/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email: email, Password: password }),
        }).then((res) => {
            if (!res.ok) {
                setError('登入失敗');
                setIsLoading(false);
                return null;
            }
            return res.json();
        }),
        onSuccess: (data) => {
            if (data) {
                console.log('Login successful:', data.Token);
                localStorage.setItem('token', data.Token);
                refetchUserInfo();
            }
        },
        onError: () => {
            setIsLoading(false);
            setError('登入失敗');
        }
    });

    const handleLogin = () => {
        setError(null);
        setIsLoading(true);
        mutation.mutate();
    };

    useEffect(() => {
        setIsLoading(false);
    }, [isModalOpen]);

    useEffect(() => {
        if (dataUserInfo) {
            {
                isModalOpen &&
                    Toast.fire({
                        icon: "success",
                        title: "登入成功"
                    });
            }
            setIsModalOpen(false);
            setIsLoading(false);
        }
    }, [dataUserInfo]);

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
                    <Button className='mb-3' variant="success" type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : '登入'}
                    </Button>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button className="me-auto btn-lg w-25" variant="danger" onClick={() => setIsModalOpen(false)}>返回</Button>
                <div className="ms-auto text-end">
                    <p>還不是會員? <a href="#" onClick={() => { setIsModalOpen(false); navigate('/register'); }}>註冊</a></p>
                    <p>忘記 <a href="#">密碼?</a></p>
                </div>
            </Modal.Footer>
        </Modal >
    );
};

export default Login;
