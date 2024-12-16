import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

interface ProductProps {
    ID: number;
    Name: string;
    Description: string;
    Price: number;
    Quantity: number;
    Images: string[];
}

const ProductCard: React.FC<{ product: ProductProps }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
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
                    <Card.Title style={{ color: isHovered ? '#0645AD' : 'inherit' }}>{product.Name}</Card.Title>
                    <Card.Text>NT${product.Price}</Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default ProductCard;