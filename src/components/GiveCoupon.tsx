import React, { useState, useEffect } from "react";
import { Form, InputNumber, Select, Button, message, Radio, RadioChangeEvent, Spin } from 'antd';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Coupon } from "../types";

interface User {
    UID: number;
    Username: string;
    Email: string;
    Address: string;
    CreatedAt: string;
    Enabled: boolean;
}

const GiveCoupon: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [target, setTarget] = useState('all');

    const handleTargetChange = (e: RadioChangeEvent) => {
        setTarget(e.target.value);
    };

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

    const { data, isLoading } = useQuery({
        queryKey: ['GetUsersAll'],
        queryFn: () =>
            fetch('/api/User/GetUsers?page=1&pageLimitNumber=333333&isASC=true', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        return null;
                    }
                    return res.json();
                })
                .catch((err) => {
                    message.error(`Error: ${err.message}`);
                }),
    });

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    const mutation = useMutation({
        mutationFn: (values: { CouponID: number; Count: number; UID?: number }) => {
            const token = localStorage.getItem('token');
            if (!token) return Promise.reject('No token found');
            var url = '';
            if (target === 'all') {
                url = `/api/Coupon/GiveCouponToAllUser?couponId=${values.CouponID}&count=${values.Count}`;
            } else {
                url = "/api/Coupon/GiveCouponToSpecificlUser";
            }


            return fetch(url, {
                method: 'POST',
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
            message.success('Coupon given successfully');
        },
        onError: () => {
            message.error('Failed to give coupon');
        }
    });

    const onFinish = async (values: any) => {
        setLoading(true);
        mutation.mutate(values);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="發送對象"
                name="target"
                rules={[{ required: true, message: '請輸入發送對象!' }]}
            >
                <Radio.Group onChange={handleTargetChange} value={target}>
                    <Radio value="all">所有用戶</Radio>
                    <Radio value="specific">特定用戶</Radio>
                </Radio.Group>
            </Form.Item>

            {target === 'specific' && (
                <Form.Item
                    label="用戶UID"
                    name="UID"
                    rules={[{ required: true, message: '請輸入UID!' }]}
                >
                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        <Select placeholder="請選擇用戶">
                            {data?.Users.map((user: User) => (
                                <Select.Option key={user.UID} value={user.UID}>
                                    {user.UID} - {user.Username}
                                </Select.Option>
                            ))}
                        </Select>
                    )}

                </Form.Item>
            )}

            <Form.Item
                label="優惠券"
                name="CouponID"
                rules={[{ required: true, message: '請選擇優惠券!' }]}
            >
                <Select
                    placeholder="Select a coupon"
                    style={{ maxHeight: '200px', overflowY: 'auto' }}
                    optionLabelProp="label"
                >
                    {coupons && coupons.map(coupon => (
                        <Select.Option key={coupon.CouponID} value={coupon.CouponID} label={coupon.Name}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold' }}>{coupon.Name}</span>
                                <span>{coupon.Description}</span>
                                <span>折扣: {coupon.Discount === 1 ? '無折扣' : `${(coupon.Discount * 10).toFixed(2).replace(/\.?0+$/, '')}折`} </span>
                                <span>有效日期 {new Date(coupon.StartDate).toLocaleString('zh-TW')} 到 {new Date(coupon.ExpireDate).toLocaleString('zh-TW')}</span>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="數量"
                name="Count"
                rules={[{ required: true, message: '請輸入數量!' }]}
            >
                <InputNumber min={1} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    送出
                </Button>
            </Form.Item>
        </Form>
    );
};

export default GiveCoupon;