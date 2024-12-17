import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { SearchProduct } from '../types';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import PageButton from './PageButton';

const SearchResults: React.FC = () => {
    const [searchResults, setSearchResults] = useState<SearchProduct | null>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchWord = queryParams.get('q');
    const page = parseInt(queryParams.get('page') || '1', 10);
    const sortOrder = queryParams.get('sortOrder') || true;
    const sortField = queryParams.get('sortField') || 'Default';
    const navigate = useNavigate();

    const { isLoading, error, data } = useQuery({
        queryKey: [`SearchProducts_${searchWord}_${page}_${sortField}_${sortOrder}`],
        queryFn: () => {
            setSearchResults(null);
            if (!searchWord) return Promise.resolve(null);
            return fetch(`/api/Product/SearchProducts?keyword=${searchWord}&page=${page}&pageLimitNumber=30&orderField=${sortField}&isASC=${sortOrder}`, {
                method: 'POST',
            }).then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
        },
    });

    useEffect(() => {
        if (data) {
            setSearchResults(data);
        }
    }, [data]);

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {!isLoading && error && <p style={{ color: 'red' }}>{error.message}</p>}
            {!isLoading && !searchResults && !error && <p>找不到相關結果</p>}
            {!isLoading && searchResults && searchResults.Products.length > 0 && (
                <>
                    <Form.Group controlId="sortSelect" className='mb-4'>
                        <Form.Label>排序方式</Form.Label>
                        <Form.Control
                            as="select"
                            value={`${sortField}-${sortOrder}`}
                            onChange={(e) => {
                                navigate(`?q=${searchWord}&page=${page}&sortField=${e.target.value.split('-')[0]}&sortOrder=${e.target.value.split('-')[1]}`);
                            }}
                        >
                            <option value="Default-true">預設 (由小到大)</option>
                            <option value="Default-false">預設 (由大到小)</option>
                            <option value="Price-true">價格 (由小到大)</option>
                            <option value="Price-false">價格 (由大到小)</option>
                            <option value="Quantity-true">數量 (由小到大)</option>
                            <option value="Quantity-false">數量 (由大到小)</option>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        {searchResults.Products.map(product => (
                            <Col key={product.ID} md={4} className='mb-4'>
                                <ProductCard key={product.ID} product={product} />
                            </Col>
                        ))}
                    </Row>
                    <PageButton PageCount={searchResults.PageCount} />
                </>
            )}
        </>
    );
};

export default SearchResults;
