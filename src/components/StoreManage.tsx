import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, Skeleton, Alert, Button, Pagination, Collapse, Switch, message } from 'antd';

const { Panel } = Collapse;

interface Store {
    StoreID: number;
    OwnerUsername: string;
    Name: string;
    Description: string;
    OwnerID: number;
    Enabled: boolean;
}

interface StoreResponse {
    PageCount: number;
    Stores: Store[];
}

const pageSize = 5;

const StoreManage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [switchLoading, setSwitchLoading] = useState<{ [key: number]: boolean }>({});
    const queryClient = useQueryClient();

    const { isLoading, error, data, refetch } = useQuery<StoreResponse>({
        queryKey: ['GetStores', currentPage],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }
            const res = await fetch(`/api/Store/GetStores?page=${currentPage}&pageLimitNumber=${pageSize}&isASC=true`, {
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
            mutationFn: async ({ StoreID, Enabled }: { StoreID: number; Enabled: boolean }) => {
                const token = localStorage.getItem('token');
                if (!token) {
                    return null;
                }
                return fetch('/api/Store/ModifyStoreEnabled', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ StoreID, Enabled }),
                }).then((res) => {
                    if (!res.ok) {
                        return null;
                    }
                    return res.json();
                });
            },

            onSuccess: () => {
                message.success('商店狀態修改成功');
            },
            onError: () => {
                message.error('商店狀態修改失敗');
            },
            onSettled: async (_, __, { StoreID }) => {
                await queryClient.invalidateQueries({ queryKey: ['GetStores'] });
                setSwitchLoading((prev) => ({ ...prev, [StoreID]: false }));
            },
        }
    );

    const handleSwitchChange = (StoreID: number, Enabled: boolean) => {
        setSwitchLoading((prev) => ({ ...prev, [StoreID]: true }));
        mutation.mutate({ StoreID, Enabled });
    };

    const columns = [
        {
            title: '商店 ID',
            dataIndex: 'StoreID',
            key: 'StoreID',
        },
        {
            title: '用戶名稱',
            dataIndex: 'OwnerUsername',
            key: 'OwnerUsername',
        },
        {
            title: '名稱',
            dataIndex: 'Name',
            key: 'Name',
            render: (text: string, record: Store) => (
                <a href={`/store/${record.StoreID}`} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: '敘述',
            dataIndex: 'Description',
            key: 'Description',
            render: (text: string) => (
                <Collapse>
                    <Panel header="展開" key="1">
                        {text}
                    </Panel>
                </Collapse>
            ),
        },
        {
            title: '用戶 ID',
            dataIndex: 'OwnerID',
            key: 'OwnerID',
        },
        {
            title: '啟用',
            dataIndex: 'Enabled',
            key: 'Enabled',
            render: (enabled: boolean, record: Store) => (
                <Switch
                    checked={enabled}
                    onChange={(checked) => handleSwitchChange(record.StoreID, checked)}
                    loading={switchLoading[record.StoreID]}
                />
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        refetch();
    };

    return (
        <div>
            <Button onClick={() => refetch()} type="primary" style={{ marginBottom: 16 }}>
                重新載入資料
            </Button>
            {isLoading ? (
                <Skeleton active />
            ) : error ? (
                <Alert message="Error" description={(error as Error).message} type="error" showIcon />
            ) : (
                <>
                    <Table dataSource={data?.Stores} columns={columns} rowKey="StoreID" pagination={false} />
                    <Pagination
                        current={currentPage}
                        total={(data?.PageCount ?? 0) * pageSize}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        style={{ marginTop: 16 }}
                    />
                </>
            )}
        </div>
    );
};

export default StoreManage;