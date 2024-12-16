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
        sorter: (a, b) => a.Discount - b.Discount,
    },
];

const CartResult: React.FC = () => {
    const location = useLocation();


    const { products, coupon, total } = location.state || {};

    return (
        <div className="container">
            <h1>購物車資訊</h1>
            <Table<ProductInCart>
                dataSource={products}
                columns={CartTable}
                rowKey="key"
            />

            <h1>優惠券資訊</h1>
            <hr />
            {/* 確保 coupon 是陣列格式 */}
            <Table<Coupon>
                dataSource={[coupon]}
                columns={CouponTable}
                rowKey="key"
                footer={() => (
                    <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <h3 style={{ marginRight: '32px' }}>總價：{total}</h3>
                        {/* 按鈕或其他操作可以放在這裡 */}
                        <Button style={{ width: '100px', height: '60px', marginRight: '16px' }} type="primary">
                            購買
                        </Button>
                    </div>
                )}
            />
        </div>
    );
};

export default CartResult;