import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Store } from '../types';
import UserBadge from './UserBadge';
import { useQuery } from '@tanstack/react-query';
import ProductSlider from './ProductSlider';
import StoreCard from './StoreCard';

const StoreBar: React.FC<{ store: Store | null }> = ({ store }) => {
    const { data: StoreProductsData } = useQuery({
        queryKey: [`GetStoreProducts_${store?.StoreID}_1`], queryFn: async () => {
            if (!store?.StoreID) return null;
            const res = await fetch(`/api/Product/GetStoreProducts?storeId=${store?.StoreID}&page=1&pageLimitNumber=30`);
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
                    <Card.Body>
                        <Card.Title style={{ fontSize: '1rem' }}><UserBadge username={store.OwnerUsername} size={20} /></Card.Title>
                        <Link to={`/store/${store.StoreID}`} className='text-decoration-none'>
                            <Card.Title style={{ fontSize: '2rem' }}>{store.Name}</Card.Title>
                        </Link>
                        {StoreProductsData?.Products.length &&
                            <ProductSlider ProductsData={StoreProductsData?.Products || undefined} Card={StoreCard} />
                        }
                        <Card.Text className='text-end'>更多商店</Card.Text>
                    </Card.Body>
                </Card>
            }
        </>
    );
};

export default StoreBar;