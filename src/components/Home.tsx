import React from 'react';
import ProductSlider from './ProductSlider';
import { Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';

const Home: React.FC = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ['GetAllProducts'], queryFn: () => fetch('/api/Product/GetAllProducts').then((res) => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
    },
    );

    return (
        <>
            {isPending && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">載入中</span>
                </div>
            )}
            {!isPending && error && <p style={{ color: 'red' }}>{error.message}</p>}
            {!isPending && <>
                <h1 className="mb-4">Products</h1>
                <div className="shadow mb-4">
                    <ProductSlider products={data} />
                </div>

                <Row>
                    {data.map((product: Product) => (
                        <Col key={product.ID} md={4} className='mb-4'>
                            <ProductCard key={product.ID} product={product} />
                        </Col>
                    ))}
                </Row>
            </>
            }
        </>
    );
};

export default Home;