import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Form, Select, Spin, message, Input, Button } from 'antd';

// 定义用户类型
interface User {
    UID: number;
    Username: string;
    Email: string;
    Address: string;
    CreatedAt: string;
    Enabled: boolean;
}

const AdminStoreCreate: React.FC = () => {
    // 使用 useQuery 获取用户数据
    const { data, isLoading, isError, error } = useQuery({
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

    // 错误处理
    if (isError) {
        message.error(`Error: ${(error as Error).message}`);
    }

    // 表单提交处理函数
    const handleSubmit = (values: any) => {
        // 输出提交的表单数据
        console.log('提交的表单数据：', values);

        // 你可以在這裡進行相應的 API 請求來處理表單數據
        // 示例：將 OwnerID（選中的 UID）和其他資料提交給後端
        fetch('/api/Store/CreateStore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                OwnerID: values.OwnerID,       // 用戶的 UID
                Name: values.Name,             // 商店名稱
                Description: values.Description // 商店描述
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('創建商店失敗');
                }
                return res.json();
            })
            .then((data) => {
                message.success('商店創建成功');
                console.log('返回的數據:', data);
            })
            .catch((err) => {
                message.error(`錯誤: ${err.message}`);
            });
    };

    return (
        <>
            <h1>創建新商店</h1>
            <Form onFinish={handleSubmit}>
                <Form.Item
                    label="指定用户"
                    name="OwnerID"
                    rules={[{ required: true, message: '請選擇用戶!' }]}
                >
                    {/* 如果数据正在加载，显示加载中的转圈图 */}
                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        <Select placeholder="請選擇用戶">
                            {/* 渲染 Select 选项，循环 users 数组 */}
                            {data?.Users.map((user: User) => (
                                <Select.Option key={user.UID} value={user.UID}>
                                    {user.UID} - {user.Username}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    label="商店名稱"
                    name="Name"
                    rules={[{ required: true, message: '請輸入商店名稱!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="商店描述"
                    name="Description"
                    rules={[{ required: false, message: '請輸入商店描述!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default AdminStoreCreate;
