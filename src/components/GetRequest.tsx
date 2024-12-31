import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Skeleton, Alert, Button, Dropdown, Menu, Space, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface Request {
    ID: number;
    Username: string;
    CreatedAt: string;
    Message: string;
    Status: string;
}

const GetRequest: React.FC = () => {
    const { isLoading, error, data, refetch } = useQuery<Request[]>({
        queryKey: ['GetRequest'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }
            const res = await fetch('/api/Request/GetRequests', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!res.ok) {
                return null;
            }
            return res.json();
        },
    });

    const [fakeLoading, setFakeLoading] = React.useState(false);

    // 定義請求狀態選項
    const requestStatus = [
        { key: '未審查', label: '未審查' },
        { key: '未通過', label: '未通過' },
        { key: '已通過', label: '已通過' },
    ];

    // 處理狀態更新的邏輯
    const updateStatus = (id: number, status: string) => {
        // 狀態轉換函數
        const result = (status: string): string => {
            switch (status) {
                case '未審查':
                    return 'NotExamined';
                case '未通過':
                    return 'NotPass';
                case '已通過':
                    return 'Pass';
                default:
                    return status; // 若狀態不在定義的範圍內，返回原狀態
            }
        };

        // 轉換狀態
        const newStatus = result(status);

        // 可以在這裡發送請求來更新狀態，以下是模擬更新
        message.success(`Request ${id} status updated to ${newStatus}`);

        // 發送 PUT 請求來更新狀態
        fetch(`/api/Request/ModifyRequestStatus?requestID=${id}&status=${newStatus}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(() => {
                refetch();  // 更新資料
            })
            .catch((err) => {
                message.error('Failed to update status: ' + err.message); // 異常處理
            });
    };

    // 創建狀態選單
    const statusMenu = (id: number) => (
        <Menu>
            {requestStatus.map(status => (
                <Menu.Item key={status.key} onClick={() => updateStatus(id, status.key)}>
                    {status.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
        },
        {
            title: 'Username',
            dataIndex: 'Username',
            key: 'Username',
        },
        {
            title: 'Created At',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (text: string) => new Date(text).toLocaleString('zh-TW'),
        },
        {
            title: 'Message',
            dataIndex: 'Message',
            key: 'Message',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (status: string, record: Request) => {
                return (
                    <Space size="middle">
                        {/* 顯示狀態的文本 */}
                        <span style={{ color: getStatusColor(status) }}>{status}</span>
                        {/* 顯示下拉選單 */}
                        <Dropdown overlay={statusMenu(record.ID)}>
                            <a>
                                <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    // 根據狀態返回顏色
    const getStatusColor = (status: string) => {
        switch (status) {
            case '未審查':
                return 'orange';
            case '未通過':
                return 'red';
            case '已通過':
                return 'green';
            default:
                return 'black';
        }
    };

    return (
        <div>
            <Button onClick={() => {
                refetch();
                setFakeLoading(true);
                setTimeout(() => {
                    setFakeLoading(false);
                }, 500);
            }} type="primary" style={{ marginBottom: 16 }}>
                更新資料
            </Button>

            {isLoading || fakeLoading ? (
                <Skeleton active />
            ) : error ? (
                <Alert message="Error" description={(error as Error).message} type="error" showIcon />
            ) : (
                <Table dataSource={data} columns={columns} rowKey="ID" scroll={{ x: 'max-content' }} />
            )}
        </div>
    );
};

export default GetRequest;
