import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Product } from '../types';
import ProductContainer from './ProductContainer';

const ProductResult: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Product | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/Product/GetProduct?id=${id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (!data) {
                        setSearchError('找不到相關結果');
                        setSearchResults(null);
                    } else {
                        setSearchError(null);
                        setSearchResults(data);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setSearchError('搜尋過程中發生錯誤');
                    setSearchResults(null);
                });
        }
    }, [id]);

    return (
        <>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">載入中</span>
                </div>
            )}
            {!loading && searchError && <p style={{ color: 'red' }}>{searchError}</p>}
            {!loading && !searchResults && !searchError && <p>找不到相關結果</p>}
            {!loading && searchResults && (
                <ProductContainer product={searchResults} />
            )
            }
        </>
    );
};

export default ProductResult;
