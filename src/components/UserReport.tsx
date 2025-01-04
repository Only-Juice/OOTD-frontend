import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';

interface ReportMessage {
    ID: number;
    CreatedAt: string;
    Message: string;
    Status: string;
}

const columns = [
    {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
    },
    {
        title: 'Created At',
        dataIndex: 'CreatedAt',
        key: 'CreatedAt',
        render: (text: string) => new Date(text).toLocaleString(),
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
        render: (status: string) => {
            let color = '';
            let text = '';

            switch (status) {
                case '未審查':
                    color = 'orange';
                    text = '未審查';
                    break;
                case '未通過':
                    color = 'red';
                    text = '未通過';
                    break;
                case '已通過':
                    color = 'green';
                    text = '已通過';
                    break;
                default:
                    color = 'default';
                    text = '未知';
            }

            return <span style={{ color }}>{text}</span>;
        },
    },
];

const UserReport: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<ReportMessage[]>({
        queryKey: ['GetOwnRequests'],
        queryFn: () => fetch(`/api/Request/GetOwnRequests`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        }).then((res) => {
            if (res.status === 401) {
                throw new Error('請先登入');
            } else if (res.status === 404) {
                return [];
            } else if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }),
        retry: false,
    });

    if (isLoading) {
        return <p>Loading...</p>; // 加載狀態顯示
    }

    if (isError) {
        return <p>Error: {error instanceof Error ? error.message : 'An unknown error occurred'}</p>; // 錯誤處理
    }

    const dataWithID = data?.map((item, index) => ({
        ...item,
        ID: index + 1,  // 這裡使用索引作為 ID
    }));

    return (
        <>
            {data && data.length > 0 ? (
                <Table
                    columns={columns}
                    dataSource={dataWithID}
                    rowKey="ID" // 設置唯一的 ID 為 rowKey
                    scroll={{ x: 'max-content' }}
                />
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
                        <p>找不到回報</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserReport;
