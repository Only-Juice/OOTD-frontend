import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserBadgeProps } from './types';
import { Badge } from 'react-bootstrap';

const UserBadge: React.FC<UserBadgeProps> = ({ username }) => {
    return (
        <>
            <Badge
                pill
                bg="primary"
                className="d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px', marginRight: '10px' }}
            >
                {username.charAt(0).toUpperCase()}
            </Badge>
            <div style={{ whiteSpace: 'nowrap' }}>
                {username}
            </div>
        </>
    );
};

export default UserBadge;
