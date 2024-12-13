import React from 'react';
import ProductSlider from './ProductSlider';
import { Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types';
import Loading from './Loading';

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
                <Loading />
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