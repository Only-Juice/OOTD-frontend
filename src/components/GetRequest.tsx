import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Skeleton, Alert, Button } from 'antd';

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
            const res = await fetch('/api/Request/GetRequest', {
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
        },
    ];

    return (
        <div>
            <Button onClick={() => {
                refetch()
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
                <Table dataSource={data} columns={columns} rowKey="ID" />
            )}
        </div>
    );
};

export default GetRequest;