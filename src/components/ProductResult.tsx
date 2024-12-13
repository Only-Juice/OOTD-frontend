import React from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ProductContainer from './ProductContainer';
import { useQuery } from '@tanstack/react-query';

const ProductResult: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { isPending, error, data } = useQuery({
        queryKey: [`GetProduct_${id}`], queryFn: () => fetch(`/api/Product/GetProduct?id=${id}`).then((res) => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
    },
    );

    return (
        <>
            {isPending && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">載入中</span>
                </div>
            )}
            {!isPending && error && <p style={{ color: 'red' }}>{error.message}</p>}
            {!isPending && !error && !data && <p>找不到相關結果</p>}
            {!isPending && !error && data && (
                <ProductContainer product={data} />
            )
            }
        </>
    );
};

export default ProductResult;
