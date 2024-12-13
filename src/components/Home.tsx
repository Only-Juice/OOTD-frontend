import React from 'react';
import ProductSlider from './ProductSlider';
import { HomeProps } from '../types';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';

const Home: React.FC<HomeProps> = ({ products }) => {
    return (
        <>
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
        </ >
    );
};

export default Home;