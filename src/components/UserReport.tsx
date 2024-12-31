import React, { useEffect, useState } from 'react';

interface ReportMessage {
    CreateAt: string;
    Message: string;
    Status: string;
}

const UserReport: React.FC = () => {
    const [Reports, setReportMessage] = useState<ReportMessage[]>([]);

    useEffect(() => {
        fetch('/api/Request/GetOwnRequests', {
            method: 'GET',  // 请求方法为 GET
            headers: {
                'Content-Type': 'application/json', // 根据需要添加请求头
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setReportMessage(data); // 假设返回的数据是数组形式
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, []);

    return (
        <div>
            <h1>User Reports</h1>
            {Reports.length > 0 ? (
                <ul>
                    {Reports.map((report, index) => (
                        <li key={index}>
                            <p><strong>Created At:</strong> {report.CreateAt}</p>
                            <p><strong>Message:</strong> {report.Message}</p>
                            <p><strong>Status:</strong> {report.Status}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reports available.</p>
            )}
        </div>
    );
}

export default UserReport;
