import React from 'react';
import { UserInfo } from '../types';
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserPage: React.FC<{ userInfo: UserInfo | null }> = ({ userInfo }) => (
    <Container>
        <Row className="justify-content-md-center">
            <Col md="auto">
                <h2>User Page</h2>
                {userInfo ? (
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <strong>Username:</strong> {userInfo.Username}
                            </Card.Text>
                            <Card.Text>
                                <strong>Email:</strong> {userInfo.Email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Address:</strong> {userInfo.Address}
                            </Card.Text>
                            <Card.Text>
                                <strong>Administrator:</strong> {userInfo.IsAdministrator ? 'Yes' : 'No'}
                            </Card.Text>
                            <Card.Text>
                                <strong>Have Store:</strong> {userInfo.HaveStore ? 'Yes' : 'No'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ) : (
                    <p>Unable to get User Data</p>
                )}
            </Col>
        </Row>
    </Container>
);

export default UserPage;