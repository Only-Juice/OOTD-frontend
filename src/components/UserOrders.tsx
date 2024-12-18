import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Accordion, ProgressBar, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';

interface OrderDetail {
    PVCID: number;
    Name: string;
    Price: number;
    Quantity: number;
    Images: string[];
}

interface Order {
    OrderID: number;
    CreateAt: string;
    Status: string;
    Amount: number;
    Discount: number;
    Details: OrderDetail[];
}

const UserOrders: React.FC = () => {
    const [notFound, setNotFound] = useState(false);
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: [`UserOrders`],
        queryFn: () => {
            const token = localStorage.getItem('token');
            if (!token) return null;
            return fetch('/api/Order/GetUserOrders', {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        return null;
                    } else if (res.status === 404) {
                        setNotFound(true);
                        return null;
                    }
                    throw new Error(res.statusText);
                }
                return res.json();
            })
        },
        retry: false,
    });

    useEffect(() => {
        setNotFound(false);
        refetch();
    }, [localStorage.getItem('token')]);

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
            {isLoading && (
                <Loading />
            )}
            {(error || notFound) &&
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
                        {error && <p style={{ color: 'red' }}>{error.message}</p>}
                        {notFound && <p>找不到訂單</p>}
                    </div>
                </div>
            }

            {data &&
                <Card>
                    <div className="m-3">
                        <h1>我的訂單</h1>
                        <hr />
                        {data.map((order: Order) => (
                            <Accordion className='mb-2' key={order.OrderID}>
                                <Accordion.Item eventKey={`${order.OrderID}`}>
                                    <Accordion.Header>
                                        <div>
                                            <strong>訂單編號:</strong> <span>{order.OrderID}</span> <br />
                                            <strong>訂單日期:</strong> <span>{new Date(order.CreateAt).toLocaleString()}</span> <br />
                                            <strong>折扣:</strong> <span>{order.Discount === 1 ? '無折扣' : `${(order.Discount * 10).toFixed(2)}折`}</span> <br />
                                            <strong>狀態:</strong> <span>{order.Status}</span> <br />
                                            {getStatusTimeline(order.Status)}
                                            {order.Discount === 1 ? (
                                                <>
                                                    <strong>總金額:</strong><span> NT${order.Amount}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <strong>總金額:</strong><del> NT${order.Amount}</del>
                                                    <span> NT${(order.Amount * order.Discount).toFixed(0)}</span>
                                                </>
                                            )}
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ListGroup variant="flush">
                                            {order.Details.map(detail => (
                                                <ListGroup.Item key={detail.PVCID}>
                                                    <Row>
                                                        <Col md={2}>
                                                            <Link to={`/PVC/${detail.PVCID}`}>
                                                                {detail.Images.length > 0 ? (
                                                                    <img src={detail.Images[0]} alt={detail.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div style={{ width: '100%', height: '100%' }}></div>
                                                                )}
                                                            </Link>
                                                        </Col>
                                                        <Col md={10}>
                                                            <Row>
                                                                <Link to={`/PVC/${detail.PVCID}`}>
                                                                    <h5>{detail.Name}</h5>
                                                                </Link>
                                                                <br />
                                                                <span className='text-end text-muted'>
                                                                    x{detail.Quantity}
                                                                </span>
                                                                <br />
                                                                <div className='mt-2 text-end'>
                                                                    {order.Discount === 1 ? (
                                                                        <span>
                                                                            NT${detail.Price * detail.Quantity}
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            <del className='text-muted small'>NT${detail.Price * detail.Quantity}</del>
                                                                            <span> NT${(detail.Price * detail.Quantity * order.Discount).toFixed(0)}</span>
                                                                        </span>
                                                                    )}
                                                                </div>

                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                            <ListGroup.Item>
                                                <Accordion>
                                                    <Accordion.Item eventKey={`${order.OrderID}-discount`}>
                                                        <Accordion.Header>
                                                            <span>訂單金額: NT${(order.Amount * order.Discount).toFixed(0)}</span>
                                                        </Accordion.Header>
                                                        <Accordion.Body>
                                                            <Row>
                                                                <Col md={6} className='text-start'>
                                                                    <div>
                                                                        <p>商品總金額</p>
                                                                        {order.Discount !== 1 && <p>全站優惠券</p>}
                                                                    </div>
                                                                </Col>
                                                                <Col md={6} className='text-end'>
                                                                    <div>
                                                                        <p>${order.Amount}</p>
                                                                        {order.Discount !== 1 && <p>-${(order.Amount - order.Amount * order.Discount).toFixed(0)}</p>}
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        ))
                        }
                    </div >
                </Card >
            }
        </>
    );
};

export default UserOrders;