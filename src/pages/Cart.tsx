import React, { useState, useEffect } from 'react';
import { Table, Flex, Layout, Button, InputNumber, Tooltip } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { ProductInCart } from '../types';
const { Content } = Layout;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

/* Handle API object */
interface Coupon {
    key: React.Key;
    CouponID: number;
    Name: string;
    Description: string;
    Discount: number;
    StartDate: string;
    EndDate: string;
    Quantity: number;
}

/* Handle layout */
const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '500px',
    color: '#000',
    backgroundColor: '#f4f4f4',
    fontSize: '4vw',
};

const layoutStyle = {
    borderRadius: 16,
    overflow: 'hidden',
    width: 'calc(90% - 8px)',
    maxWidth: 'calc(90% - 8px)',
};

const handleQuantityChange = async (
    value: number | null,
    record: ProductInCart,
    dataSource: ProductInCart[],
    setDataSource: React.Dispatch<React.SetStateAction<ProductInCart[]>>
) => {
    const newData = dataSource.map((item) => {
        if (item.key === record.key) {
            return { ...item, Quantity: value || 1 }; // 防止 null
        }
        return item;
    });
    setDataSource(newData);
    try {
        const response = await fetch('/api/Product/ModifyProductQuantityInCart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                ProductID: record.ID,
                Quantity: value || 1,
            }),
        });

        if (!response.ok) {
            // 處理 API 請求失敗的情況
            throw new Error('Failed to update quantity');
        }

        const data = await response.json();
        console.log('API Response:', data);
    } catch {
        console.error('Error:', Error);
    }
};
const getColumns = (
    dataSource: ProductInCart[],
    setDataSource: React.Dispatch<React.SetStateAction<ProductInCart[]>>
): TableColumnsType<ProductInCart> => [
        {
            title: '圖片',
            dataIndex: 'Images',
            ellipsis: true,
            render: (_, record) => <img src={`${record.Images}`} style={{ width: '50px', height: '50px' }} />,
        },
        {
            title: '商品名稱',
            align: 'center',
            dataIndex: 'Name',
            key: 'name',
            ellipsis: true,
            render: (value) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '單價',
            align: 'center',
            dataIndex: 'Price',
            key: 'price',
            ellipsis: true,
            render: (value) => <Tooltip title={value}>{value}</Tooltip>,
        },
        {
            title: '數量',
            align: 'center',
            dataIndex: 'Quantity',
            key: 'amount',
            ellipsis: true,
            render: (value, record) => (
                <InputNumber
                    min={1}
                    value={value}
                    onChange={(val) => handleQuantityChange(val, record, dataSource, setDataSource)} // 更新數據
                />
            ),
        },
        {
            title: '總計',
            align: 'center',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            ellipsis: true,
            render: (_, record) => (
                <Tooltip title={record.Quantity * record.Price}>{record.Quantity * record.Price}</Tooltip>
            )
            ,
            sorter: (a, b) => a.Quantity * a.Price - b.Quantity * b.Price,
        },
    ];

const CouponTable: TableColumnsType<Coupon> = [
    {
        title: "名稱",
        dataIndex: "Name",
        ellipsis: true,
        render: (value) => <Tooltip title={value}>{value}</Tooltip>,
    },
    {
        title: "敘述",
        dataIndex: "Description",
        ellipsis: true,
        render: (value) => <Tooltip title={value}>{value}</Tooltip>,
    },
    {
        title: "折扣(折)",
        dataIndex: "Discount",
        ellipsis: true,
        render: (value) => <Tooltip title={value}>{value}</Tooltip>,
        sorter: (a, b) => a.Discount - b.Discount,
    }
];

function calculatecartPrice(data: { Price: number; Quantity: number; key: React.Key }[], key: React.Key[]): number {
    return data.reduce((total, product) => {
        if (key.includes(product.key)) {
            return total + product.Price * product.Quantity;
        }
        return total;
    }, 0);
}

export const calculateDiscountedTotal = (coupons: Coupon[], selectCouponkey: React.Key | null, total: number): number => {
    const selectedCoupon = coupons.find((coupon: Coupon) => coupon.key === selectCouponkey);

    if (!selectedCoupon) {
        return total;
    }

    return Math.floor(total * selectedCoupon.Discount);
};

interface CartProps {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const Cart: React.FC<CartProps> = ({ setIsModalOpen }) => {
    const navigate = useNavigate();

    /* Get Cart Info */
    const [Product, setcatchProduct] = useState<ProductInCart[]>([]);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        if (token == null) {
            setIsModalOpen(true);
        }
    }, [token]);

    const fetchUserInfo = () => {
        fetch('/api/Product/GetCartProducts', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  // 解析 JSON 回應
            })
            .then(data => {
                const updatedData = data.map((product: any, index: number) => ({
                    ...product,
                    key: index,  // 使用從0開始的索引作為key
                }));
                setcatchProduct(updatedData);
            })
    };
    /*Modify Sopping cart*/
    const DeleteShoppingCart = useMutation({
        mutationFn: (deleteIds: number[]) =>
            fetch('/api/Product/RemoveProductFromCart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ IDs: deleteIds }), // 传递要删除的 ID 数组
            }).then((res) => res.json()), // 解析返回的 JSON 数据

        onSuccess: (data) => {
            if (data.StatusCode === 200) {
                console.log('Products deleted successfully');
            } else {
                console.log(data);
            }

        },
        onError: (error) => {
            console.error('Error deleting products:', error);

        },
        onSettled: () => {

        },
    });
    /* Get Coupon Info */
    const [Coupon, setcatchCoupon] = useState<Coupon[]>([]);

    const fetchUserCoupon = () => {
        fetch('/api/Coupon/GetUserCoupons', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  // 解析 JSON 回應
            })
            .then(data => {
                const updatedData = data.map((coupon: any, index: number) => ({
                    ...coupon,
                    key: index,  // 使用從0開始的索引作為key
                }));
                setcatchCoupon(updatedData);
            })
    };

    /* Table Modify */
    const [selectkey, setselectkey] = useState<React.Key[]>([]);
    const [selectCouponkey, setCouponkey] = useState<React.Key | null>(null);
    const [buyload, setbuyload] = useState(false);
    const [deleteload, setdeleteload] = useState(false);
    /* Modify Product Table */

    const SelectChange = (newSelectedRowKeys: React.Key[]) => {
        setselectkey(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<ProductInCart> = {
        selectedRowKeys: selectkey,
        onChange: SelectChange,
    };

    useEffect(() => {
        if (token !== null) {
            fetchUserInfo();
            fetchUserCoupon();
        }
    }, [token]);

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            setToken(localStorage.getItem('token'));
        }
    }, [localStorage, localStorage.getItem('token')]);

    const checkboxclick = selectkey.length > 0;

    /* Buy and Delete */
    const ClickBuy = () => {
        const selectedProducts = Product.filter(product => selectkey.includes(product.key));
        const selectedCoupon = Coupon.find(coupon => coupon.key === selectCouponkey);

        // 顯示 loading 狀態（可選）
        setbuyload(true);

        // 使用 setTimeout 延遲執行導航操作
        setTimeout(() => {
            // 在延遲後執行導航操作
            navigate('/cartresult', {
                state: {
                    products: selectedProducts,
                    coupon: selectedCoupon,
                    origin_price: origin_price,
                    total: total_price,
                }
            });

            // 停止 loading 狀態（可選）
            setbuyload(false);
        }, 1000);  // 設置延遲時間為 1 秒（1000 毫秒）
    };

    const ClickDelete = () => {
        const lastproduct = Product.filter(product => !selectkey.includes(product.key));
        const deleteproduct = Product.filter(product => selectkey.includes(product.key));
        const deleteIds = deleteproduct.map(product => product.ID);
        setdeleteload(true);
        setTimeout(() => {
            setcatchProduct(lastproduct);
            setdeleteload(false);
            setselectkey([]);
            DeleteShoppingCart.mutate(deleteIds);
        }, 1000);
        /* Need fetch post into database. */
    };

    const origin_price = calculatecartPrice(Product, selectkey);
    const total_price = calculateDiscountedTotal(Coupon, selectCouponkey, origin_price);
    const CartTable = getColumns(Product, setcatchProduct);
    return (
        token == null ? (
            <div className="container">
                <Flex>
                    <Layout style={layoutStyle}>
                        <Layout>
                            <Content style={contentStyle}>&#127861;請登入後再檢查購物項目</Content>
                        </Layout>
                    </Layout>
                </Flex>
            </div>
        ) : (
            <div className="container">
                <h1>購物車資訊</h1>
                <hr />
                <Table<ProductInCart>
                    rowSelection={rowSelection}
                    dataSource={Product}
                    columns={CartTable}
                    locale={{
                        emptyText: (
                            <div className="container">
                                <h1 style={{
                                    fontSize: '45px',
                                    textAlign: 'center',
                                    marginTop: '90px',
                                    whiteSpace: 'normal'
                                }}> &#x2615;購物車空空如也</h1>
                            </div>
                        ),
                    }}
                    footer={() => (
                        <div style={{ textAlign: 'right' }}>
                            <Button
                                style={{ width: '100px', height: '60px', backgroundColor: '#8CC753' }}
                                type="primary"
                                onClick={ClickDelete}
                                disabled={!checkboxclick}
                                loading={deleteload}
                            >
                                刪除
                            </Button>
                        </div>
                    )}
                />
                <h1>優惠券資訊</h1>
                <hr />
                <Table<Coupon>
                    rowSelection={{
                        type: 'radio',
                        onChange: (selectedRowKeys) => {
                            setCouponkey(selectedRowKeys[0]);  // 設定選中的優惠券key
                        },
                    }}
                    dataSource={Coupon}
                    columns={CouponTable}
                    footer={() => (
                        <div style={{
                            textAlign: 'right',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ marginRight: '32px' }}>總價：{total_price}</h3>
                            <Button
                                style={{
                                    width: '100px',
                                    height: '60px',
                                    marginRight: '16px',
                                    backgroundColor: '#8CC753'
                                }}
                                type="primary"
                                onClick={ClickBuy}
                                loading={buyload}
                                disabled={!checkboxclick}
                            >
                                購買
                            </Button>
                        </div>
                    )}
                />
            </div>
        )
    );
}

export default Cart;
