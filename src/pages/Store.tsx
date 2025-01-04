import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Form } from 'react-bootstrap';
import UserBadge from '../components/UserBadge';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import PageButton from '../components/PageButton';
import Loading from '../components/Loading';
import { Product, Store } from '../types';
import { Button, Input, Modal } from 'antd';

interface StoreProductsResponse {
    PageCount: number;
    Products: Product[];
}

const StorePage: React.FC = () => {
    const { storeID } = useParams<{ storeID: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1', 10);
    const sortOrder = queryParams.get('sortOrder') || false;
    const sortField = queryParams.get('sortField') || 'Sale';
    const [message, setMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    const { data: storeData, isLoading: isStoreLoading } = useQuery<Store>({
        queryKey: [`GetStoreById_${storeID}`],
        queryFn: async () => {
            const res = await fetch(`/api/Store/GetStoreById?storeID=${storeID}`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        },
    });

    const { data: storeProductsData, isLoading: isProductsLoading } = useQuery<StoreProductsResponse>({
        queryKey: [`GetStoreProducts_${storeID}_${page}_${sortField}_${sortOrder}`],
        queryFn: async () => {
            const res = await fetch(`/api/Product/GetStoreProducts?storeId=${storeID}&page=${page}&pageLimitNumber=30&orderField=${sortField}&isASC=${sortOrder}`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        },
    });

    const sendMessage = async () => {
        const messageData = {
            ReceiverID: storeData?.OwnerID,
            Message: message,
        };
        const res = await fetch('/api/Message/SendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(messageData),
        });

        if (res.ok) {
            setMessage('');
            setIsModalVisible(false);
            Modal.success({
                content: '訊息已成功傳送',
            });
        } else {
            if (res.status === 401) {
                Modal.error({ content: '請登入以發送訊息' });
            }
            else if (res.status === 403) {
                Modal.error({ content: '不允許的傳送方式' });
            } else {
                Modal.error({
                    content: '傳送訊息失敗',
                });
            }
        }
    };

    const handleSubmit = () => {
        sendMessage();
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            {(isStoreLoading || isProductsLoading) ? <Loading /> :
                <>

                    <Card className='h-100 mb-4'>
                        {storeData ?
                            <Card.Header>
                                <Card.Title style={{ fontSize: '1rem' }}>
                                    <UserBadge username={storeData.OwnerUsername} size={35} />
                                </Card.Title>
                                <Card.Title style={{ fontSize: '2rem' }}>{storeData.Name}</Card.Title>
                                <Card.Text>{storeData.Description}</Card.Text>
                                <Card.Text>
                                    <Button
                                        type="primary"
                                        onClick={(e) => {
                                            e.preventDefault();  // 阻止 Link 的跳轉
                                            showModal();  // 觸發聊天邏輯
                                        }}
                                    >
                                        來聊聊吧！
                                    </Button>
                                </Card.Text>
                            </Card.Header> : <Card.Header>商店不存在</Card.Header>
                        }
                        {storeProductsData ?
                            <Card.Body>
                                <Form.Group controlId="sortSelect" className='mb-4'>
                                    <Form.Label>排序方式</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={`${sortField}-${sortOrder}`}
                                        onChange={(e) => {
                                            navigate(`?page=1&sortField=${e.target.value.split('-')[0]}&sortOrder=${e.target.value.split('-')[1]}`);
                                        }}
                                    >
                                        <option value="Sale-true">銷量 (由小到大)</option>
                                        <option value="Sale-false">銷量 (由大到小)</option>
                                        <option value="Price-true">價格 (由小到大)</option>
                                        <option value="Price-false">價格 (由大到小)</option>
                                        <option value="Quantity-true">數量 (由小到大)</option>
                                        <option value="Quantity-false">數量 (由大到小)</option>
                                        <option value="Default-false">上架時間 (由新到舊)</option>
                                        <option value="Default-true">上架時間 (由舊到新)</option>
                                    </Form.Control>
                                </Form.Group>
                                {storeProductsData.Products.length > 0 && (
                                    <Row>
                                        {Array.isArray(storeProductsData.Products) && storeProductsData.Products.map((product: Product) => (
                                            <Col key={product.ID} md={4} className='mb-4'>
                                                <ProductCard key={product.ID} product={product} />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Card.Body> : <>{storeData && <Card.Body>暫無商品</Card.Body>}</>
                        }
                    </Card>
                    {storeProductsData && <PageButton PageCount={storeProductsData.PageCount} />}
                </>
            }
            <Modal title='開始聊天' open={isModalVisible} onOk={handleSubmit} onCancel={handleCancel}>
                <Form.Group controlId="newMessage">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onPressEnter={handleSubmit}  // 按下 Enter 鍵發送訊息
                        placeholder="輸入訊息..."
                    />
                </Form.Group>
            </Modal>
        </>
    );
};

export default StorePage;