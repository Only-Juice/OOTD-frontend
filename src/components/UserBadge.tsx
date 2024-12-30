import React from 'react';
import { UserBadgeProps } from '../types';
import { Badge } from 'react-bootstrap';

const UserBadge: React.FC<UserBadgeProps> = ({ username, size = 40 }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge
                pill
                bg="primary"
                className="d-flex justify-content-center align-items-center"
                style={{ width: `${size}px`, height: `${size}px`, marginRight: '10px', fontSize: `${size * 0.4}px` }}
            >
                {username.charAt(0).toUpperCase()}
            </Badge>
            <div style={{ whiteSpace: 'nowrap', fontSize: `${size * 0.4}px` }}>
                {username}
            </div>
        </div >
    );
};

export default UserBadge;
