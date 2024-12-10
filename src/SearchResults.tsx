import React from "react";
import { SearchResultsProps } from "./types";


const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, searchError }) => {
    return (
        <div>
            {searchError && <p style={{ color: 'red' }}>{searchError}</p>}
            {searchResults.length === 0 && !searchError && <p>找不到相關結果</p>}
            <ul>
                {searchResults.map(product => (
                    <li key={product.ID}>
                        <h2>{product.Name}</h2>
                        <p>{product.Description}</p>
                        <p>Price: {product.Price}</p>
                        <p>Quantity: {product.Quantity}</p>
                        {product.Images.map((image, index) => (
                            <img key={index} src={image} alt={product.Name} width="200" />
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults;