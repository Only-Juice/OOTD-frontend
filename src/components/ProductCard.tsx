import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';
import { Product } from '../types';

const ProductCard: React.FC<{ product: Product | null }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {!product && <Card className='h-100'>
                <Card.Body>
                    <div className='image-container img-thumbnail'>
                        <div className='product-image'></div>
                    </div>
                    <Card.Title>Loading</Card.Title>
                    <Card.Text>Loading</Card.Text>
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
                            {product.Quantity === 0 && <div className='sold-out' style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white', padding: '5px', borderRadius: '5px' }}>售完</div>}
                            <Card.Title style={{ color: isHovered ? '#0645AD' : 'inherit' }}>{product.Name}</Card.Title>
                            <Card.Text>NT${product.Price}</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            }
        </>
    );
};

export default ProductCard;