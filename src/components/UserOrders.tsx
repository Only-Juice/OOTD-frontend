import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Accordion, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';

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

const UserOrders: React.FC = () => {
    const { isPending, error, data, refetch } = useQuery({
        queryKey: [`UserOrders`],
        queryFn: () => {
            if (!localStorage.getItem('token')) return null;
            return fetch('/api/Order/GetUserOrders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    localStorage.removeItem('token');
                    return null;
                }
                return res.json();
            })
        },
    });

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    const calculateTotalQuantity = (details: OrderDetail[]) => {
        return details.reduce((total, detail) => total + detail.Quantity, 0);
    };

    const getStatusTimeline = (status: string) => {
        const statuses = [
            '未審查',
            '不通過',
            '已通過',
            '配送中',
            '轉運作業中',
            '貨件送達',
            '取件完成'
        ];

        return (
            <div className="d-flex justify-content-between align-items-center flex-column">
                <ProgressBar
                    now={statuses.indexOf(status) * 100 / (statuses.length - 1)}
                    variant='primary'
                    style={{ width: '100%', margin: '0 auto' }}
                >
                </ProgressBar>
                <div className="d-flex justify-content-between align-items-center w-100 mt-2">
                    {statuses.map((s, index) => (
                        <div key={index}>
                            <div className={`d-flex align-items-center justify-content-center p-2 ${status === s ? 'bg-primary text-white' : 'bg-light'}`}>
                                {s}
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        );
    };

    return (
        <>
            {isPending && (
                <Loading />
            )}
            {error && <p style={{ color: 'red' }}>{error.message}</p>}

            {data &&
                <>
                    <h2>我的訂單</h2>
                    {data.map((order: Order) => (
                        <Accordion className='mb-2' key={order.ID}>
                            <Accordion.Item eventKey={`${order.ID}`}>
                                <Accordion.Header>
                                    <div>
                                        <strong>訂單編號:</strong> {order.ID} <br />
                                        <strong>訂單日期:</strong> {new Date(order.CreateAt).toLocaleString()} <br />
                                        <strong>狀態:</strong> {order.Status} <br />
                                        {getStatusTimeline(order.Status)}
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
                                                                <img src={detail.Images[0]} alt={detail.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div style={{ width: '100%', height: '100%' }}></div>
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
        </>
    );
};

export default UserOrders;