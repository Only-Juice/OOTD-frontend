import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

interface PageButtonProps {
    PageCount: number;
}

const PageButton: React.FC<PageButtonProps> = ({ PageCount }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page') || '1', 10);

    const createPageLink = (newPage: number) => {
        queryParams.set('page', newPage.toString());
        return `?${queryParams.toString()}`;
    };

    const scrollToTop = () => {
        // https://stackoverflow.com/questions/24616322/mobile-safari-why-is-window-scrollto0-0-not-scrolling-to-0-0
        setTimeout(() => {
            window.scroll({ top: -1, left: 0, behavior: "smooth" });
        }, 10);
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center mb-4">
                {page > 1 ? (
                    <Link to={createPageLink(page - 1)} onClick={scrollToTop}>
                        <Button variant='outline-primary'>上一頁</Button>
                    </Link>
                ) : (
                    <Button variant='outline-primary' disabled>上一頁</Button>
                )}
                <p className="mx-2 my-0">Page: {page}</p>
                {page < PageCount ? (
                    <Link to={createPageLink(page + 1)} onClick={scrollToTop}>
                        <Button variant='outline-primary'>下一頁</Button>
                    </Link>
                ) : (
                    <Button variant='outline-primary' disabled>下一頁</Button>
                )}
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <Link to='/' onClick={scrollToTop}>
                    <strong>Oh Online Tea Delivery</strong>
                </Link>
            </div>
        </>
    );
};

export default PageButton;