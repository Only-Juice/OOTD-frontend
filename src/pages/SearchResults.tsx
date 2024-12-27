import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';
import { SearchProduct } from '../types';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import PageButton from '../components/PageButton';
import BriefStoreSearch from '../components/BriefStoreSearch';
import { SearchStoresResponse } from "../types";
import { Skeleton } from 'antd';

const SearchResults: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchWord = queryParams.get('q');
    const page = parseInt(queryParams.get('page') || '1', 10);
    const sortOrder = queryParams.get('sortOrder') || false;
    const sortField = queryParams.get('sortField') || 'Sale';
    const navigate = useNavigate();

    const { isLoading: isLoadingSearchStores, data: dataSearchStoresResponse } = useQuery<SearchStoresResponse>({
        queryKey: [`SearchStores_${searchWord}`],
        queryFn: () => {
            if (!searchWord) return Promise.resolve(null);
            return fetch(`/api/Store/SearchStores?keyword=${searchWord}`, {
                method: 'GET',
            }).then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
        },
    });


    const { isLoading: isLoadingSearchProduct, error, data: searchResults } = useQuery<SearchProduct>({
        queryKey: [`SearchProducts_${searchWord}_${page}_${sortField}_${sortOrder}`],
        queryFn: () => {
            if (!searchWord) return Promise.resolve(null);
            return fetch(`/api/Product/SearchProducts?keyword=${searchWord}&page=${page}&pageLimitNumber=30&orderField=${sortField}&isASC=${sortOrder}`, {
                method: 'GET',
            }).then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
        },
    });

    return (
        <>
            <Skeleton loading={isLoadingSearchStores} active>
                <BriefStoreSearch data={dataSearchStoresResponse} />
            </Skeleton>
            <Skeleton loading={isLoadingSearchProduct} active>
                {!isLoadingSearchProduct && error && <p style={{ color: 'red' }}>{error.message}</p>}
                {!isLoadingSearchProduct && !searchResults && !error && <p>找不到相關結果</p>}
                {searchResults && searchResults.Products.length > 0 && (
                    <>
                        <Form.Group controlId="sortSelect" className='mb-4'>
                            <Form.Label>排序方式</Form.Label>
                            <Form.Control
                                as="select"
                                value={`${sortField}-${sortOrder}`}
                                onChange={(e) => {
                                    navigate(`?q=${searchWord}&page=1&sortField=${e.target.value.split('-')[0]}&sortOrder=${e.target.value.split('-')[1]}`);
                                }}
                            >
                                <option value="Sale-true">銷量 (由小到大)</option>
                                <option value="Sale-false">銷量 (由大到小)</option>
                                <option value="Price-true">價格 (由小到大)</option>
                                <option value="Price-false">價格 (由大到小)</option>
                                <option value="Quantity-true">數量 (由小到大)</option>
                                <option value="Quantity-false">數量 (由大到小)</option>
                                <option value="Default-false">上架時間 (由新到舊)</option>
                                <option value="Default-true">上架時間 (由舊到新)</option>
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
            </Skeleton>
        </>
    );
};

export default SearchResults;
