import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Form, Input, InputNumber, DatePicker, Switch, Button } from 'antd';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const initialValues = {
    Name: '',
    Description: '',
    Discount: 0,
    StartDate: null,
    ExpireDate: null,
    Enabled: true,
};

const AddCouponForm: React.FC = () => {
    const [form] = Form.useForm();
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
    const MySwal = withReactContent(Swal);


    const mutation = useMutation({
        mutationFn: (values) => {
            const token = localStorage.getItem('token');
            return fetch('/api/Coupon/AddCoupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
                body: JSON.stringify(values),
            })
        },
        onSuccess: (data) => {
            if (data.status === 400) {
                Toast.fire({
                    icon: "error",
                    title: "建立失敗"
                });
            } else if (data.status === 401) {
                Toast.fire({
                    icon: "error",
                    title: "請先登入"
                });
            } else if (data.ok) {
                let timerInterval: number;
                MySwal.fire({
                    title: 'Success',
                    text: '建立優惠券成功!',
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
                });
            }
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });


    const onFinish = (values: any) => {
        const formattedValues = {
            ...values,
            StartDate: values.StartDate ? new Date(values.StartDate).toISOString() : null,
            ExpireDate: values.ExpireDate ? new Date(values.ExpireDate).toISOString() : null,
        };
        mutation.mutate(formattedValues);
        console.log('Success:', formattedValues);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="名稱"
                name="Name"
                rules={[{ required: true, message: '請輸入名稱!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="敘述"
                name="Description"
                rules={[{ required: true, message: '請輸入敘述!' }]}
            >
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="折扣"
                name="Discount"
                rules={[{ required: true, message: '請輸入折扣!' }]}
            >
                <InputNumber min={0} max={1} step={0.01} />
            </Form.Item>

            <Form.Item
                label="開始日期"
                name="StartDate"
                rules={[{ required: true, message: '請輸入開始時間!' }]}
            >
                <DatePicker showTime />
            </Form.Item>

            <Form.Item
                label="到期日期"
                name="ExpireDate"
                rules={[{ required: true, message: '請輸入到期時間!' }]}
            >
                <DatePicker showTime />
            </Form.Item>

            <Form.Item
                label="啟用"
                name="Enabled"
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    送出
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddCouponForm;