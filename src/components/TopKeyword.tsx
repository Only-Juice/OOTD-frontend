import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const TopKeyword: React.FC = () => {
    const navigate = useNavigate();
    const { data } = useQuery<string[]>({
        queryKey: ['GetTopKeyword'],
        queryFn: () => fetch('/api/Keyword/GetTopKeyword?count=10').then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }),
    });

    return (
        <div className='mt-2 d-flex align-items-center' style={{ height: '1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ color: 'var(--text-color)' }}>熱門搜尋: </span>
            {data && data.length > 0 && (
                <ul className="list-inline mb-0">
                    {data.map((keyword: string) => (
                        <li key={keyword} className="list-inline-item" style={{ display: 'inline' }}>
                            <button
                                className="btn btn-link p-0 text-left"
                                onClick={() => navigate(`/search?q=${keyword}`)}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                {keyword}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TopKeyword;