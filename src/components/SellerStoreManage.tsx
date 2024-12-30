import React from "react";
import { Alert, Skeleton, Form, Input, Button, Typography, Collapse } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;
import type { Store } from "../types";

interface SellerStoreManageProps {
    store: Store | undefined;
    isLoading: boolean;
    error: Error | null;
}

const SellerStoreManage: React.FC<SellerStoreManageProps> = ({ store, isLoading, error }) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(
        {
            mutationFn: async ({ Name, Description }: { Name: string; Description: string }) => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return null;
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
                        return null;
                    }
                    return res.json();
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['GetSellerStore'] });
            },
        }
    );

    const [form] = Form.useForm();

    const handleSubmit = (values: { Name: string; Description: string }) => {
        mutation.mutate(values);
    };

    return (
        <>
            {isLoading ? (
                <Skeleton active />
            ) : error ? (
                <Alert message="Error" description={(error as Error).message} type="error" showIcon />
            ) : (
                <>
                    {store && (
                        <>
                            <Title>商店管理</Title>
                            <Paragraph>
                                <p>擁有者: {store.OwnerUsername}</p>
                                <p>商店名稱: {store.Name}</p>
                                <p>描述: {store.Description}</p>
                                <Collapse style={{ marginTop: 16 }}>
                                    <Panel header="修改商店" key="1">
                                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                            <Form.Item
                                                label="商店名稱"
                                                name="Name"
                                                initialValue={store.Name}
                                                rules={[{ required: true, message: '請輸入商店名稱!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                label="敘述"
                                                name="Description"
                                                initialValue={store.Description}
                                                rules={[{ required: true, message: '請輸入商店敘述!' }]}
                                            >
                                                <Input.TextArea autoSize={{ minRows: 3 }} />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" loading={mutation.isPending}>
                                                    提交
                                                </Button>
                                            </Form.Item>
                                        </Form>
                                    </Panel>
                                </Collapse>
                            </Paragraph>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default SellerStoreManage;