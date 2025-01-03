import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { useMutation } from "@tanstack/react-query";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Rating from "./Rating";
import UserBadge from "./UserBadge";
import { Store, RatingResult } from "../types";
import { AiOutlineSmile } from "react-icons/ai";
import { Carousel, Input, Form, Image, Row, Col, Card, Button, Modal } from 'antd';
import { Spinner } from 'react-bootstrap';

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
                    setShowMessageModal(false);
                    MySwal.fire({
                        title: '訊息已發送',
                        text: '您的訊息已成功發送給賣家',
                        icon: 'success',
                    });
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
                    <Col md={12}>
                        <Carousel draggable autoplay autoplaySpeed={5000} dots>
                            {product.Images.length > 0 ? (
                                product.Images.map((image) => (
                                    <div key={image} className="d-flex justify-content-center w-100">
                                        <Image.PreviewGroup items={product.Images}>
                                            <Image
                                                src={image}
                                                width='100%'
                                                fallback="data:image/png;base64,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"
                                                alt={product.Name}
                                                style={{ objectFit: 'contain', height: 'auto', maxHeight: '700px' }}
                                            />
                                        </Image.PreviewGroup>
                                        {product.Quantity === 0 && <div className='sold-out'>售完</div>}
                                    </div>
                                ))
                            ) : (
                                <div className="bg-light">
                                    <p className="text-center" style={{ lineHeight: '400px' }}><AiOutlineSmile fontSize={20} />暫無商品圖</p>
                                </div>
                            )}
                        </Carousel>
                        {isStoreLoading ? <Spinner animation="border" /> : storeData &&
                            <Link to={`/store/${storeData.StoreID}`} className='text-decoration-none'>
                                <Card className="mt-4">
                                    <Card.Meta
                                        avatar={<UserBadge username={storeData.OwnerUsername} size={35} />}
                                        title={storeData.Name}
                                        description={
                                            <>
                                                {
                                                    storeData.Description.split('\n').map((line: string, index: number) => (
                                                        <React.Fragment key={index}>
                                                            {line}
                                                            <br />
                                                        </React.Fragment>
                                                    ))
                                                }
                                                < div className="d-flex justify-content-end mt-3">
                                                    <Button
                                                        type="primary"
                                                        onClick={(e) => {
                                                            e.preventDefault();  // 阻止 Link 的跳轉
                                                            handleMessageShow();  // 觸發聊天邏輯
                                                        }}
                                                    >
                                                        來聊聊吧！
                                                    </Button>
                                                </div>
                                            </>
                                        }
                                    />
                                </Card>
                            </Link>
                        }
                        <Modal title='開始聊天' open={ShowMessageModal} onOk={handleSendMessage} onCancel={handleMessageClose}>
                            <Form.Item label='新訊息'>
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onPressEnter={handleSendMessage}  // 按下 Enter 鍵發送訊息
                                    placeholder="輸入訊息..."
                                />
                            </Form.Item>
                        </Modal>
                    </Col >
                    <Col md={12}>
                        <div className="ms-3">
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
                                        <Button className="w-25" type="primary" onClick={() => mutation.mutate()} loading={isLoading} >
                                            加入購物車
                                        </Button>
                                    </div>
                                </>)}
                        </div>
                    </Col>
                </Row >
            }

            {product && <Rating productId={product.ID} isPending={isPendingRating} data={dataRating} refetch={refetchRating} />}
        </>
    );
};

export default ProductContainer;
