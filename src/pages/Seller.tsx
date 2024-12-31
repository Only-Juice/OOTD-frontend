import React, { useEffect, useState } from 'react';
import { Alert, Card, Layout, Menu } from 'antd';
import { useMediaQuery } from 'react-responsive';
import type { RatingResult, UserInfo } from '../types';
import SellerStoreManage from '../components/SellerStoreManage';
import ShowOrder from '../components/ShowOrder';
const { Sider, Content } = Layout;
import { useQuery } from '@tanstack/react-query';
import type { Store } from '../types';
import Rating from '../components/Rating';
import StoreProductAndSale from '../components/StoreProductAndSale';

interface SellerProps {
    dataUserInfo: UserInfo | null;
}

const Seller: React.FC<SellerProps> = ({ dataUserInfo }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [selectedComponent, setSelectedComponent] = useState('store');
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const { isLoading: isLoadingStore, error: errorStore, data: store } = useQuery<Store>({
        queryKey: ['GetSellerStore'],
        queryFn: async () => {
            if (!token) {
                return null;
            }
            const res = await fetch('/api/Store/GetStore', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (!res.ok) {
                return null;
            }
            return res.json();
        },
    });

    const { data: storeOrdersData } = useQuery({
        queryKey: [`GetStoreOrders`],
        queryFn: () => {
            if (!token) return null;
            return fetch('/api/Store/GetStoreOrders', {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        return null;
                    } else if (res.status === 404) {
                        return null;
                    }
                    throw new Error(res.statusText);
                }
                return res.json();
            })
        },
        retry: false,
    });

    const { isPending: isPendingRating, data: dataRating, refetch: refetchRating } = useQuery<RatingResult[]>({
        queryKey: ['GetStoreRatings'],
        queryFn: async () => {
            if (!token) return null;
            return fetch('/api/Store/GetStoreRatings', {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
            }).then((res) => {
                if (res.status === 404) {
                    return [];
                }
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
        },
    });

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'store':
                return <SellerStoreManage store={store} error={errorStore} isLoading={isLoadingStore} />;
            case 'orders':
                return storeOrdersData ? <ShowOrder data={storeOrdersData} /> : null;
            case 'productAndSale':
                return <StoreProductAndSale />;
            case 'ratings':
                return <Rating isPending={isPendingRating} data={dataRating} refetch={refetchRating} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, [localStorage.getItem('token')]);

    const handleMenuClick = (e: any) => {
        setSelectedComponent(e.key);
    };

    const menuItems = [
        { key: 'store', label: '商店資訊' },
        { key: 'orders', label: '商店訂單' },
        { key: 'productAndSale', label: '商品管理' },
        { key: 'ratings', label: '商店評價' },
    ];


    return (
        <Card title="賣家中心" className="mt-2">
            <Layout>
                {!isMobile && (
                    <Sider style={{ background: '#fff' }}>
                        <Menu
                            onClick={handleMenuClick}
                            selectedKeys={[selectedComponent]}
                            mode="inline"
                            items={menuItems}
                        />
                    </Sider>
                )}
                <Layout>
                    <Content>
                        {isMobile && (
                            <Menu
                                onClick={handleMenuClick}
                                selectedKeys={[selectedComponent]}
                                mode="horizontal"
                                items={menuItems}
                            />
                        )}
                        <Card>
                            {token ? (
                                <>
                                    {dataUserInfo?.HaveStore ? (
                                        renderComponent()
                                    ) : (
                                        <Alert
                                            className='mb-2'
                                            message="錯誤"
                                            description="您尚未開通商店功能"
                                            type="error"
                                            showIcon
                                        />
                                    )}
                                </>
                            ) : (
                                <Alert
                                    className='mb-2'
                                    message="錯誤"
                                    description="請先登入帳號"
                                    type="error"
                                    showIcon
                                />
                            )}
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Card>
    );
};

export default Seller;