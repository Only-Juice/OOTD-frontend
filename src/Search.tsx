import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?q=${query}`)
    };

    return (
        <form onSubmit={onSearch} className="d-flex w-50">
            <input
                type="text"
                className="form-control me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋產品"
            />
            <button type="submit" className="btn btn-primary">搜尋</button>
        </form>
    );
};

export default Search;