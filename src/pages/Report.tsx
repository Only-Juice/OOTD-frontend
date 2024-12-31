import React, { useState } from "react";
import { Button, Input, Form} from "antd";  // 使用 Ant Design 元素

const Report: React.FC = () => {
    const [newRequest, setNewRequest] = useState<string>('');  // 儲存用戶輸入的訊息

    // 提交表單
    const handleSubmit = () => {

        const encodedMessage = encodeURIComponent(newRequest);

        fetch(`/api/Request/SendRequest?message=${encodedMessage}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/octet-stream', // 設置接受的媒體類型
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // 使用本地儲存的 token 作為授權
            },
            body: '',  // 這裡不需要設置 request body，因為訊息已經作為 URL 查詢參數傳遞
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send request');
                }
                return response.json();
            })
            .then(data => {
                console.log('Request sent successfully', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div className="container">
            <h1>問題回報</h1>
            <p>OOTD十分注重用戶的體驗，如果你遇到了與店家的不愉快，歡迎在此回報</p>
            <p>客服人員會盡速與店家聯絡，並做出相對應的處理</p>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Input.TextArea
                    value={newRequest}
                    onChange={(e) => setNewRequest(e.target.value)}
                    rows={4}
                    placeholder="請輸入您想回報的訊息..."
                />
                <Form.Item style={{marginTop: '16px'}}> {/* 增加 marginTop 來拉開距離 */}
                    <Button type="primary" htmlType="submit">
                        發送請求
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Report;
