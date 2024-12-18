import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import {Table, Input, Radio, Button} from 'antd';

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
interface ProductDetails {
    ProductID: number;
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
    const [BuyState, setBuyState] = useState<string>('');
    const [havebuy,sethavebuy] = useState(false);
    const [Paybuttomloading,setPaybuttomloading] = useState(false);

    /* For Credit Card*/
    const [cardnumber, setcardnumber] = useState("");
    const [ssn, setssn] = useState("");
    const [yy, setyy] = useState("");
    const [mm, setmm] = useState("");

    const handleCardNumber = (e: InputEvent) =>{
        setcardnumber(e.target.value);
    }
    const handleSSN = (e: InputEvent) =>{
        setssn(e.target.value);
    }
    const handleYY = (e: InputEvent) =>{
        setyy(e.target.value);
    }
    const handleMM = (e: InputEvent) => {
        setmm(e.target.value);
    }
    const handleBuyState = (e: RadioChangeEvent) => {
        setBuyState(e.target.value);
    }
    const { products, coupon, origin_price ,total } = location.state || {};

    const ClickBuy = () =>{
        setPaybuttomloading(true);
        const deleteIds = products.map(product => product.ID);
        setTimeout(() => {
            sethavebuy(true)
            setPaybuttomloading(false);
            DeleteShoppingCart.mutate(orderrequestbody);
            DeleteProduct.mutate(deleteIds);
        }, 1000);
    }
    const GetProductDetails = products.map(product => ({
        ProductID: product.ID,
        Quantity: product.Quantity
    }));
    const orderrequestbody = {
        CouponID: coupon === undefined ? null : coupon.CouponID,
        Details: GetProductDetails,
    };
    /*Handle Making Order*/
    const DeleteShoppingCart = useMutation({
        mutationFn: (orderjson:JSON) =>
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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(deleteIds), // 传递要删除的 ID 数组
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
    return (havebuy? (
            <div>
                <h3> &#x1F4B8; 小老媽逼付款成功</h3>
                <h3> &#x1F4B8; 正在將您導回首頁</h3>
            </div>): (
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
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{flex: 1}}>
                        <Radio.Group onChange={handleBuyState} style={{fontSize: '18px'}}>
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
                                <span style={{marginRight: '10px'}}>貨到付款</span>
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
                                <span style={{marginRight: '10px'}}>Line Pay</span>
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
                                <span style={{marginRight: '10px'}}>信用卡</span>
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
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                            <div style={{display: 'flex', marginBottom: '10px', alignItems: 'center'}}>
                                <h3 style={{textAlign: 'right', margin: '0 10px', width: '100px'}}>原價：</h3>
                                <h3 style={{textAlign: 'right', margin: '0 10px', width: '120px'}}>
                                    {origin_price}
                                </h3>
                            </div>

                            <div style={{display: 'flex', marginBottom: '10px', alignItems: 'center'}}>
                                <h3 style={{textAlign: 'right', margin: '0 10px', width: '100px'}}>折扣：</h3>
                                <h3 style={{textAlign: 'right', margin: '0 10px', width: '120px'}}>
                                    {origin_price - total}
                                </h3>
                            </div>

                            <div style={{display: 'flex', marginBottom: '10px', alignItems: 'center'}}>
                                <h3 style={{textAlign: 'right', margin: '0 10px', width: '100px'}}>總價：</h3>
                                <h3 style={{textAlign: 'right', margin: '0 10px', width: '120px'}}>
                                    {total}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    {BuyState === 'CreditCard' && (
                        // 左邊區域：四個輸入框
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                            <div style={{display: 'flex', marginBottom: '10px'}}>
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
                            <div style={{display: 'flex', marginBottom: '10px'}}>
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
                            <div style={{display: 'flex', marginBottom: '10px'}}>
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