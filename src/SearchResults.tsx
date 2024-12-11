import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col, Form, Container, Spinner } from 'react-bootstrap';
import { Product } from './types';
import ProductCard from './ProductCard';

const SearchResults: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [originalResults, setOriginalResults] = useState<Product[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'default'>('default');
    const [sortField, setSortField] = useState<'Price' | 'Quantity' | 'default'>('default');
    const [loading, setLoading] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchWord = queryParams.get('q');

        if (searchWord) {
            setLoading(true);
            fetch(`/api/Product/SearchProducts?searchWord=${searchWord}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                },
                body: '',
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (data.length === 0) {
                        setSearchError('找不到相關結果');
                        setSearchResults([]);
                        setOriginalResults([]);
                    } else {
                        setSearchError(null);
                        setSearchResults(data);
                        setOriginalResults(data);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setSearchError('搜尋過程中發生錯誤');
                    setSearchResults([]);
                    setOriginalResults([]);
                });
        }
    }, [location.search]);

    const handleSort = (field: 'Price' | 'Quantity' | 'default', order: 'asc' | 'desc' | 'default') => {
        if (field === 'default' && order === 'default') {
            setSearchResults(originalResults);
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
        <Container>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">正在搜尋</span>
                </div>
            )}
            {!loading && searchError && <p style={{ color: 'red' }}>{searchError}</p>}
            {!loading && searchResults.length === 0 && !searchError && <p>找不到相關結果</p>}
            {!loading && searchResults.length > 0 && (
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
        </Container>
    );
};

export default SearchResults;
