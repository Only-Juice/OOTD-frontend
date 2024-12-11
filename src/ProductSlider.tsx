import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProductSliderProps } from './types';
import { Button, Card, Col, Container } from 'react-bootstrap';

const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    nextArrow: <Button>Next</Button>,
    prevArrow: <Button>Previous</Button>,
};

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
    return (
        <Container>
            <Slider {...settings}>
                {products.map(product => (
                    <Col key={product.ID} md={4} className="mb-4">
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>{product.Name}</Card.Title>
                                <Card.Text>{product.Description.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}</Card.Text>
                                <Card.Text>Price: {product.Price}</Card.Text>
                                <Card.Text>Quantity: {product.Quantity}</Card.Text>
                                {product.Images.map((image, index) => (
                                    <Card.Img key={index} src={image} alt={product.Name} className="img-fluid mb-2" />
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Slider>
        </Container>
    );
};

export default ProductSlider;