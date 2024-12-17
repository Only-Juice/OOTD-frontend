import React, { useState, useEffect } from "react";
import { Carousel, Button, Modal, Row, Col, Spinner } from "react-bootstrap";
import { Product } from "../types";
import { useMutation } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Rating from "./Rating";

interface ProductContainerProps {
    product: Product | null;
}


const ProductContainer: React.FC<ProductContainerProps> = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [leftQuantity, setLeftQuantity] = useState(product?.Quantity || 0);
    const [isLoading, setIsLoading] = useState(false);
    const MySwal = withReactContent(Swal);

    const mutation = useMutation({
        mutationFn: () => {
            const token = localStorage.getItem('token');
            setIsLoading(true);
            return fetch('/api/Product/AddToCart', {
                method: 'POST',
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ProductID: product?.ID, Quantity: quantity }),
            }).then((res) => {
                setIsLoading(false);
                if (!res.ok) {
                    localStorage.removeItem('token');
                    throw new Error('Please log in to add items to your cart');
                }
                return '';
            })
        },
        onSuccess: (data) => {
            MySwal.fire({
                title: 'Success',
                text: 'Added to cart',
                icon: 'success',
            });
            setLeftQuantity(leftQuantity - quantity);
        },
        onError: (error) => {
            MySwal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
            });
        }
    });

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedImageIndex(null);
    };

    useEffect(() => {
        if (leftQuantity <= 0) {
            setQuantity(1);
            setLeftQuantity(product?.Quantity || 0);
        }
    }, [leftQuantity]);

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
                        <p style={{ color: '#6c757d' }}>庫存: {leftQuantity}</p>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                            <label htmlFor="quantity" className="mr-2">數量:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max={leftQuantity}
                                value={quantity}
                                className="form-control d-inline-block"
                                style={{ width: '60px', marginRight: '10px' }}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1 && value <= leftQuantity) {
                                        setQuantity(value);
                                    }
                                }}
                            />
                            <Button className="w-25" variant="primary" onClick={() => mutation.mutate()} disabled={isLoading}>
                                {isLoading ? <Spinner animation="border" size="sm" /> : '加入購物車'}
                            </Button>
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

            <Rating productId={product.ID} />
        </>
    );
};

export default ProductContainer;