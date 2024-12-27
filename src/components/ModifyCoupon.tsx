import React, { useState, useEffect } from "react";
import { Form, InputNumber, Select, Button, message, Input, DatePicker, Switch } from 'antd';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Coupon } from "../types";

const ModifyCoupon: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    const { data: coupons, refetch } = useQuery<Coupon[]>({
        queryKey: ["GetAllCoupons"], queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) return null;
            return fetch("/api/Coupon/GetAllCoupons", {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
        }
    },
    );

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    const mutation = useMutation({
        mutationFn: (values) => {
            const token = localStorage.getItem('token');
            if (!token) return Promise.reject('No token found');
            return fetch('/api/Coupon/ModifyCoupon', {
                method: 'PUT',
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return null;
            })
        },
        onSuccess: () => {
            setLoading(false);
            message.success('Coupon modified successfully');
        },
        onError: () => {
            message.error('Failed to modify coupon');
        }
    });

    const onFinish = async (values: any) => {
        setLoading(true);
        const formattedValues = {
            ...values,
            StartDate: values.StartDate ? new Date(values.StartDate).toISOString() : null,
            ExpireDate: values.ExpireDate ? new Date(values.ExpireDate).toISOString() : null,
        };
        mutation.mutate(formattedValues);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleCouponChange = (value: any) => {
        const selectedCoupon = coupons?.find(coupon => coupon.CouponID === value);
        if (selectedCoupon) {
            form.setFieldsValue({
                Name: selectedCoupon.Name,
                Description: selectedCoupon.Description,
                Discount: selectedCoupon.Discount,
                StartDate: new Date(selectedCoupon.StartDate).toLocaleString(),
                ExpireDate: new Date(selectedCoupon.ExpireDate).toLocaleString(),
                Enabled: selectedCoupon.Enabled,
            });
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="優惠券"
                name="CouponID"
                rules={[{ required: true, message: '請選擇優惠券!' }]}
            >
                <Select
                    placeholder="Select a coupon"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                    optionLabelProp="label"
                    onChange={handleCouponChange}
                >
                    {coupons && coupons.map(coupon => (
                        <Select.Option key={coupon.CouponID} value={coupon.CouponID} label={coupon.Name}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold' }}>{coupon.Name}</span>
                                <span>{coupon.Description}</span>
                                <span>折扣: {coupon.Discount === 1 ? '無折扣' : `${(coupon.Discount * 10).toFixed(2).replace(/\.?0+$/, '')}折`} </span>
                                <span>有效日期 {new Date(coupon.StartDate).toLocaleString()} 到 {new Date(coupon.ExpireDate).toLocaleString()}</span>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="名稱"
                name="Name"
                rules={[{ required: true, message: '請輸入名稱!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="描述"
                name="Description"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="折扣"
                name="Discount"
                rules={[{ required: true, message: '請輸入折扣!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="開始日期"
                name="StartDate"
                rules={[{ required: true, message: '請輸入開始日期!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="結束日期"
                name="ExpireDate"
                rules={[{ required: true, message: '請輸入結束日期!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="啟用"
                name="Enabled"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ModifyCoupon;