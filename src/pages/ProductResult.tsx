import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductContainer from '../components/ProductContainer';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';

const ProductResult: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { isPending, error, data, refetch } = useQuery({
        queryKey: [`GetProduct_${id}`], queryFn: () => {
            const token = localStorage.getItem('token');
            return fetch(`/api/Product/GetProduct?id=${id}`, {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        return null;
                    }
                    return res.json();
                })
        }
    },
    );

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    return (
        <>
            {isPending && (
                <Loading />
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
