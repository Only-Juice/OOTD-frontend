import React, { useEffect, useState } from 'react';
import { Alert, Skeleton, Table, Button, Modal, Upload, message, Carousel } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { Product } from '../types';
import SellerModifyProduct from './SellerModifyProduct';
import AddProduct from './AddProduct';

const StoreProductAndSale: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedProductID, setSelectedProductID] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data, isLoading, error, refetch } = useQuery<Product[]>({
        queryKey: ['GetStoreProductAndSale'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return null;
            }
            const res = await fetch('/api/Store/GetStoreProductAndSale', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ productID, urls }: { productID: number; urls: string[] }) => {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/Product/RemoveProductImages', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ProductID: productID, Urls: urls }),
            });
            if (!res.ok) {
                throw new Error('Failed to delete images');
            }
            return res.json();
        },
        onSuccess: () => {
            message.success('Images deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['GetStoreProductAndSale'] });
        },
        onError: (error: Error) => {
            message.error(`Delete failed: ${error.message}`);
        },
    });

    const showImages = (images: string[], productID: number) => {
        setSelectedImages(images);
        setSelectedProductID(productID);
        setIsModalVisible(true);
    };

    const handleDeleteImage = (event: React.MouseEvent, url: string) => {
        event.preventDefault();
        if (selectedProductID !== null) {
            deleteMutation.mutate({ productID: selectedProductID, urls: [url] });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        setSelectedImages(data?.find(product => product.ID === selectedProductID)?.Images || []);
    }, [data]);

    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/Product/UploadProductImages?productID=${selectedProductID}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!res.ok) {
                throw new Error('Failed to upload images');
            }
            return res.json();
        },
        onSuccess: () => {
            message.success('Image uploaded successfully');
            queryClient.invalidateQueries({ queryKey: ['GetStoreProductAndSale'] });
        },
        onError: (error: Error) => {
            message.error(`Upload failed: ${error.message}`);
        },
    });

    const handleUpload = ({ file }: any) => {
        const formData = new FormData();
        formData.append('files', file);
        uploadMutation.mutate(formData);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            sorter: (a: Product, b: Product) => a.ID - b.ID,
        },
        {
            title: '名稱',
            dataIndex: 'Name',
            key: 'Name',
            ellipsis: {
                showTitle: false,
            },

            sorter: (a: Product, b: Product) => a.Name.localeCompare(b.Name),
        },
        {
            title: '售價',
            dataIndex: 'Price',
            key: 'Price',
            ellipsis: {
                showTitle: false,
            },
            sorter: (a: Product, b: Product) => a.Price - b.Price,
        },
        {
            title: '庫存',
            dataIndex: 'Quantity',
            key: 'Quantity',
            ellipsis: {
                showTitle: false,
            },

            sorter: (a: Product, b: Product) => a.Quantity - b.Quantity,
        },
        {
            title: '銷量',
            dataIndex: 'Sale',
            key: 'Sale',
            ellipsis: {
                showTitle: false,
            },

            sorter: (a: Product, b: Product) => (a.Sale ?? 0) - (b.Sale ?? 0),
        },
        {
            title: '啟用',
            dataIndex: 'Enabled',
            key: 'Enabled',
            ellipsis: {
                showTitle: false,
            },
            render: (enabled: boolean) => enabled ? '是' : '否',
        },
        {
            title: '描述',
            dataIndex: 'Description',
            key: 'Description',
            ellipsis: {
                showTitle: false,
            },
            render: (text: string) => text.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    <br />
                </React.Fragment>
            ))
        },
        {
            title: '圖片',
            dataIndex: 'Images',
            key: 'Images',
            ellipsis: {
                showTitle: false,
            },
            fixed: 'right' as 'right',
            render: (images: string[], record: Product) => (
                <Button onClick={() => showImages(images, record.ID)}>圖片</Button>
            ),
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right' as 'right',
            render: (record: Product) => (
                <SellerModifyProduct product={record} />
            ),
        }
    ];

    return <>
        {isLoading ? (
            <Skeleton active />
        ) : error ? (
            <Alert message="Error" description={(error as Error).message} type="error" showIcon />
        ) : (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Button onClick={() => refetch()} type="primary">
                        更新資料
                    </Button>
                    <AddProduct />
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="ID"
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                />
                <Modal title="產品圖片 (左右滑動切換圖片)" open={isModalVisible} onCancel={handleCancel} footer={null}>
                    <Skeleton active loading={uploadMutation.isPending}>
                        <Carousel arrows draggable>
                            {selectedImages.map((image, index) => (
                                <>
                                    <div key={index}>
                                        <img src={image} alt={`Product Image ${index}`} style={{ width: '100%', marginBottom: '10px' }} />
                                    </div>
                                    <Button type="primary" danger onClick={(event) => handleDeleteImage(event, image)}>
                                        刪除圖片
                                    </Button>
                                </>
                            ))}
                        </Carousel>
                    </Skeleton>
                    <Upload.Dragger
                        customRequest={handleUpload}
                        showUploadList={false}
                        accept="image/*"
                        multiple
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">點擊或拖動圖片到此區域以上傳</p>
                        <p className="ant-upload-hint">支持單個或批量上傳。</p>
                    </Upload.Dragger>
                </Modal>
            </>
        )}
    </>;
};

export default StoreProductAndSale;