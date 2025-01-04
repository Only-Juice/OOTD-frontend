import React from 'react';
import { Form, Input, Button, Row, Col, Card, FormProps } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type FormValues = {
    Username: string;
    Email: string;
    Password: string;
    confirmPassword: string;
    Address: string;
};

const Register: React.FC = () => {

    const navigate = useNavigate();
    const mutation = useMutation({
        mutationFn: (values: FormValues) => fetch('/api/User/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Username: values.Username, Password: values.Password, Email: values.Email, Address: values.Address }),
        }).then((res) => {
            if (res.status === 409) {
                throw new Error('電子郵件已存在');
            } else if (!res.ok) {
                throw new Error('註冊失敗，請稍後再試');
            }
            return '';
        }),
        onSuccess: (data) => {
            console.log('Success:', data); // 調試訊息
            let timerInterval: number;
            MySwal.fire({
                title: 'Success',
                text: '註冊成功!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup()?.querySelector("b");
                    if (timer) {
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then(() => {
                navigate('/');
            });
        },
        onError: (error) => {
            MySwal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
            });
        }
    });

    const onFinish: FormProps<FormValues>['onFinish'] = (values) => {
        mutation.mutate(values);
    }

    return (
        <Card title="註冊頁面" className="mt-2">
            <Row justify="center">
                <Col span={12}>
                    <Form onFinish={onFinish}>
                        <Form.Item
                            label="用戶名"
                            name="Username"
                            rules={[{ required: true, message: '請填寫用戶名' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="電子郵件"
                            name="Email"
                            rules={[
                                { required: true, message: '請填寫電子郵件' },
                                { type: 'email', message: '電子郵件無效' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="密碼"
                            name="Password"
                            rules={[{ required: true, message: '請填寫密碼' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="確認密碼"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: '請確認密碼' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('Password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('密碼不匹配'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="地址"
                            name="Address"
                            rules={[{ required: true, message: '請填寫地址' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">註冊</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Card>
    );
};

export default Register;