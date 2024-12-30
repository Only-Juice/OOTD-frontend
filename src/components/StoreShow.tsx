import React from "react";
import { Store } from "../types";
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import ProductCard from "./ProductCard";
import { Link } from 'react-router-dom';

const StoreShow: React.FC<{ store: Store | undefined }> = ({ store }) => {
    const { data: StoreProductsData } = useQuery({
        queryKey: [`GetStoreProducts_${store?.StoreID}_1_Sale_false`], queryFn: async () => {
            if (!store?.StoreID) return null;
            const res = await fetch(`/api/Product/GetStoreProducts?storeId=${store?.StoreID}&page=1&pageLimitNumber=30&orderField=Sale&isASC=false`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        }
    });

    return (
        <>
            {store && <Card>
                <Link to={`/store/${store.StoreID}`} style={{ textDecoration: 'none' }}>
                    <Row className="my-2">
                        <Col md={3} className="d-flex flex-column align-items-center justify-content-center">
                            <Badge
                                pill
                                bg="primary"
                                className="d-flex justify-content-center align-items-center"
                                style={{ width: '40px', height: '40px', marginBottom: '10px', fontSize: '22px' }}
                            >
                                {store.OwnerUsername.charAt(0).toUpperCase()}
                            </Badge>
                            <Card.Title className="text-center" style={{ fontSize: '1.5rem' }}>{store.Name}</Card.Title>
                            <Button variant="outline-primary">造訪商店</Button>
                        </Col>
                        <Col md={3}>
                            <ProductCard product={StoreProductsData?.Products[0]} />
                        </Col>
                        <Col md={3}>
                            <ProductCard product={StoreProductsData?.Products[1]} />
                        </Col>
                        <Col md={3}>
                            <ProductCard product={StoreProductsData?.Products[2]} />
                        </Col>
                    </Row>
                </Link>
            </Card>
            }
        </>
    );
};

export default StoreShow;