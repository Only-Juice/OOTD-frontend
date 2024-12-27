import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductContainer from '../components/ProductContainer';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import { Store, RatingResult } from '../types';

const ProductPVCResult: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { isPending, error, data } = useQuery({
        queryKey: [`GetProdcutByPVCID_${id}`], queryFn: () => fetch(`/api/Product/GetProdcutByPVCID?PVCID=${id}`).then((res) => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
    },
    );

    const { data: storeData, isLoading: isStoreLoading, refetch: refetchStoreData } = useQuery<Store>({
        queryKey: [`GetStoreById_${data?.StoreID}`],
        queryFn: async () => {
            const res = await fetch(`/api/Store/GetStoreById?storeID=${data?.StoreID}`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        },
    });

    const { isPending: isPendingRating, data: dataRating, refetch: refetchRating } = useQuery<RatingResult[]>({
        queryKey: [`GetProductRating_${data?.ID}`],
        queryFn: () => fetch(`/api/Rating/GetProductRating?productId=${data?.ID}`).then((res) => {
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
                <ProductContainer product={data} isPVC={true} storeData={storeData} isStoreLoading={isStoreLoading} isPendingRating={isPendingRating} dataRating={dataRating} refetchRating={refetchRating} />
            )
            }
        </>
    );
};

export default ProductPVCResult;
