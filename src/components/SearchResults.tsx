import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';

const SearchResults: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
    const [sortField, setSortField] = useState<'Price' | 'Quantity' | 'default'>('default');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchWord = queryParams.get('q');

    const { isPending, error, data } = useQuery({
        queryKey: [`SearchProducts_${searchWord}`],
        queryFn: () => {
            setSearchResults([]);
            if (!searchWord) return Promise.resolve(null);
            return fetch(`/api/Product/SearchProducts?searchWord=${searchWord}`, {
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

    const handleSort = (field: 'Price' | 'Quantity' | 'default', order: 'asc' | 'desc' | 'default') => {
        if (field === 'default' && order === 'default') {
            setSearchResults(data);
        } else {
            const sortedResults = [...searchResults].sort((a, b) => {
                if (order === 'asc') {
                    return (a[field as 'Price' | 'Quantity'] as number) - (b[field as 'Price' | 'Quantity'] as number);
                } else {
                    return (b[field as 'Price' | 'Quantity'] as number) - (a[field as 'Price' | 'Quantity'] as number);
                }
            });
            setSearchResults(sortedResults);
        }
        setSortOrder(order);
        setSortField(field);
    };

    return (
        <>
            {isPending && (
                <Loading />
            )}
            {!isPending && error && <p style={{ color: 'red' }}>{error.message}</p>}
            {!isPending && searchResults.length === 0 && !error && <p>找不到相關結果</p>}
            {!isPending && searchResults.length > 0 && (
                <>
                    <Form.Group controlId="sortSelect" className='mb-4'>
                        <Form.Label>Sort by</Form.Label>
                        <Form.Control
                            as="select"
                            value={`${sortField}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-') as ['Price' | 'Quantity' | 'default', 'asc' | 'desc' | 'default'];
                                handleSort(field, order);
                            }}
                        >
                            <option value="default-default">Default</option>
                            <option value="Price-asc">Price (Ascending)</option>
                            <option value="Price-desc">Price (Descending)</option>
                            <option value="Quantity-asc">Quantity (Ascending)</option>
                            <option value="Quantity-desc">Quantity (Descending)</option>
                        </Form.Control>
                    </Form.Group>
                    <Row>
                        {searchResults.map(product => (
                            <Col key={product.ID} md={4} className='mb-4'>
                                <ProductCard key={product.ID} product={product} />
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    );
};

export default SearchResults;
