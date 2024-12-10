import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserBadgeProps } from './types';

const UserBadge: React.FC<UserBadgeProps> = ({ username }) => {
    return (
        <div className="d-flex align-items-center">
            <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                style={{ width: '40px', height: '40px', marginRight: '10px' }}
            >
                {username.charAt(0).toUpperCase()}
            </div>
            <div>
                {username}
            </div>
        </div>
    );
};

export default UserBadge;
