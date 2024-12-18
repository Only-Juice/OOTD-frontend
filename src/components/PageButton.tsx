import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import '../styles/PageButton.css';

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

    const getPageNumbers = (currentPage: number, totalPages: number) => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= maxPagesToShow; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...', totalPages);
            } else if (currentPage > 4 && currentPage < totalPages - 3) {
                pageNumbers.push(1, '...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...', totalPages);
            } else {
                pageNumbers.push(1, '...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            }
        }

        return pageNumbers;
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center mb-4">
                {page > 1 ? (
                    <Link to={createPageLink(page - 1)} onClick={scrollToTop}>
                        <Button variant='outline-primary' className="rounded-circle page-button">
                            <FaAngleLeft />
                        </Button>
                    </Link>
                ) : (
                    <Button variant='outline-primary' className="rounded-circle page-button" disabled>
                        <FaAngleLeft />
                    </Button>
                )}
                <div className="mx-2 my-0">
                    {getPageNumbers(page, PageCount).map((pageNumber, index) => (
                        pageNumber === '...' ? (
                            <span key={index} className="mx-2">...</span>
                        ) : (
                            <Link key={index} to={createPageLink(Number(pageNumber))} onClick={scrollToTop}>
                                <Button variant={pageNumber === page ? 'outline-primary' : ''} className="rounded-circle page-button">{pageNumber}</Button>
                            </Link>
                        )
                    ))}
                </div>
                {page < PageCount ? (
                    <Link to={createPageLink(page + 1)} onClick={scrollToTop}>
                        <Button variant='outline-primary' className="rounded-circle page-button">
                            <FaAngleRight />
                        </Button>
                    </Link>
                ) : (
                    <Button variant='outline-primary' className="rounded-circle page-button" disabled>
                        <FaAngleRight />
                    </Button>
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