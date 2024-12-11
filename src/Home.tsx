import React from 'react';
import ProductSlider from './ProductSlider';
import { HomeProps } from './types';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home: React.FC<HomeProps> = ({ products }) => {
    return (
        <Container className="mt-5">
            <h1 className="mb-4">Products</h1>
            <div className="shadow mb-4">
                <ProductSlider products={products} />
            </div>

            <Row>
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
            </Row>
        </Container>
    );
};

export default Home;