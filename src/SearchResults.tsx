import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { Product } from './types';


const SearchResults: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchWord = queryParams.get('q');

        if (searchWord) {
            fetch(`/api/Product/SearchProducts?searchWord=${searchWord}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                },
                body: '',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        setSearchError('找不到相關結果');
                        setSearchResults([]);
                    } else {
                        setSearchError(null);
                        setSearchResults(data);
                    }
                })
                .catch(error => {
                    setSearchError('搜尋過程中發生錯誤');
                    setSearchResults([]);
                });
        }
    }, [location.search]);

    return (
        <div>
            {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
            {searchResults.length === 0 && !searchError && <p>找不到相關結果</p>}
            <Row>
                {searchResults.map(product => (
                    <Col key={product.ID} md={4} className="mb-4">
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>{product.Name}</Card.Title>
                                <Card.Text>{product.Description.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}</Card.Text>
                                <Card.Text>Price: {product.Price}</Card.Text>
                                <Card.Text>Quantity: {product.Quantity}</Card.Text>
                                {product.Images.map((image, index) => (
                                    <Card.Img key={index} src={image} alt={product.Name} className="img-fluid mb-2" />
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default SearchResults;