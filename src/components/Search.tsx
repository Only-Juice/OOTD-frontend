import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Row, Col } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";
import "../styles/Search.css"

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    const { data } = useQuery<string[]>({
        queryKey: [`GetTopKeyword`], queryFn: () => fetch(`/api/Keyword/GetTopKeyword?count=10`).then((res) => {
            if (!res.ok) {
                return [];
            }
            return res.json();
        })
    },
    );

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
                            <button className="btn btn-search ms-2 m-1" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </Col>
        </Row>
        // <div className='responsive-width me-2'>
        //     <form onSubmit={onSearch} className="d-flex">
        //         <input
        //             type="text"
        //             className="form-control me-2"
        //             value={query}
        //             onChange={(e) => setQuery(e.target.value)}
        //             placeholder="搜尋產品"
        //         />
        //         <button type="submit" className="btn btn-primary text-nowrap">搜尋</button>
        //     </form>
        //     {data && data.length > 0 && (
        //         <div className="mt-2 overflow-hidden">
        //             <ul className="list-inline mb-0">
        //                 {data.map((keyword: string) => (
        //                     <li key={keyword} className="list-inline-item">
        //                         <button
        //                             className="btn btn-link p-0 text-left"
        //                             onClick={() => navigate(`/search?q=${keyword}`)}
        //                             style={{ whiteSpace: 'nowrap' }}
        //                         >
        //                             {keyword}
        //                         </button>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     )}
        // </div>
    );
};

export default Search;