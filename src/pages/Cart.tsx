import React, { useState,useEffect } from 'react';
import {Table,Flex,Layout,Button} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {Link,useNavigate} from 'react-router-dom';
const { Content } = Layout;

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
/*handle API object*/
interface ProductInCart {
    key: React.Key;
    ID: number;
    Name: string;
    Images: string[];
    Price: number;
    Quantity: number;
    Description: string;
}
interface Coupon {
    key: React.Key;
    CouponID: number,
    Name: string,
    Description: string,
    Discount: number,
    StartDate: string,
    EndDate: string,
    Quantity: number
}
/*handle layout*/
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
/*Handle Shopping Cart Table*/
const CartTable:TableColumnsType<ProductInCart> = [
    {
        title: "圖片",
        dataIndex: "Images",
        render: (t, r) => <img src={`${r.Images}`} style={{ width: '50px' , height: '50px' }} />
    },
    {
        title: "商品名稱",
        align: "center",
        dataIndex: "Name",
        key: "name"
    },
    {
        title: "單價",
        align: "center",
        dataIndex: "Price",
        key: "price"
    },
    {
        title: "數量",
        align: "center",
        dataIndex: "Quantity",
        key: "amount"
    },
    {
        title: "總計",
        align: "center",
        dataIndex: 'totalPrice',
        key: "totalPrice",
        render: (text, record, _) => {
            return record["Quantity"] * record["Price"];
        },
        defaultSortOrder: null,
        sorter: (a,b) => a.Quantity * a.Price - b.Quantity * b.Price,
    }
];

const CouponTable:TableColumnsType<Coupon> = [
    {
        title: "名稱",
        dataIndex: "Name",
    },
    {
        title: "敘述",
        dataIndex: "Description",
    },
    {
        title: "折扣(折)",
        dataIndex: "Discount",
        sorter: (a,b) => a.Discount - b.Discount,
    }
];
function calculatecartPrice(data:{Price:number;Quantity:number;key:React.Key}[],key:React.Key[]):number{
    return data.reduce((total, product) => {
        if (key.includes(product.key)) {
            return total + product.Price * product.Quantity;
        }
        return total;
    }, 0);
}
export const calculateDiscountedTotal = (coupons, selectCouponkey, total) => {
    const selectedCoupon = coupons.find(coupon => coupon.key === selectCouponkey);

    if (!selectedCoupon) {
        return total;
    }

    return Math.floor(total * selectedCoupon.Discount);

};
const Cart: React.FC = () => {
    const navigate = useNavigate();
    /* Get Cart Info */
    const [Product, setcatchProduct] = useState<ProductInCart[]>([]);
    const [hasProduct,sethasProduct] = useState(false);
    const [error, seterror] = useState(false);
    const token = localStorage.getItem('token');
    const fetchUserInfo = (token: string) => {
        fetch('/api/Product/GetCartProducts', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })  // 替換成您的 API URL
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
                sethasProduct(true);
            })
            .catch(error => {
                seterror(true);  // 處理錯誤
            });
    };
    /* Get Coupon Info */
    const [Coupon,setcatchCoupon] = useState<Coupon[]>([]);
    const [hasCoupon,sethasCoupon] = useState(false);
    const [couponerror, setcouponerror] = useState(false);
    const fetchUserCoupon = (token: string) => {
        fetch('/api/Coupon/GetUserCoupons', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })  // 替換成您的 API URL
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
                sethasCoupon(true);
            })
            .catch(error => {
                setcouponerror(true);  // 處理錯誤
            });
    };
    /* Table Modify*/
    const [selectkey,setselectkey] = useState<React.Key[]>([]);
    const [selectCouponkey, setCouponkey] = useState<React.Key | null>(null);
    const [buyload,setbuyload] = useState(false);
    const [deleteload,setdeleteload] = useState(false);

    const SelectChange =  (newSelectedRowKeys: React.Key[]) => {
        setselectkey(newSelectedRowKeys);
    }
    const SelectCouponChange = (newSelectCouponKey: React.Key[]) => {
        setCouponkey(newSelectCouponKey);
    }
    const rowSelection: TableRowSelection<ProductInCart> = {
        selectkey,
        onChange: SelectChange,
    };
    useEffect(() => {
        fetchUserInfo(token);
    }, []);
    useEffect(() => {
        fetchUserCoupon(token);
    }, []);
    const checkboxclick = selectkey.length > 0;
    /*Buy and Delete*/
    const ClickBuy = () =>{
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
    }
    const ClickDelete = () =>{
        const lastproduct = Product.filter(product=> !selectkey.includes(product.key));
        setdeleteload(true);
        setTimeout(() => {
            setcatchProduct(lastproduct);
            setdeleteload(false);
            setselectkey([]);
        }, 1000);
        /* Need fetch post into database.*/
    }
    const origin_price = calculatecartPrice(Product,selectkey);
    const total_price = calculateDiscountedTotal(Coupon,selectCouponkey,origin_price);
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
            hasProduct?(
                <div className="container">
                    <h1>Cart Information</h1>
                    <hr></hr>
                    <Table<ProductInCart>
                        rowSelection={rowSelection}
                        dataSource={Product}
                        columns={CartTable}
                        footer={() => (
                            <div style={{textAlign: 'right'}}>
                                <Button
                                    style={{width: '100px', height: '60px',backgroundColor:'#16ff44'}}
                                    type="primary"
                                    onClick={ClickDelete}
                                    disabled={!checkboxclick}
                                    loading={deleteload}
                                >
                                    刪除
                                </Button>
                            </div>
                        )}
                    >
                    </Table>
                    <h1>Coupon Information</h1>
                    <hr></hr>
                    <Table <Coupon>
                        rowSelection= {{
                            type:'radio',
                            onChange: (selectedRowKeys) => {
                                setCouponkey(selectedRowKeys[0]);  // 設定選中的優惠券key
                            },
                        }}
                        dataSource={Coupon}
                        columns={CouponTable}
                        footer={() => (
                            <div style={{textAlign: 'right',display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                    <h3 style={{marginRight:'32px'}}>總價：{total_price}</h3>
                                    <Button
                                        style={{width: '100px', height: '60px',marginRight:'16px',backgroundColor:'#16ff44'}}
                                        type="primary"
                                        onClick={ClickBuy}
                                        loading={buyload}
                                        disabled={!checkboxclick}
                                    >
                                        購買
                                    </Button>
                            </div>
                        )}
                    >
                    </Table>
                </div>
            ) : (
                <div className="container">
                    <h1 style={{
                        fontSize: '90px',
                        textAlign: 'center',
                        marginTop: '90px',
                        whiteSpace: 'normal'
                    }}> 你他媽的應該要先買東西 </h1>
                    <h1 style={{
                        fontSize: '90px',
                        textAlign: 'center',
                        marginTop: '90px',
                        whiteSpace: 'normal'
                    }}> 再來點那該死的購物車 </h1>
                </div>
            )
        )
    );

}

export default Cart;