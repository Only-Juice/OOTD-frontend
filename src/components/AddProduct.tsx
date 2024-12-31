import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message, Select } from 'antd';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

const { Option } = Select;

const AddProduct: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { data: keywords } = useQuery<string[]>({
        queryKey: ['GetTopKeyword'],
        queryFn: () => fetch('/api/Keyword/GetTopKeyword?count=10').then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }),
    });


    const mutation = useMutation({
        mutationFn: async (values) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await fetch('/api/Product/CreateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            return response.json();
        },
        onSuccess: () => {
            message.success('Product created successfully');
            queryClient.invalidateQueries({ queryKey: ['GetStoreProductAndSale'] });
            setIsModalVisible(false);
            form.resetFields();
        },
        onError: (error) => {
            message.error(`Error: ${error.message}`);
        },
        retry: false,
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values: any) => {
        mutation.mutate(values);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                新增產品
            </Button>
            <Modal title="新增產品" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="Name" label="名稱" rules={[{ required: true, message: 'Please input the Name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="Description" label="敘述" rules={[{ required: true, message: 'Please input the Description!' }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="Price" label="售價" rules={[{ required: true, message: 'Please input the Price!' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="Quantity" label="庫存" rules={[{ required: true, message: 'Please input the Quantity!' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="Keywords" label="關鍵字" rules={[{ required: true, message: 'Please input at least one Keyword!' }]}>
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Please input keywords">
                            {keywords?.map((keyword) => (
                                <Option key={keyword} value={keyword}>
                                    {keyword}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AddProduct;