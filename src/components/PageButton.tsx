import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

const PageButton: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1', 10);

    const createPageLink = (newPage: number) => {
        queryParams.set('page', newPage.toString());
        return `?${queryParams.toString()}`;
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div style={{ visibility: page > 1 ? 'visible' : 'hidden' }}>
                <Link to={createPageLink(page - 1)} onClick={() => window.scrollTo(0, 0)}>
                    <Button variant='outline-primary'>上一頁</Button>
                </Link>
            </div>
            <p className="mx-2 my-0">Page: {page}</p>
            <div>
                <Link to={createPageLink(page + 1)} onClick={() => window.scrollTo(0, 0)}>
                    <Button variant='outline-primary'>下一頁</Button>
                </Link>
            </div>
        </div>
    );
};

export default PageButton;