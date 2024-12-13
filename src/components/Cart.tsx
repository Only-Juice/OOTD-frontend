import React, { useState,useEffect } from 'react';
import {Table,Flex,Layout} from 'antd';
import { Divider, Radio } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {Button, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import UserBadge from "./UserBadge.tsx";
const { Content } = Layout;

/* type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']; */
/*handle API object*/
interface ProductInCart {
    key: React.key;
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
const CartTable:ColumnsType<ProductInCart> = [
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
        }
    }
];
const Cart: React.FC = () => {
    /* Get Cart Info */
    const [Product, setcatchProduct] = useState<ProductInCart>([]);
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
    /* Checkbox Modify*/
    const [selectkey,setselectkey] = useState<React.key[]>([]);
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
                    <h1 style={{fontSize: '100px'}}>Cart Information</h1>
                    <Table<ProductInCart>
                        rowSelection={{SelectChange}}
                        dataSource={Product}
                        columns={CartTable}
                    >
                    </Table>
                    <br></br>
                    <div style={{marginLeft: '100px'}}>
                        <button style={{transform: 'scale(1.5)'}}>購買</button>
                        <button style={{marginLeft: '100px', transform: 'scale(1.5)'}}>刪除</button>
                    </div>
                </div>
            ): (
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