import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product } from '../types';

interface SellerModifyProductProps {
    product: Product;
}

const SellerModifyProduct: React.FC<SellerModifyProductProps> = ({ product }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: Product) => {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await fetch('/api/Product/ModifyProduct', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...values, ProductID: product.ID }),
            });
            if (!response.ok) {
                throw new Error('Failed to modify product');
            }
            return response.json();
        },
        onSuccess: () => {
            message.success('Product modified successfully');
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
        // initialize form values
        form.setFieldsValue(product);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values: Product) => {
        mutation.mutate(values);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                修改
            </Button>
            <Modal title="修改產品" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical" onFinish={onFinish} initialValues={product}>
                    <Form.Item name="ID" label="產品ID" rules={[{ required: true, message: '請輸入產品ID!' }]}>
                        <InputNumber min={0} disabled />
                    </Form.Item>
                    <Form.Item name="Enabled" label="啟用" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item name="Quantity" label="庫存" rules={[{ required: true, message: '請輸入庫存!' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="Name" label="名稱" rules={[{ required: true, message: '請輸入名稱!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="Description" label="敘述" rules={[{ required: true, message: '請輸入敘述!' }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="Price" label="售價" rules={[{ required: true, message: '請輸入售價!' }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default SellerModifyProduct;