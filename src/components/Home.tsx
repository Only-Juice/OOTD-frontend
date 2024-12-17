import React from 'react';
import ProductSlider from './ProductSlider';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import Loading from './Loading';
import PageButton from './PageButton';
import { useLocation } from 'react-router-dom';

const Home: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1', 10);

    const { isLoading, error, data } = useQuery({
        queryKey: [`GetAllProducts_${page}`], queryFn: () => fetch(`/api/Product/GetAllProducts?page=${page}&pageLimitNumber=15`).then((res) => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
    },
    );

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {!isLoading && error && <p style={{ color: 'red' }}>{error.message}</p>}
            {!isLoading && <>
                {data && <>
                    {page !== 1 && <h1 className="mb-4">全站商品</h1>}
                    {page === 1 &&
                        <div className="shadow mb-4">
                            <ProductSlider />
                        </div>
                    }
                    <Row>
                        {Array.isArray(data.Products) && data.Products.map((product: Product) => (
                            <Col key={product.ID} md={4} className='mb-4'>
                                <ProductCard key={product.ID} product={product} />
                            </Col>
                        ))}
                    </Row>
                </>}
                {!data && <img src="https://http.cat/images/404.jpg" alt="404 Not Found" style={{ width: '100%', height: '100%' }} />}
                <PageButton PageCount={data.PageCount} />
            </>
            }
        </>
    );
};

export default Home;