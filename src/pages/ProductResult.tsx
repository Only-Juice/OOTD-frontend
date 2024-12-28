import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductContainer from '../components/ProductContainer';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import { Store, RatingResult } from '../types';

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

    const { data: storeData, isLoading: isStoreLoading, refetch: refetchStoreData } = useQuery<Store>({
        queryKey: [`GetStoreById_${data?.StoreID}`],
        queryFn: async () => {
            if (!data) {
                return null;
            }
            const res = await fetch(`/api/Store/GetStoreById?storeID=${data?.StoreID}`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        },
    });

    const { isPending: isPendingRating, data: dataRating, refetch: refetchRating } = useQuery<RatingResult[]>({
        queryKey: [`GetProductRating_${id}`],
        queryFn: () => fetch(`/api/Rating/GetProductRating?productId=${id}`).then((res) => {
            if (res.status === 404) {
                return [];
            }
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }),
    });

    useEffect(() => {
        refetch();
    }, [localStorage.getItem('token')]);

    useEffect(() => {
        refetchStoreData();
    }, [data?.StoreID]);

    return (
        <>
            {isPending && (
                <Loading />
            )}
            {!isPending && error && <p style={{ color: 'red' }}>{error.message}</p>}
            {!isPending && !error && !data && <p>找不到相關結果</p>}
            {!isPending && !error && data && (
                <ProductContainer product={data} storeData={storeData} isStoreLoading={isStoreLoading} isPendingRating={isPendingRating} dataRating={dataRating} refetchRating={refetchRating} />
            )
            }
        </>
    );
};

export default ProductResult;
