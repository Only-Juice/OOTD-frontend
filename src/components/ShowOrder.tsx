import React from "react";
import { Card, List, Row, Col, Collapse, Typography, Steps, Divider, Grid } from "antd";
import { Link } from "react-router-dom";
import type { Order } from "../types";

const { Title } = Typography;
const { Panel } = Collapse;
const { useBreakpoint } = Grid;



interface ShowOrderProps {
    data: Order[];
}

const ShowOrder: React.FC<ShowOrderProps> = ({ data }) => {
    const screens = useBreakpoint();

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

        const stepsComponent = (
            <Steps
                className='mt-2'
                progressDot
                current={statuses.indexOf(status)}
                direction={screens.xxl ? "horizontal" : "vertical"}
                size="small"
            >
                {statuses.map((s, index) => (
                    <Steps.Step key={index} title={s} />
                ))}
            </Steps>
        );

        if (screens.xxl) {
            return stepsComponent;
        } else {
            return (
                <Collapse>
                    <Panel header="查看配送狀態" key="1">
                        {stepsComponent}
                    </Panel>
                </Collapse>
            );
        }
    };

    return (
        <Card>
            <div className="m-3">
                <Title level={2}>訂單資訊</Title>
                <Divider />
                {data.map((order: Order) => (
                    <Collapse className='mb-2' key={order.OrderID}>
                        <Panel header={
                            <div>
                                <strong>訂單編號:</strong> <span>{order.OrderID}</span> <br />
                                {order.Username && <><strong>訂購人: </strong><span>{order.Username}</span><br /></>}
                                {order.Address && <><strong>送貨地址: </strong><span>{order.Address}</span><br /></>}
                                <strong>訂單日期:</strong> <span>{new Date(order.CreateAt).toLocaleString('zh-TW')}</span> <br />
                                <strong>折扣:</strong> <span>{order.Discount === 1 ? '無折扣' : `${(order.Discount * 10).toFixed(2).replace(/\.?0+$/, '')}折`}</span> <br />
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
                        } key={`${order.OrderID}`}>
                            <List
                                itemLayout="vertical"
                                dataSource={order.Details}
                                renderItem={detail => (
                                    <List.Item key={detail.PVCID}>
                                        <Row>
                                            <Col md={4}>
                                                <Link to={`/PVC/${detail.PVCID}`}>
                                                    {detail.Images.length > 0 ? (
                                                        <img src={detail.Images[0]} alt={detail.Name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%' }}></div>
                                                    )}
                                                </Link>
                                            </Col>
                                            <Col md={20} className="p-lg-3">
                                                <Row>
                                                    <Col md={24}>
                                                        <Link to={`/PVC/${detail.PVCID}`}>
                                                            <h5>{detail.Name}</h5>
                                                        </Link>
                                                    </Col>
                                                    <Col md={24} className="text-end">
                                                        <span className='text-muted'>
                                                            x{detail.Quantity}
                                                        </span>
                                                    </Col>
                                                    <Col md={24}>
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
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </List.Item>
                                )}
                            />
                            <Collapse>
                                <Panel header={<span>訂單金額: NT${(order.Amount * order.Discount).toFixed(0)}</span>} key={`${order.OrderID}-discount`}>
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
                                </Panel>
                            </Collapse>
                        </Panel>
                    </Collapse>
                ))}
            </div>
        </Card>
    );
}

export default ShowOrder;