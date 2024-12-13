import React, { useState } from 'react';
import {Table,Flex,Layout} from 'antd';
import { Divider, Radio } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

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
const CartTable:ColumnsType<ProductInCart> = [
    {
        title: "圖片",
        dataIndex: "Images",
        render: (t, r) => <img src={`${r.Images}`} style={{ width: '50px' , height: '50px' }} />
    },
    {
        title: '商品名稱',
        dataIndex: 'Name',
    },
    {
        title: '單價',
        dataIndex: 'Price',
    },
    {
        title: '數量',
        dataIndex: 'Quantity',
    },
];
const rowSelection: TableProps<ProductInCart>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductInCart[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
};
const Cart: React.FC = () => {
    const [Product, setcatchProduct] = useState<ProductInCart>([]);
    const [hasProduct,sethasProduct] = useState(false);
    const [error, seterror] = useState(false);


    const [productselect,setproductselect] = useState<'checkbox' | 'radio'>('checkbox');


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
                setcatchProduct(Product);
                sethasProduct(true);
                setcatchProduct(data); // 在這裡處理 API 返回的數據
            })
            .catch(error => {
                seterror(true);  // 處理錯誤
            });
    };
    if (token == null) {
        return (
            <div className="container">
                <Flex>
                    <Layout style={layoutStyle}>
                        <Layout>
                            <Content style={contentStyle}>&#127861;請登入後再檢查購物項目</Content>
                        </Layout>
                    </Layout>
                </Flex>
            </div>
        )
    }
    fetchUserInfo(token);


    if (hasProduct) {
        return (
            <div className="container">
                <h1 style={{ fontSize: '100px' }}>Cart Information</h1>
                <Table <ProductInCart>
                    rowSelection={{ type: productselect, ...rowSelection }}
                    dataSource={Product}
                    columns={CartTable}
                >
                </Table>
                <br></br>
                <div style={{ marginLeft: '100px' }}>
                    <button style={{ transform: 'scale(1.5)' }}>購買</button>
                    <button style={{ marginLeft: '100px', transform: 'scale(1.5)' }}>刪除</button>
                </div>
            </div>
        );
    }
    else {
        return (
            <div>
                <h1 style={{ fontSize: '90px', textAlign: 'center', marginTop: '90px' }}> 你他媽的應該要先買東西再來點那該死的購物車 </h1>
            </div>
        )
    }

}

export default Cart;