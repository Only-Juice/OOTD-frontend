import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const ChangePassword: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
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

    const mutation = useMutation({
        mutationFn: () => {
            const token = localStorage.getItem('token');
            return fetch('/api/User/ModifyPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
                body: JSON.stringify({ OldPassword: currentPassword, NewPassword: newPassword }),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error(res.status.toString());
                }
                return null;
            })
        },
        onSuccess: () => {
            Toast.fire({
                icon: "success",
                title: "密碼修改成功"
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigate('/user?tab=profile')
        },
        onError: (error) => {
            if (error.message === '401') {
                setError('當前密碼錯誤');
            } else {
                setError('密碼修改失敗');
            }
        },
        onSettled: () => {
            setIsLoading(false);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError('新密碼與確認密碼不一致');
            return;
        }

        setIsLoading(true);
        mutation.mutate();
    };

    return (
        <Card>
            <Form onSubmit={handleSubmit} className="m-3">
                <h1>修改密碼</h1>
                <hr />
                <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label>當前密碼</Form.Label>
                    <Form.Control
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label>新密碼</Form.Label>
                    <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>確認新密碼</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <div className='mt-3 text-end'>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner animation="border" size="sm" /> : '修改密碼'}
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default ChangePassword;