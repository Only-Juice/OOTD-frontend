import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import type { ModalProps } from 'antd';

interface Contact {
    UID: number;
    Username: string;
}

interface Message {
    IsSender: boolean;
    Message: string;
    CreatedAt: string;  // 這裡可以表示為字符串（ISO 8601 格式）
}

const Message: React.FC = ({ setIsModalOpen }) => {
    const [Contacts, setContacts] = useState<Contact[]>([]); // 儲存聯絡人數據
    const [Messages, setMessages] = useState<Record<number, Message[]>>({}); // 用來儲存每個聯絡人的訊息
    const [isModalVisible, setIsModalVisible] = useState(false); // 控制對話框顯示
    const [currentContactUID, setCurrentContactUID] = useState<number | null>(null); // 當前查看的聯絡人 UID
    const [newMessage, setNewMessage] = useState<string>(''); // 用來存儲新訊息
    const token = localStorage.getItem('token');

    // 如果沒有 token，開啟 Modal
    useEffect(() => {
        if (token == null) {
            setIsModalOpen(true);
        }
    }, [token]);

    // 獲取聯絡人列表
    useEffect(() => {
        fetch('/api/Message/GetContacts', {
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
                setContacts(data); // 更新聯絡人數據
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
            });
    }, []); // 空陣列表示該 effect 僅在組件加載時執行一次

    // 根據聯絡人 UID 獲取對應的訊息
    useEffect(() => {
        if (Contacts.length === 0) return; // 如果聯絡人數據還沒獲取完成，則不發送請求

        Contacts.forEach(contact => {
            // 使用聯絡人的 UID 發送請求獲取該聯絡人的訊息
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
    }, [Contacts]); // 依賴於 Contacts，當聯絡人列表變動時會重新發送請求

    // 顯示對話框並加載該聯絡人的訊息
    const showMessagesModal = (contactUID: number) => {
        setCurrentContactUID(contactUID); // 設置當前查看的聯絡人
        setIsModalVisible(true); // 顯示對話框
    };

    // 關閉對話框
    const handleCancel = () => {
        setIsModalVisible(false);
        setNewMessage(''); // 清空訊息輸入框
    };

    // 發送新訊息
    const handleSendMessage = () => {
        if (!newMessage.trim()) {
            return; // 如果訊息內容為空，則不執行發送操作
        }

        const messageData = {
            ContactUID: currentContactUID,
            Message: newMessage,
        };

        // 發送訊息到 API
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
                // 如果發送成功，更新訊息數據
                const newMessageData: Message = {
                    IsSender: true,
                    Message: newMessage,
                    CreatedAt: new Date().toISOString(),
                };

                // 更新 UI，顯示新發送的訊息
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [currentContactUID!]: [
                        ...(prevMessages[currentContactUID!] || []),
                        newMessageData,
                    ],
                }));

                // 清空訊息輸入框
                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    };

    return (
        <div>
            <h1>肏你媽</h1>
            <h2>Contacts</h2>
            <ul>
                {Contacts.map(contact => (
                    <li key={contact.UID}>
                        <strong>Username:</strong> {contact.Username}
                        <Button onClick={() => showMessagesModal(contact.UID)}>查看訊息</Button>
                    </li>
                ))}
            </ul>

            {/* 顯示訊息的對話框 */}
            <Modal
                title={`Messages with ${Contacts.find(contact => contact.UID === currentContactUID)?.Username}`}
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