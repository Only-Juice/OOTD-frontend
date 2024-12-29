import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import type { TableColumnsType } from 'antd';
import { Table, Input, Radio, Button, RadioChangeEvent } from 'antd';
import { Layout } from 'antd';
import type { ProductInCart } from '../types';
const { Content } = Layout;

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

const contentStyle: React.CSSProperties = {
    display: 'flex', // 使用 flexbox 來排版
    flexDirection: 'column', // 垂直排列內部元素
    justifyContent: 'center', // 垂直居中
    alignItems: 'center', // 水平居中
    textAlign: 'center', // 文字居中
    minHeight: '70vh', // 設定最小高度為視窗高度
    color: '#000',
    backgroundColor: '#f4f4f4',
};

/*Handle Shopping Cart Table*/
const CartTable: TableColumnsType<ProductInCart> = [
    {
        title: "圖片",
        dataIndex: "Images",
        render: (_, r) => <img src={`${r.Images}`} style={{ width: '50px', height: '50px' }} />,
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
        render: (_, record) => {
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
    const [BuyState, setBuyState] = useState<string>('');
    const [havebuy, sethavebuy] = useState(false);
    const [Paybuttomloading, setPaybuttomloading] = useState(false);

    /* For Credit Card*/
    const [cardnumber, setcardnumber] = useState("");
    const [ssn, setssn] = useState("");
    const [yy, setyy] = useState("");
    const [mm, setmm] = useState("");

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setcardnumber(e.target.value);
    }
    const handleSSN = (e: React.ChangeEvent<HTMLInputElement>) => {
        setssn(e.target.value);
    }
    const handleYY = (e: React.ChangeEvent<HTMLInputElement>) => {
        setyy(e.target.value);
    }
    const handleMM = (e: React.ChangeEvent<HTMLInputElement>) => {
        setmm(e.target.value);
    }
    const handleBuyState = (e: RadioChangeEvent) => {
        setBuyState(e.target.value);
    }
    const { products = [], coupon = undefined, origin_price, total } = location.state || {};

    const ClickBuy = () => {
        setPaybuttomloading(true);
        const deleteIds = products.map((product: ProductInCart) => product.ID);
        setTimeout(() => {
            sethavebuy(true)
            setPaybuttomloading(false);
            MakeOrder.mutate(orderrequestbody);
            DeleteProduct.mutate(deleteIds);
        }, 500);
    }
    const GetProductDetails = products.map((product: ProductInCart) => ({
        ProductID: product.ID,
        Quantity: product.Quantity
    }));
    const orderrequestbody = {
        CouponID: coupon === undefined ? null : coupon.CouponID,
        Details: GetProductDetails === 0 ? [] : GetProductDetails,
    };

    interface orderrequest {
        CouponID: number | null;
        Details: {
            ProductID: number;
            Quantity: number;
        }[];
    }


    /*Handle Making Order*/
    const MakeOrder = useMutation({
        mutationFn: (orderjson: orderrequest) =>
            fetch('/api/Order/MakeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(orderjson), // 传递要删除的 ID 数组
            }).then((res) => res.json()), // 解析返回的 JSON 数据

        onSuccess: () => {
            console.log('Products deleted successfully');
        },
        onError: (error) => {
            console.error('Error deleting products:', error);

        },
        onSettled: () => {

        },
    });
    const DeleteProduct = useMutation({
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
    return (havebuy ? (
        <Layout>
            <Content style={contentStyle}>
                <h1>&#x1F4B8; 野格炸彈超爽口感</h1>
                <h1>&#x1F4B8; 野格炸彈我的最愛</h1>
                <h1>&#x1F4B8; 付款大成功</h1>
                {(total > 1000) ? <h1>&#x1F4B8; 可於個人頁面查看訂單</h1>
                    : <h1>&#x1F4B8; 可於個人頁面查看你那小乞丐訂單</h1>}
            </Content>
        </Layout>
    ) : (
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
                dataSource={coupon === undefined ? [] : [coupon]}
                columns={CouponTable}
                rowKey="key"
                title={() => (
                    <div>
                        <h3>Coupon Information</h3>
                    </div>
                )}
            />
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <Radio.Group onChange={handleBuyState} style={{ fontSize: '18px' }}>
                        <Radio.Button
                            value="PayOnGet"
                            style={{
                                fontSize: '20px',
                                padding: '10px 20px',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '150px',
                                width: '150px',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ marginRight: '10px' }}>貨到付款</span>
                        </Radio.Button>
                        <Radio.Button
                            value="LinePay"
                            style={{
                                fontSize: '20px',
                                padding: '10px 20px',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '150px',
                                width: '150px',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ marginRight: '10px' }}>Line Pay</span>
                        </Radio.Button>
                        <Radio.Button
                            value="CreditCard"
                            style={{
                                fontSize: '20px',
                                padding: '10px 20px',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '150px',
                                width: '150px',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ marginRight: '10px' }}>信用卡</span>
                        </Radio.Button>
                    </Radio.Group>
                </div>

                {/* Price Information (Right Side) */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                            <h3 style={{ textAlign: 'right', margin: '0 10px', width: '100px' }}>原價：</h3>
                            <h3 style={{ textAlign: 'right', margin: '0 10px', width: '120px' }}>
                                {origin_price}
                            </h3>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                            <h3 style={{ textAlign: 'right', margin: '0 10px', width: '100px' }}>折扣：</h3>
                            <h3 style={{ textAlign: 'right', margin: '0 10px', width: '120px' }}>
                                {origin_price - total}
                            </h3>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                            <h3 style={{ textAlign: 'right', margin: '0 10px', width: '100px' }}>總價：</h3>
                            <h3 style={{ textAlign: 'right', margin: '0 10px', width: '120px' }}>
                                {total}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {BuyState === 'CreditCard' && (
                    // 左邊區域：四個輸入框
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <p>請輸入卡號：</p>
                            <Input
                                maxLength={16}
                                showCount
                                placeholder="卡號"
                                style={{
                                    width: '200px',
                                    height: '30px',
                                    fontSize: '14px',
                                    marginBottom: '10px', // 輸入框之間的間隔
                                }}
                                value={cardnumber}
                                onChange={handleCardNumber}
                            />
                        </div>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <p>請輸入安全碼：</p>
                            <Input
                                maxLength={3}
                                showCount
                                placeholder="安全碼"
                                style={{
                                    width: '200px',
                                    height: '30px',
                                    fontSize: '14px',
                                    marginBottom: '10px',
                                }}
                                value={ssn}
                                onChange={handleSSN}
                            />
                        </div>
                        <div style={{ display: 'flex', marginBottom: '10px' }}>
                            <p>卡片到期年月：</p>
                            <Input
                                maxLength={2}
                                showCount
                                placeholder="MM"
                                style={{
                                    width: '100px',
                                    height: '30px',
                                    fontSize: '14px',
                                    marginRight: '10px',
                                }}
                                value={mm}
                                onChange={handleMM}
                            />
                            <Input
                                maxLength={2}
                                showCount
                                placeholder="YY"
                                style={{
                                    width: '100px',
                                    height: '30px',
                                    fontSize: '14px',
                                }}
                                value={yy}
                                onChange={handleYY}
                            />
                        </div>
                    </div>
                )}
                <Button
                    style={{
                        fontSize: '20px',
                        padding: '10px 20px',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50px',
                        width: '150px',
                        textAlign: 'center',
                        backgroundColor: '#8CC753',
                    }}
                    type="primary"
                    loading={Paybuttomloading}
                    onClick={ClickBuy}
                    disabled={(
                        BuyState === 'CreditCard' &&
                        !(mm.length === 2 &&
                            yy.length === 2 &&
                            cardnumber.length === 16 &&
                            ssn.length === 3)
                    ) || BuyState === ''}
                >
                    結帳
                </Button>
            </div>

        </div>
    )

    );
};

export default CartResult;