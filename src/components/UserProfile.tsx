import React, { useEffect } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

const UserProfile: React.FC = () => {
    const { isPending, data, refetch } = useQuery({
        queryKey: [`UserInfo`],
        queryFn: () => {
            if (!localStorage.getItem('token')) return null;
            return fetch('/api/User/Get', {
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

    return <>
        {isPending && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" />
                <span className="ml-2">載入中</span>
            </div>
        )}
        <Row>
            <Col md="auto">
                {data ? (
                    <>
                        <h2>用戶資訊</h2>
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    <strong>用戶名稱:</strong> {data.Username}
                                </Card.Text>
                                <Card.Text>
                                    <strong>電子郵件:</strong> {data.Email}
                                </Card.Text>
                                <Card.Text>
                                    <strong>地址:</strong> {data.Address}
                                </Card.Text>
                                <Card.Text>
                                    <strong>管理員權限:</strong> {data.IsAdministrator ? 'Yes' : 'No'}
                                </Card.Text>
                                <Card.Text>
                                    <strong>擁有商店:</strong> {data.HaveStore ? 'Yes' : 'No'}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </>
                ) : (
                    <></>
                )}
            </Col>
        </Row>;
    </>
};

export default UserProfile;