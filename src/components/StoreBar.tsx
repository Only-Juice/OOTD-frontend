import React from 'react';
import { Card } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Store } from '../types';
import UserBadge from './UserBadge';
import { useQuery } from '@tanstack/react-query';
import ProductSlider from './ProductSlider';
import StoreCard from './StoreProductCard';

const StoreBar: React.FC<{ store: Store | null }> = ({ store }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchWord = queryParams.get('q');


    const { data: StoreProductsData } = useQuery({
        queryKey: [`GetStoreProducts_${store?.StoreID}_1_Sale_false`], queryFn: async () => {
            if (!store?.StoreID) return null;
            const res = await fetch(`/api/Product/GetStoreProducts?storeId=${store?.StoreID}&page=1&pageLimitNumber=30&orderField=Sale&isASC=false`);
            if (!res.ok) {
                return null;
            }
            return res.json();
        }
    });

    return (
        <>
            {store &&
                <Card className='h-100'>
                    <Card.Header>
                        <Card.Title style={{ fontSize: '1rem' }}><UserBadge username={store.OwnerUsername} size={35} /></Card.Title>
                        <Link to={`/store/${store.StoreID}`} className='text-decoration-none'>
                            <Card.Title style={{ fontSize: '2rem' }}>{store.Name}</Card.Title>
                        </Link>
                    </Card.Header>
                    <Card.Body>
                        {StoreProductsData?.Products.length &&
                            <ProductSlider ProductsData={StoreProductsData?.Products || undefined} Card={StoreCard} />
                        }
                        <Link to={`/searchStore?q=${searchWord}`}><Card.Text className='mt-4 text-end'>更多商店</Card.Text></Link>
                    </Card.Body>
                </Card>
            }
        </>
    );
};

export default StoreBar;