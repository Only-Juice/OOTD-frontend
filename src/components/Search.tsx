import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";
import "../styles/Search.css"
import TopKeyword from './TopKeyword';

const Search: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    const [query, setQuery] = useState(searchQuery || '');
    const navigate = useNavigate();

    useEffect(() => {
        setQuery(searchQuery || '');
    }, [searchQuery]);

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <Row className='justify-content-center w-100'>
            <Col lg={6}>
                <div>
                    <div className='search-container m-1'>
                        <form onSubmit={onSearch} className="d-flex">
                            <FaSearch className='search-icon' />
                            <input
                                type="text"
                                className="form-control search-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="搜尋產品"
                            />
                            <button className="btn btn-search ms-2 m-1 d-none d-sm-block" type="submit">Search</button>
                        </form>
                    </div>
                    <TopKeyword />
                </div>
            </Col>
        </Row>
    );
};

export default Search;