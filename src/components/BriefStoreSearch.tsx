import React from "react";
import { SearchStoresResponse } from "../types";
import StoreBar from "./StoreBar";

interface BriefStoreSearchProps {
    data: SearchStoresResponse | undefined;
}

const BriefStoreSearch: React.FC<BriefStoreSearchProps> = ({ data }) => {
    return (
        <>
            {data && Array.isArray(data.Stores) ? (
                <>
                    <p>推薦商店</p>
                    <StoreBar key={data.Stores[0].StoreID} store={data.Stores[0]} />
                </>
            ) : (
                <StoreBar key={null} store={null} />
            )}
        </>
    );
};

export default BriefStoreSearch;