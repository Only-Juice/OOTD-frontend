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
import { AiOutlineSmile } from "react-icons/ai";
import { Input, Form } from 'antd';

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

    const [ShowMessageModal, setShowMessageModal] = useState(false);
    const [newMessage, setNewMessage] = useState('');  // 用來存儲訊息的 state

    // 顯示對話框
    const handleMessageShow = () => setShowMessageModal(true);

    // 關閉對話框
    const handleMessageClose = () => setShowMessageModal(false);

    // 處理訊息發送
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setNewMessage('');  // 清空訊息
            const messageData = {
                ReceiverID: storeData?.OwnerID,
                Message: newMessage,
            };

            fetch('/api/Message/SendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(messageData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to send message');
                    }
                    return response.json();
                })
                .then(() => {

                    setNewMessage('');
                })
                .catch(error => {
                    console.error('Error sending message:', error);
                });
        }
    };


    return (
        <>
            {product &&
                <Row>
                    <Col md={6}>
                        <Carousel>
                            {product.Images.length > 0 ? (
                                product.Images.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            loading="lazy"
                                            src={image}
                                            alt={product.Name}
                                            onClick={() => handleImageClick(index)}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    const errorDiv = document.createElement('div');
                                                    errorDiv.className = 'd-flex justify-content-center align-items-center text-center';
                                                    errorDiv.style.height = '500px';
                                                    errorDiv.innerHTML = `圖片丟失`;
                                                    parent.appendChild(errorDiv);
                                                }
                                            }}
                                        />
                                        {product.Quantity === 0 && <div className='sold-out'>售完</div>}
                                    </Carousel.Item>
                                ))
                            ) : (
                                <Carousel.Item>
                                    <div className="d-flex justify-content-center text-center flex-column align-items-center" style={{ height: 500 }}>
                                        <AiOutlineSmile fontSize={20} />
                                        <p>找不到圖片</p>
                                    </div>
                                </Carousel.Item>
                            )}
                        </Carousel>
                        {isStoreLoading ? <Spinner animation="border" /> : storeData &&
                            <Link to={`/store/${storeData.StoreID}`} className='text-decoration-none'>
                                <Card className="mt-4">
                                    <Card.Body>
                                        <Card.Title style={{fontSize: '1rem'}}><UserBadge
                                            username={storeData.OwnerUsername} size={20}/></Card.Title>
                                        <Card.Title style={{fontSize: '2rem'}}>{storeData.Name}</Card.Title>
                                        <div className="d-flex justify-content-end mt-3">
                                            <Button
                                                variant="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();  // 阻止 Link 的跳轉
                                                    handleMessageShow();  // 觸發聊天邏輯
                                                }}
                                            >
                                                來聊聊吧！
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Link>
                        }
                        <Modal show={ShowMessageModal} onHide={handleMessageClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>開始聊天</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Item label="New Message">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onPressEnter={handleSendMessage}  // 按下 Enter 鍵發送訊息
                                        placeholder="輸入訊息..."
                                    />
                                </Form.Item>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    關閉
                                </Button>
                                <Button variant="primary" onClick={handleSendMessage}>
                                    發送訊息
                                </Button>
                            </Modal.Footer>
                        </Modal>
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

            {product && <Rating productId={product.ID} isPending={isPendingRating} data={dataRating} refetch={refetchRating} />}
        </>
    );
};

export default ProductContainer;
