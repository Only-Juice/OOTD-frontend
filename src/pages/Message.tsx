import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Spin } from 'antd';
import { useQuery } from "@tanstack/react-query";

interface Contact {
    UID: number;
    Username: string;
}

interface Message {
    IsSender: boolean;
    Message: string;
    CreatedAt: string;
}

const Message: React.FC = ({ setIsModalOpen }) => {
    const [Contacts, setContacts] = useState<Contact[]>([]);
    const [Messages, setMessages] = useState<Record<number, Message[]>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
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
        if (!Contact || Contact.length === 0) return; // 如果聯絡人數據還沒獲取完成，則不發送請求

        // 遍歷聯絡人並獲取每個聯絡人的訊息
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
                        [contact.UID]: data, // 根據 UID 儲存每個聯絡人的訊息
                    }));
                })
                .catch(error => {
                    console.error(`Error fetching messages for contact ${contact.UID}:`, error);
                });
        });
    }, [Contact]);

    const showMessagesModal = (contactUID: number) => {
        setCurrentContactUID(contactUID);
        setIsModalVisible(true); // 顯示對話框
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewMessage(''); // 清空訊息輸入框
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            return; // 如果訊息內容為空，則不執行發送操作
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

    // 在 Contact 尚未載入完成時顯示加載中指示器
    if (isLoading) {
        return <Spin size="large" />;
    }

    return (
        <div>
            <h1>Contacts</h1>
            <h2>聯絡人列表</h2>
            <ul>
                {Contact?.map(contact => (
                    <li key={contact.UID}>
                        <strong>Username:</strong> {contact.Username}
                        <Button onClick={() => showMessagesModal(contact.UID)}>查看訊息</Button>
                    </li>
                ))}
            </ul>

            {/* 顯示訊息的對話框 */}
            <Modal
                title={`Messages with ${
                    Contact?.find(contact => contact.UID === currentContactUID)?.Username || "Unknown User"
                }`}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>,
                    <Button key="send" type="primary" onClick={handleSendMessage}>
                        Send Message
                    </Button>,
                ]}
            >
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                    <ul>
                        {Messages[currentContactUID!]?.map((message, index) => (
                            <li key={index} style={{ textAlign: message.IsSender ? 'right' : 'left' }}>
                                <p><strong>{message.IsSender ? 'You' : 'Receiver'}:</strong> {message.Message}</p>
                                <p><em>{new Date(message.CreatedAt).toLocaleString()}</em></p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 輸入框，用來發送新的訊息 */}
                <Form.Item label="New Message">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onPressEnter={handleSendMessage}
                    />
                </Form.Item>
            </Modal>
        </div>
    );
};

export default Message;
