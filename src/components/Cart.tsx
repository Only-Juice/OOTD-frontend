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
    /*Buy and Delete*/
    const ClickBuy = () =>{
        setcatchProduct([]);
    }
    const ClickDelete = () =>{
        setcatchProduct([]);
    }
    const checkboxclick = selectkey.length > 0;
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
                    <ul>
                        {selectkey.map((key, index) => (
                            <li key={index}>{key}</li>
                        ))}
                    </ul>
                    <ul>
                        {Product.map((key, index) => (
                            <li key={index}>{key.ID} {key.key}</li>
                        ))}
                    </ul>
                    <h1>Cart Information</h1>
                    <Table<ProductInCart>
                        rowSelection={rowSelection}
                        dataSource={Product}
                        columns={CartTable}
                        footer={() => (
                            <div style={{textAlign: 'right'}}>
                                {checkboxclick ? `Selected ${selectkey.length} items` : 'None of Item choose'}
                                <Button
                                    style={{width: '100px', height: '60px', marginRight: '32px'}}
                                    type="primary"
                                    onClick={ClickBuy}
                                >
                                    購買
                                </Button>
                                <Button
                                    style={{width: '100px', height: '60px'}}
                                    type="primary"
                                    onClick={() => console.log('Second Button clicked')}
                                    disabled={!checkboxclick}
                                >
                                    刪除
                                </Button>
                            </div>
                        )}
                    >
                    </Table>
                    <br></br>

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