import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import '../styles/ProductCard.css';

const ProductCard: React.FC<{ product: Product | null }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {!product && <Card className='h-100'>
                <Card.Body>
                    <div className='image-container img-thumbnail'>
                        <div className='product-image'></div>
                    </div>
                    <Card.Title>暫無商品</Card.Title>
                </Card.Body>
            </Card>}
            {product &&
                <Link to={`/product/${product.ID}`} className='text-decoration-none'>
                    <Card className='h-100'>
                        <Card.Body>
                            <div className='image-container img-thumbnail'>
                                <Card.Img
                                    src={product.Images[0]}
                                    loading="lazy"
                                    className={`product-image ${isHovered ? 'zoom' : ''}`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                />
                            </div>
                            {product.Quantity === 0 && <div className='sold-out'>售完</div>}
                            <Card.Title className='mt-3' style={{ color: isHovered ? '#0645AD' : 'inherit' }}>{product.Name}</Card.Title>
                            <div className='d-flex justify-content-between'>
                                <Card.Text style={{ color: '#FF8C00', fontWeight: 'bold', fontSize: '1.2rem' }}>NT${product.Price}</Card.Text>
                                <Card.Text style={{ color: '#A9A9A9' }}>已售出: {product.Sale}</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Link>
            }
        </>
    );
};

export default ProductCard;