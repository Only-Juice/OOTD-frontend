import React from 'react';
import { UserBadgeProps } from '../types';
import { Badge } from 'react-bootstrap';

const UserBadge: React.FC<UserBadgeProps> = ({ username, size }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge
                pill
                bg="primary"
                className="d-flex justify-content-center align-items-center"
                style={{ width: size ? `${size}px` : '40px', height: size ? `${size}px` : '40px', marginRight: '10px' }}
            >
                {username.charAt(0).toUpperCase()}
            </Badge>
            <div style={{ whiteSpace: 'nowrap' }}>
                {username}
            </div>
        </div >
    );
};

export default UserBadge;
