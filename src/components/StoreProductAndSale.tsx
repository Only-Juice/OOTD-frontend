import React, { useEffect, useState } from 'react';
import { Alert, Skeleton, Table, Button, Modal, Upload, message, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import type { Product } from '../types';
import SellerModifyProduct from './SellerModifyProduct';
import AddProduct from './AddProduct';
import type { GetProp, UploadFile, UploadProps } from 'antd';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


const StoreProductAndSale: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedProductID, setSelectedProductID] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');


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

    const handleDeleteImage = (url: string) => {
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

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
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
                <Modal title="產品圖片" open={isModalVisible} onCancel={handleCancel} footer={null}>
                    <Skeleton active loading={uploadMutation.isPending}>
                        <Upload
                            listType="picture-card"
                            fileList={selectedImages.map((url, index) => ({
                                uid: index.toString(),
                                name: `image${index}`,
                                status: 'done',
                                url,
                            }))}
                            onPreview={handlePreview}
                            onRemove={(file) => handleDeleteImage(file.url!)}
                            customRequest={handleUpload}
                            showUploadList={{ showRemoveIcon: true }}
                            accept="image/*"
                        >
                            <button style={{ border: 0, background: 'none' }} type="button">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>上傳圖片</div>
                            </button>
                        </Upload>
                    </Skeleton>
                </Modal>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}

            </>
        )}
    </>;
};

export default StoreProductAndSale;