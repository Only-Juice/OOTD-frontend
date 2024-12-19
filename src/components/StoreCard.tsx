import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import '../styles/StoreCard.css';

const StoreCard: React.FC<{ product: Product | null }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {!product &&
                <Card className='h-100'>
                    <Card.Body>
                        <div className='image-container img-thumbnail'>
                            <div className='store-image'></div>
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
                                    className={`store-image ${isHovered ? 'zoom' : ''}`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                />
                            </div>
                            <div className='hover-price'>
                                NT${product.Price}
                            </div>
                            {product.Quantity === 0 && <div className='sold-out' style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white', padding: '5px', borderRadius: '5px' }}>售完</div>}
                        </Card.Body>
                    </Card>
                </Link>
            }
        </>
    );
};

export default StoreCard;