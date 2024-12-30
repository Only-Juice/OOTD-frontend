import React from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import PageButton from '../components/PageButton';
import { SearchStoresResponse } from "../types";
import { Skeleton } from 'antd';
import StoreShow from '../components/StoreShow';

const SearchStore: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchWord = queryParams.get('q');
    const page = parseInt(queryParams.get('page') || '1', 10);

    const { isLoading: isLoadingSearchStores, error, data: dataSearchStoresResponse } = useQuery<SearchStoresResponse>({
        queryKey: [`SearchStores_${searchWord}`, page],
        queryFn: () => {
            if (!searchWord) return Promise.resolve(null);
            return fetch(`/api/Store/SearchStores?keyword=${searchWord}&page=${page}`, {
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
                {!isLoadingSearchStores && error && <p style={{ color: 'red' }}>{error.message}</p>}
                {!isLoadingSearchStores && !dataSearchStoresResponse && !error && <p>找不到相關結果</p>}
                {dataSearchStoresResponse && dataSearchStoresResponse.Stores.length > 0 && (
                    <>
                        <Row>
                            {dataSearchStoresResponse.Stores.map(store => (
                                <Col key={store.StoreID} md={12} className='mb-4'>
                                    <StoreShow key={store.StoreID} store={store} />
                                </Col>
                            ))}
                        </Row>
                        <PageButton PageCount={dataSearchStoresResponse.PageCount} />
                    </>
                )}
            </Skeleton>
        </>
    );
};

export default SearchStore;
