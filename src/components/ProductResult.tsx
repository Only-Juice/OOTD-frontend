import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Spinner, Carousel } from 'react-bootstrap';
import { Product } from '../types';

const ProductResult: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<Product | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetch(`/api/Product/GetProduct?id=${id}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (!data) {
                        setSearchError('找不到相關結果');
                        setSearchResults(null);
                    } else {
                        setSearchError(null);
                        setSearchResults(data);
                    }
                })
                .catch(() => {
                    setLoading(false);
                    setSearchError('搜尋過程中發生錯誤');
                    setSearchResults(null);
                });
        }
    }, [id]);

    return (
        <Container>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="border" />
                    <span className="ml-2">正在搜尋</span>
                </div>
            )}
            {!loading && searchError && <p style={{ color: 'red' }}>{searchError}</p>}
            {!loading && !searchResults && !searchError && <p>找不到相關結果</p>}
            {!loading && searchResults && (
                <div className="product-item">
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1 }}>
                            <Carousel>
                                {searchResults.Images.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block"
                                            loading="lazy"
                                            style={{ objectFit: 'contain', height: '300px' }}
                                            src={image}
                                            alt={searchResults.Name}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1><b>{searchResults.Name}</b></h1>
                            <p style={{ color: '#6c757d' }}>商品編號: {searchResults.ID}</p>
                            <p>{searchResults.Description.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}</p>
                            <h4 style={{ color: 'red' }}><b>NT${searchResults.Price}</b></h4>
                            <p style={{ color: '#6c757d' }}>庫存: {searchResults.Quantity}</p>

                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}></div>
                            <label htmlFor="quantity" className="mr-2">數量:</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                min="1"
                                max={searchResults.Quantity}
                                defaultValue="1"
                                className="form-control d-inline-block"
                                style={{ width: '60px', marginRight: '10px' }}
                            />
                            <Button variant="primary">加入購物車</Button>
                        </div>
                    </div>
                </div>
            )
            }
        </Container >
    );
};

export default ProductResult;
