import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message, Divider, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import Loading from "./Loading";
import { UserInfo } from "../types";
const { Title } = Typography;

interface UserProfileProps {
    isLoading: boolean;
    data: UserInfo;
    refetch: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isLoading, data, refetch }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [isModify, setIsModify] = useState(false);

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                Username: data.Username,
                Email: data.Email.replace(/(.{3}).*@/, '$1***@'),
                Address: data.Address
            });
        }
    }, [data, form]);

    const mutation = useMutation({
        mutationFn: (newData: { Username: string; Email: string; Address: string }) => {
            const token = localStorage.getItem('token');
            return fetch('/api/User/ModifyUserInformation', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
                body: JSON.stringify(newData),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Update failed');
                }
                return null;
            })
        },
        onSuccess: () => {
            message.success("修改個人檔案成功");
            setIsEditing(false);
            refetch();
            setIsModify(false);
        },
        onError: (error) => {
            console.error('Error:', error);
        }
    });

    const handleSave = (values: { Username: string; Email: string; Address: string }) => {
        setIsModify(true);
        mutation.mutate(values);
    };

    const changePassword = () => {
        navigate('/user?tab=profile&changePassword=true');
    }

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {data ? (
                <Card>
                    <div className="m-3">
                        <Title level={2}>我的檔案</Title>
                        <Divider />
                        <Form
                            form={form}
                            onFinish={handleSave}
                            initialValues={{
                                Username: data.Username,
                                Email: data.Email.replace(/(.{3}).*@/, '$1***@'),
                                Address: data.Address
                            }}
                        >
                            <Form.Item label="使用者帳號" name="Username">
                                <Input
                                    placeholder="使用者帳號"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                            <Form.Item label="電子郵件" name="Email">
                                <Input
                                    type="email"
                                    placeholder="電子郵件"
                                    disabled={true}
                                />
                            </Form.Item>
                            <Form.Item label="地址" name="Address">
                                <Input.TextArea
                                    rows={3}
                                    placeholder="地址"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                            <Button type="primary" onClick={changePassword}>
                                修改密碼
                            </Button>
                            <div className="text-end">
                                {
                                    isEditing ? (
                                        <Button type="primary" htmlType="submit" loading={isModify}>
                                            儲存
                                        </Button>
                                    ) : (
                                        <Button type="default" onClick={(e) => { e.preventDefault(); setIsEditing(true); }}>
                                            變更
                                        </Button>
                                    )}
                            </div>
                        </Form>
                    </div>
                </Card>
            ) : (
                <></>
            )}
        </>
    );
};

export default UserProfile;
