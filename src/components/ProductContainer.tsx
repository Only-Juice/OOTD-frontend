import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Button, Modal, Row, Col, Spinner, Card } from "react-bootstrap";
import { Product } from "../types";
import { useMutation } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Rating from "./Rating";
import UserBadge from "./UserBadge";
import { Store, RatingResult } from "../types";

interface ProductContainerProps {
    product: Product | null;
    isPVC?: boolean;
    storeData?: Store;
    isStoreLoading: boolean;
    isPendingRating: boolean;
    dataRating?: RatingResult[];
    refetchRating: () => void;
}


const ProductContainer: React.FC<ProductContainerProps> = ({ product, isPVC, storeData, isStoreLoading, isPendingRating, dataRating, refetchRating }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [leftQuantity, setLeftQuantity] = useState(product?.Quantity || 0);
    const [isLoading, setIsLoading] = useState(false);
    const MySwal = withReactContent(Swal);
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

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
        onSuccess: () => {
            Toast.fire({
                title: '成功加入購物車',
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
                                    {product.Quantity === 0 && <div className='sold-out'>售完</div>}
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        {isStoreLoading ? <Spinner animation="border" /> : storeData &&
                            <Link to={`/store/${storeData.StoreID}`} className='text-decoration-none'>
                                <Card className="mt-4">
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: '1rem' }}><UserBadge username={storeData.OwnerUsername} size={20} /></Card.Title>
                                        <Card.Title style={{ fontSize: '2rem' }}>{storeData.Name}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                        }
                    </Col>
                    <Col md={6}>
                        <h1><b>{product.Name}</b></h1>
                        <p style={{ color: '#6c757d' }}>商品編號: {product.ID} {!isPVC && <>｜ 售出數量: {product.Sale} 件</>}</p>
                        <p>{product.Description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}</p>
                        <h4 style={{ color: 'red' }}><b>NT${product.Price}</b></h4>
                        {!isPVC &&
                            (<>
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
                            </>)}
                    </Col>
                </Row >
            }

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton />
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

            {product && <Rating productId={product.ID} isPVC={isPVC} isPending={isPendingRating} data={dataRating} refetch={refetchRating} />}
        </>
    );
};

export default ProductContainer;