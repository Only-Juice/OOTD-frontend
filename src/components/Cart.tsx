import React, { useState,useEffect } from 'react';
import {Table,Flex,Layout,Button} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {Typography} from 'antd';
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
    width: 'calc(80% - 8px)',
    maxWidth: 'calc(80% - 8px)',
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
function calculatecartPrice(data:{Price:number;Quantity:number;key:React.Key}[],key:React.Key[]):number{
    return data.reduce((total, product) => {
        if (key.includes(product.key)) {
            return total + product.Price * product.Quantity;
        }
        return total;
    }, 0);
}
const Cart: React.FC = () => {
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
    /* Table Modify*/
    const [selectkey,setselectkey] = useState<React.Key[]>([]);
    const [buyload,setbuyload] = useState(false);
    const [deleteload,setdeleteload] = useState(false);
    const total_price = calculatecartPrice(Product,selectkey);
    const SelectChange =  (newSelectedRowKeys: React.Key[]) => {
        setselectkey(newSelectedRowKeys);
    }
    const rowSelection: TableRowSelection<ProductInCart> = {
        selectkey,
        onChange: SelectChange,
    };
    useEffect(() => {
        fetchUserInfo(token);
    }, []);
    const checkboxclick = selectkey.length > 0;
    /*Buy and Delete*/
    const ClickBuy = () =>{
        /* Need fetch post into database.*/
        const lastproduct = Product.filter(product=> !selectkey.includes(product.key));
        setbuyload(true);
        setTimeout(() => {
            const lastproduct = Product.filter(product=> !selectkey.includes(product.key));
            setcatchProduct(lastproduct);
            setbuyload(false);
            setselectkey([]);
        }, 1000);
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
                                    style={{width: '100px', height: '60px'}}
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
                    <Table
                        footer={() => (
                            <div style={{textAlign: 'right',display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <h3 style={{marginRight:'32px'}}>總價：{total_price}</h3>
                                <Button
                                    style={{width: '100px', height: '60px'}}
                                    type="primary"
                                    onClick={ClickBuy}
                                    loading={buyload}
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