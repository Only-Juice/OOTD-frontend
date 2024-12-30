import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, message, Divider, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "./Loading";
const { Title, Paragraph } = Typography;
import type { Store } from "../types";

interface SellerStoreManageProps {
    store: Store | undefined;
    isLoading: boolean;
    error: Error | null;
}

const SellerStoreManage: React.FC<SellerStoreManageProps> = ({ store, isLoading }) => {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [isModify, setIsModify] = useState(false);

    useEffect(() => {
        if (store) {
            form.setFieldsValue({
                Name: store.Name,
                Description: store.Description
            });
        }
    }, [store, form]);

    const mutation = useMutation({
        mutationFn: async ({ Name, Description }: { Name: string; Description: string }) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            return fetch('/api/Store/ModifyStore', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ OwnerID: store?.OwnerID, Name, Description }),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Update failed');
                }
                return res.json();
            });
        },
        onSuccess: () => {
            message.success("修改商店資訊成功");
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['GetSellerStore'] });
            setIsModify(false);
        },
        onError: (error) => {
            message.error(`Error: ${error.message}`);
        }
    });

    const handleSave = (values: { Name: string; Description: string }) => {
        setIsModify(true);
        mutation.mutate(values);
    };

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {store ? (
                <Card>
                    <div className="m-3">
                        <Title level={2}>我的檔案</Title>
                        <Divider />
                        <Paragraph>
                            <Card>
                                <p>擁有者: {store.OwnerUsername}</p>
                                <p>商店名稱: {store.Name}</p>
                                <p>描述: {store.Description}</p>
                            </Card>
                        </Paragraph>
                        <Form
                            form={form}
                            onFinish={handleSave}
                            initialValues={{
                                OwnerUsername: store.OwnerUsername,
                                Name: store.Name,
                                Description: store.Description
                            }}
                        >
                            <Form.Item label="擁有者" name="OwnerUsername">
                                <Input
                                    placeholder="擁有者"
                                    disabled={true}
                                />
                            </Form.Item>
                            <Form.Item
                                label="商店名稱"
                                name="Name"
                                rules={[{ required: true, message: '請輸入商店名稱!' }]}
                            >
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item label="敘述" name="Description">
                                <Input.TextArea
                                    rows={3}
                                    placeholder="敘述"
                                    disabled={!isEditing}
                                />
                            </Form.Item>
                            <div className="text-end">
                                {isEditing ? (
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

export default SellerStoreManage;
