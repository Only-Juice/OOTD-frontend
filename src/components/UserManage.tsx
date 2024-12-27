import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Skeleton, Alert, Button, Pagination, Switch, message } from 'antd';

interface User {
    UID: number;
    Username: string;
    Email: string;
    Address: string;
    CreatedAt: string;
    Enabled: boolean;
}

interface UserResponse {
    PageCount: number;
    Users: User[];
}

const pageSize = 5;

const UserManage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [switchLoading, setSwitchLoading] = useState<{ [key: number]: boolean }>({});
    const queryClient = useQueryClient();
    const [PageCount, setPageCount] = useState(0);

    const { isLoading, error, data, refetch } = useQuery<UserResponse>({
        queryKey: ['GetUsers', currentPage],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }
            const res = await fetch(`/api/User/GetUsers?page=${currentPage}&pageLimitNumber=${pageSize}&isASC=true`, {
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

    const mutation = useMutation(
        {
            mutationFn: async ({ UID, Enabled }: { UID: number; Enabled: boolean }) => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return null;
                }
                return fetch('/api/User/ModifyUserEnabled', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ UID, Enabled }),
                }).then((res) => {
                    if (!res.ok) {
                        return null;
                    }
                    return res.json();
                });
            },

            onSuccess: () => {
                message.success('用戶狀態修改成功');
            },
            onError: () => {
                message.error('用戶狀態修改失敗');
            },
            onSettled: async (_, __, { UID }) => {
                await queryClient.invalidateQueries({ queryKey: ['GetUsers'] });
                setSwitchLoading((prev) => ({ ...prev, [UID]: false }));
            },
        }
    );

    const handleSwitchChange = (UID: number, Enabled: boolean) => {
        setSwitchLoading((prev) => ({ ...prev, [UID]: true }));
        mutation.mutate({ UID, Enabled });
    };

    useEffect(() => {
        if (data) {
            setPageCount(data.PageCount);
        }
    }, [data]);


    const columns = [
        {
            title: '用戶 ID',
            dataIndex: 'UID',
            key: 'UID',
        },
        {
            title: '用戶名稱',
            dataIndex: 'Username',
            key: 'Username',
        },
        {
            title: '電子郵件',
            dataIndex: 'Email',
            key: 'Email',
        },
        {
            title: '地址',
            dataIndex: 'Address',
            key: 'Address',
        },
        {
            title: '創建時間',
            dataIndex: 'CreatedAt',
            key: 'CreatedAt',
            render: (text: string) => new Date(text).toLocaleString('zh-TW'),
        },
        {
            title: '啟用',
            dataIndex: 'Enabled',
            key: 'Enabled',
            fixed: 'right' as 'right',
            render: (enabled: boolean, record: User) => (
                <Switch
                    checked={enabled}
                    onChange={(checked) => handleSwitchChange(record.UID, checked)}
                    loading={switchLoading[record.UID]}
                />
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        refetch();
    };

    return (
        <>
            <Button onClick={() => refetch()} type="primary" style={{ marginBottom: 16 }}>
                更新資料
            </Button>
            {isLoading ? (
                <Skeleton active />
            ) : error ? (
                <Alert message="Error" description={(error as Error).message} type="error" showIcon />
            ) : (
                <>
                    <Table dataSource={data?.Users} columns={columns} rowKey="UID" pagination={false} scroll={{ x: 'max-content' }} />
                </>
            )}
            <Pagination
                showSizeChanger={false}
                current={currentPage}
                total={(PageCount ?? 0) * pageSize}
                pageSize={pageSize}
                onChange={handlePageChange}
                style={{ marginTop: 16 }}
            />

        </>
    );
};

export default UserManage;