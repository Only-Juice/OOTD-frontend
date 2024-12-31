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
            <h1>挖肏牛逼</h1>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="輸入請求訊息" required>
                    <Input.TextArea
                        value={newRequest}
                        onChange={(e) => setNewRequest(e.target.value)}
                        rows={4}
                        placeholder="請輸入您想發送的訊息..."
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        發送請求
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Report;
