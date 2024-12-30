import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Card, Divider, Typography } from 'antd';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
const { Title } = Typography;

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
                method: 'PUT',
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

    const handleSubmit = (values: { currentPassword: string, newPassword: string, confirmPassword: string }) => {
        setError(null);

        if (values.newPassword !== values.confirmPassword) {
            setError('新密碼與確認密碼不一致');
            return;
        }

        setIsLoading(true);
        mutation.mutate();
    };

    return (
        <Card>
            <Form onFinish={handleSubmit} className="m-3">
                <Title level={2}>修改密碼</Title>
                <Divider />
                <Form.Item
                    label="當前密碼"
                    name="currentPassword"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: '請輸入當前密碼' }]}
                >
                    <Input.Password
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="新密碼"
                    name="newPassword"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: '請輸入新密碼' }]}
                >
                    <Input.Password
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item
                    label="確認新密碼"
                    name="confirmPassword"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[{ required: true, message: '請確認新密碼' }]}
                >
                    <Input.Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Item>
                {error && <Alert message={error} type="error" />}
                <div className='mt-3 text-end'>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        修改密碼
                    </Button>
                </div>
            </Form>
        </Card>
    );
};

export default ChangePassword;