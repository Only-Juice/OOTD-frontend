import React from 'react';
import ProductSlider from './ProductSlider';
import { Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);


    useEffect(() => {
        setLoading(true);

        fetch('/api/Product/GetAllProducts')
            .then(response => {
                if (!response.ok) {
                    setError('搜尋過程中發生錯誤');
                }
                setLoading(false);
                return response.json();
            })
            .then(data => setProducts(data))
            .catch(() => setError(`搜尋過程中發生錯誤`));
    }, []);
    return (
        <>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">載入中</span>
                </div>
            )}
            {!loading && error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && <>
                <h1 className="mb-4">Products</h1>
                <div className="shadow mb-4">
                    <ProductSlider products={products} />
                </div>

                <Row>
                    {products.map(product => (
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