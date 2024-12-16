import React, { useState, useEffect } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import { useQuery, useMutation } from "@tanstack/react-query";
import Loading from "./Loading";

const UserProfile: React.FC = () => {
    const { isLoading, data, refetch } = useQuery({
        queryKey: [`UserInfo`],
        queryFn: () => {
            if (!localStorage.getItem('token')) return null;
            return fetch('/api/User/Get', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    localStorage.removeItem('token');
                    return null;
                }
                return res.json();
            })
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Address: ''
    });
    const [isModify, setIsModify] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({
                Username: data.Username,
                Email: data.Email,
                Address: data.Address
            });
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: (newData: { Username: string; Email: string; Address: string }) => fetch('/api/User/ModifyUserInformation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newData),
        }).then((res) => {
            if (!res.ok) {
                throw new Error('Update failed');
            }
            return null;
        }),
        onSuccess: () => {
            setIsEditing(false);
            refetch();
            setIsModify(false);
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsModify(true);
        mutation.mutate(formData);
    };

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {data ? (
                <>
                    <Card>
                        <Card.Body>
                            <div className="m-3">
                                <h1>我的檔案</h1>
                                <h4>管理你的檔案以保護你的帳戶</h4>
                                <hr />
                                <Form onSubmit={handleSave}>
                                    <Form.Group className="mb-3" controlId="Username">
                                        <Form.Label>使用者帳號</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="使用者帳號"
                                            value={formData.Username}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="Email">
                                        <Form.Label>電子郵件</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="電子郵件"
                                            value={formData.Email.replace(/(.{3}).*@/, '$1***@')}
                                            onChange={handleChange}
                                            disabled={true}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="Address">
                                        <Form.Label>地址</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="地址"
                                            value={formData.Address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                    <Button variant="warning" onClick={() => alert('修改密碼功能尚未實作')}>
                                        修改密碼
                                    </Button>
                                    <div className="text-end">
                                        {
                                            isEditing ? (
                                                <Button variant="primary" type="submit" disabled={isModify}>
                                                    {isModify ? <Spinner animation="border" size="sm" /> : <>儲存</>}
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                                                    變更
                                                </Button>
                                            )}
                                    </div>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default UserProfile;