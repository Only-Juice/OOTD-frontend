import React, { useState } from "react";
import { Carousel, Button, Modal, Row, Col } from "react-bootstrap";
import { Product } from "../types";

const ProductContainer: React.FC<{ product: Product | null }> = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedImageIndex(null);
    };

    return (
        <>
            {product &&
                <Row>
                    <Col md={6}>
                        <Carousel>
                            {product.Images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        loading="lazy"
                                        src={image}
                                        alt={product.Name}
                                        onClick={() => handleImageClick(index)}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                    <Col md={6}>
                        <h1><b>{product.Name}</b></h1>
                        <p style={{ color: '#6c757d' }}>商品編號: {product.ID}</p>
                        <p>{product.Description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}</p>
                        <h4 style={{ color: 'red' }}><b>NT${product.Price}</b></h4>
                        <p style={{ color: '#6c757d' }}>庫存: {product.Quantity}</p>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <label htmlFor="quantity" className="mr-2">數量:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max={product.Quantity}
                                defaultValue="1"
                                className="form-control d-inline-block"
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <Button variant="primary">加入購物車</Button>
                        </div>
                    </Col>
                </Row >
            }

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Body>
                    {selectedImageIndex !== null && (
                        <Carousel activeIndex={selectedImageIndex} onSelect={(index) => setSelectedImageIndex(index)}>
                            {product && product.Images.map((image, index) => (
                                <Carousel.Item key={index}>
                                    <img
                                        className="d-block w-100"
                                        src={image}
                                        alt={`Selected ${index}`}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProductContainer;