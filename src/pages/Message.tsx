import React, { useState, useEffect } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import { useQuery } from "@tanstack/react-query";


interface Message {
    IsSender: boolean;
    Message: string;
    CreatedAt: string;
}

const Message: React.FC = ({ setIsModalOpen }) => {
    const [Messages, setMessages] = useState<Record<number, Message[]>>({});
    const [currentContactUID, setCurrentContactUID] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState<string>('');
    const token = localStorage.getItem('token');

    // 如果沒有 token，開啟 Modal
    useEffect(() => {
        if (token == null) {
            setIsModalOpen(true);
        }
    }, [token]);

    const { data: Contact, isLoading } = useQuery({
        queryKey: [`GetContacts`],
        queryFn: () =>
            fetch(`/api/Message/GetContacts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            }),
    });

    useEffect(() => {
        if (!Contact || Contact.length === 0) return;

        Contact.forEach(contact => {
            fetch(`/api/Message/GetMessages/?contactUID=${contact.UID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setMessages(prevMessages => ({
                        ...prevMessages,
                        [contact.UID]: data,
                    }));
                })
                .catch(error => {
                    console.error(`Error fetching messages for contact ${contact.UID}:`, error);
                });
        });
    }, [Contact]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            return;
        }

        const messageData = {
            ContactUID: currentContactUID,
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
                return response.json();
            })
            .then(data => {
                const newMessageData: Message = {
                    IsSender: true,
                    Message: newMessage,
                    CreatedAt: new Date().toISOString(),
                };

                setMessages(prevMessages => ({
                    ...prevMessages,
                    [currentContactUID!]: [
                        ...(prevMessages[currentContactUID!] || []),
                        newMessageData,
                    ],
                }));

                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    };

    if (isLoading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            {/* 左側聯絡人列表 */}
            <div style={{width: '300px', padding: '20px', borderRight: '1px solid #ddd', overflowY: 'auto'}}>
                <h1>聯絡人列表</h1>
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {Contact?.map(contact => (
                        <li
                            key={contact.UID}
                            style={{
                                cursor: 'pointer',
                                backgroundColor: currentContactUID === contact.UID ? '#e6f7ff' : '#fff', // 選擇的聯絡人背景顏色
                                padding: '10px',
                                borderRadius: '8px', // 圓角效果
                                borderBottom: '1px solid #ddd', // 使每個框框之間有邊界，像連接起來
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)', // 增加陰影
                                transition: 'background-color 0.3s ease', // 背景顏色的過渡效果
                                marginBottom: '0', // 去掉每個框框之間的間隔
                            }}
                            onClick={() => setCurrentContactUID(contact.UID)}
                        >
                            <strong>Username:</strong> {contact.Username}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 右側訊息區域 */}
            <div style={{flex: 1, padding: '20px', overflowY: 'auto'}}>
                {currentContactUID !== null && Messages[currentContactUID] ? (
                    <div>
                        <h2>
                            與外送茶販賣員
                            {Contact?.find(contact => contact.UID === currentContactUID)?.Username || 'Unknown User'}
                            的對話
                        </h2>
                        <div style={{maxHeight: '400px', overflowY: 'auto', marginBottom: '20px'}}>
                            <ul style={{listStyleType: 'none', padding: 0}}>
                                {Messages[currentContactUID!]?.map((message, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            textAlign: message.IsSender ? 'right' : 'left',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {/* 顯示發送者名稱，且排除自己發送的訊息 */}
                                        {!message.IsSender && (
                                            <div>
                                                <strong>
                                                    {Contact?.find(contact => contact.UID === currentContactUID)?.Username || 'Unknown User'}
                                                </strong>
                                            </div>
                                        )}
                                        {/* 訊息顯示框 */}
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                backgroundColor: '#f1f1f1',
                                                padding: '10px',
                                                borderRadius: '5px',
                                                maxWidth: '60%',
                                                margin: '5px',
                                                border: '1px solid #ddd',
                                            }}
                                        >
                                            {message.Message}
                                        </div>
                                        <div>
                                            <em>{new Date(message.CreatedAt).toLocaleString()}</em>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 輸入框 */}
                        <Form.Item label="New Message">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onPressEnter={handleSendMessage}
                                placeholder="輸入訊息..."
                            />
                        </Form.Item>
                        <Button type="primary" onClick={handleSendMessage}>
                            Send Message
                        </Button>
                    </div>
                ) : (
                    <div style={{padding: '20px'}}>
                        <h3>請選擇一個聯絡人查看訊息</h3>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Message;
