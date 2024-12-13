import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Accordion, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserInfo } from '../types';

interface OrderDetail {
    ID: number;
    Name: string;
    Images: string[];
    Price: number;
    Quantity: number;
}

interface Order {
    ID: number;
    CreateAt: string;
    Status: string;
    Amount: number;
    Details: OrderDetail[];
}

interface OrderProps {
    userInfo: UserInfo | null;
    setIsModalOpen: (isOpen: boolean) => void;
}

const Order: React.FC<OrderProps> = ({ userInfo, setIsModalOpen }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const token = localStorage.getItem('token');

    const GetUserOrders = async () => {
        fetch('/api/Order/GetUserOrders', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setLoading(false);
                setError(null);
                return response.json();
            })
            .then(data => setOrders(data))
            .catch(() => {
                setIsModalOpen(true);
                setLoading(false);
                setError('Please log in to view your orders');
            });
    }


    useEffect(() => {
        setLoading(true);
        if (token) {
            GetUserOrders();
        } else {
            setIsModalOpen(true);
            setLoading(false);
            setError('Please log in to view your orders');
        }
    }, []);

    useEffect(() => {
        GetUserOrders();
    }, [userInfo]);


    const calculateTotalQuantity = (details: OrderDetail[]) => {
        return details.reduce((total, detail) => total + detail.Quantity, 0);
    };

    return (
        <Container>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">正在搜尋</span>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error &&
                <>
                    <h2>My Orders</h2>
                    {orders.map(order => (
                        <Accordion className='mb-2'>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <div>
                                        <strong>訂單編號:</strong> {order.ID} <br />
                                        <strong>訂單日期:</strong> {new Date(order.CreateAt).toLocaleString()} <br />
                                        <strong>狀態:</strong> {order.Status} <br />
                                        <strong>總金額:</strong> NT${order.Amount}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup variant="flush">
                                        {order.Details.map(detail => (
                                            <ListGroup.Item key={detail.ID}>
                                                <Row>
                                                    <Col md={2}>
                                                        <Link to={`/product/${detail.ID}`}>
                                                            {detail.Images.length > 0 ? (
                                                                <img src={detail.Images[0]} alt={detail.Name} style={{ width: '200px', height: '200px' }} />
                                                            ) : (
                                                                <div style={{ width: '200px', height: '200px' }}></div>
                                                            )}
                                                        </Link>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Link to={`/product/${detail.ID}`}>
                                                            <h5>{detail.Name}</h5>
                                                        </Link>
                                                    </Col>

                                                    <Col md={2}>
                                                        <strong>數量:</strong> {detail.Quantity}
                                                    </Col>
                                                    <Col md={2}>
                                                        <strong>價格:</strong> NT${detail.Price * detail.Quantity}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                        <ListGroup.Item>
                                            <Row>
                                                <Col md={8}></Col>
                                                <Col md={2}>
                                                    <strong>總數量:</strong> {calculateTotalQuantity(order.Details)}
                                                </Col>
                                                <Col md={2}>
                                                    <strong>總金額:</strong> NT${order.Amount}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    ))
                    }
                </>
            }
        </Container>
    );
};

export default Order;