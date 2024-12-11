import React from 'react';
import { UserInfo } from './types';


const UserPage: React.FC<{ userInfo: UserInfo | null }> = ({ userInfo }) => (
    <div>
        <h2>User Page</h2>
        {userInfo ? (
            <div>
                <p>Username: {userInfo.Username}</p>
                <p>Email: {userInfo.Email}</p>
                <p>Address: {userInfo.Address}</p>
                <p>Administrator: {userInfo.IsAdministrator ? 'Yes' : 'No'}</p>
                <p>Have Store: {userInfo.HaveStore ? 'Yes' : 'No'}</p>
            </div>
        ) : (
            <p>Unable to get User Data</p>
        )}
    </div>
);

export default UserPage;