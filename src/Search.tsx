import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchProps } from './types';

const Search: React.FC<SearchProps> = ({ setResults, setError, setSearchPerformed }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/Product/SearchProducts?searchWord=${query}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                },
                body: '',
            });

            const data = await response.json();

            if (data.length === 0) {
                setError('找不到相關結果');
                setResults([]);
            } else {
                setError(null);
                setResults(data);
            }

            setSearchPerformed(true);
            navigate('/search-results');
        } catch (error) {
            setError('搜尋過程中發生錯誤');
            setResults([]);
            setSearchPerformed(true);
            navigate('/search-results');
        }
    };

    return (
        <form onSubmit={handleSearch} className="d-flex w-50">
            <input
                type="search"
                className="form-control me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜尋產品"
                aria-label="Search"
            />
            <button type="submit" className="btn btn-outline-success">搜尋</button>
        </form>
    );
};

export default Search;