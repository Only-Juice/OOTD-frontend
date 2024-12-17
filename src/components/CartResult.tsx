import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Table } from 'antd';

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
    CouponID: number;
    Name: string;
    Description: string;
    Discount: number;
    StartDate: string;
    EndDate: string;
    Quantity: number;
}

/*Handle Shopping Cart Table*/
const CartTable: TableColumnsType<ProductInCart> = [
    {
        title: "圖片",
        dataIndex: "Images",
        render: (t, r) => <img src={`${r.Images}`} style={{ width: '50px', height: '50px' }} />,
    },
    {
        title: "商品名稱",
        align: "center",
        dataIndex: "Name",
        key: "name",
    },
    {
        title: "單價",
        align: "center",
        dataIndex: "Price",
        key: "price",
    },
    {
        title: "數量",
        align: "center",
        dataIndex: "Quantity",
        key: "amount",
    },
    {
        title: "總計",
        align: "center",
        dataIndex: 'totalPrice',
        key: "totalPrice",
        render: (text, record) => {
            return record["Quantity"] * record["Price"];
        },
        defaultSortOrder: null,
        sorter: (a, b) => a.Quantity * a.Price - b.Quantity * b.Price,
    },
];

const CouponTable: TableColumnsType<Coupon> = [
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
    },
];

const CartResult: React.FC = () => {
    const location = useLocation();


    const { products, coupon, origin_price ,total } = location.state || {};

    return (
        <div className="container">
            <Table<ProductInCart>
                dataSource={products}
                columns={CartTable}
                rowKey="key"
                title={() => (
                    <div>
                        <h3>Product Information</h3>
                    </div>
                )}
            />
            <Table<Coupon>
                dataSource={[coupon]}
                columns={CouponTable}
                rowKey="key"
                title={() => (
                    <div>
                        <h3>Coupon Information</h3>
                    </div>
                )}
            />
            <hr/>
            <div style={{ textAlign: 'right' }}>
                <h3 style={{display: 'inline-block', width: '100px', textAlign: 'right'}}>
                    原價：
                </h3>
                <h3 style={{display: 'inline-block', width: '100px', textAlign: 'right'}}>
                    {origin_price}
                </h3>
                <br/>
                <h3 style={{display: 'inline-block', width: '100px', textAlign: 'right'}}>
                    折扣：
                </h3>
                <h3 style={{display: 'inline-block', width: '100px', textAlign: 'right'}}>
                    {origin_price - total}
                </h3>
                <br/>
                <h3 style={{display: 'inline-block', width: '100px', textAlign: 'right'}}>
                    總價：
                </h3>
                <h3 style={{display: 'inline-block', width: '100px', textAlign: 'right'}}>
                    {total}
                </h3>
            </div>
        </div>
    );
};

export default CartResult;