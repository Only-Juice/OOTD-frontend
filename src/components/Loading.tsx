import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spinner animation="border" />
            <span className="ml-2">載入中</span>
        </div>
    );
};

export default Loading;