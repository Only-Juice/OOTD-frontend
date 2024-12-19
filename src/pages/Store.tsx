import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, Form } from 'react-bootstrap';
import UserBadge from '../components/UserBadge';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import PageButton from '../components/PageButton';
import Loading from '../components/Loading';

interface Store {
    StoreID: number;
    OwnerUsername: string;
    Name: string;
    Description: string;
}

interface Product {
    ID: number;
    Name: string;
    Description: string;
    Price: number;
    Quantity: number;
    Sale: number;
    StoreID: number;
    Images: string[];
}

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

    return (
        <>
            {(isStoreLoading || isProductsLoading) ? <Loading /> :
                <>

                    <Card className='h-100 mb-4'>
                        {storeData ?
                            <Card.Header>
                                <Card.Title style={{ fontSize: '1rem' }}>
                                    <UserBadge username={storeData.OwnerUsername} size={20} />
                                </Card.Title>
                                <Card.Title style={{ fontSize: '2rem' }}>{storeData.Name}</Card.Title>
                                <Card.Text>{storeData.Description}</Card.Text>
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
                                            navigate(`?page=${page}&sortField=${e.target.value.split('-')[0]}&sortOrder=${e.target.value.split('-')[1]}`);
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
        </>
    );
};

export default StorePage;