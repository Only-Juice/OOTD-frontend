import React from "react";
import { UserInfo } from "../types";
import { Row, Col, Card } from "react-bootstrap";

const UserProfile: React.FC<{ userInfo: UserInfo | null | undefined }> = ({ userInfo }) => (
    <Row>
        <Col md="auto">
            {userInfo ? (
                <>
                    <h2>用戶頁面</h2>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <strong>用戶名稱:</strong> {userInfo.Username}
                            </Card.Text>
                            <Card.Text>
                                <strong>電子郵件:</strong> {userInfo.Email}
                            </Card.Text>
                            <Card.Text>
                                <strong>地址:</strong> {userInfo.Address}
                            </Card.Text>
                            <Card.Text>
                                <strong>管理員權限:</strong> {userInfo.IsAdministrator ? 'Yes' : 'No'}
                            </Card.Text>
                            <Card.Text>
                                <strong>擁有商店:</strong> {userInfo.HaveStore ? 'Yes' : 'No'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </>
            ) : (
                <></>
            )}
        </Col>
    </Row>
);

export default UserProfile;