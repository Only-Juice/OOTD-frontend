import React from "react";
import { Carousel, Button } from "react-bootstrap";
import { Product } from "../types";

const ProductContainer: React.FC<{ product: Product | null }> = ({ product }) => {
    return (
        <>
            {product &&
                <div className="product-item">
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <Carousel>
                                {product.Images.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block mx-auto"
                                            loading="lazy"
                                            style={{ objectFit: 'contain', height: '300px' }}
                                            src={image}
                                            alt={product.Name}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1><b>{product.Name}</b></h1>
                            <p style={{ color: '#6c757d' }}>商品編號: {product.ID}</p>
                            <p>{product.Description.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}</p>
                            <h4 style={{ color: 'red' }}><b>NT${product.Price}</b></h4>
                            <p style={{ color: '#6c757d' }}>庫存: {product.Quantity}</p>

                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}></div>
                            <label htmlFor="quantity" className="mr-2">數量:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max={product.Quantity}
                                defaultValue="1"
                                className="form-control d-inline-block"
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <Button variant="primary">加入購物車</Button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default ProductContainer;