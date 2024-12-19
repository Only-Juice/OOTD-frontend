import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { Store } from "../types";
import StoreBar from "./StoreBar";


interface SearchStoresResponse {
    PageCoint: number;
    Stores: Store[];
}

const BriefStoreSearch: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchWord = queryParams.get('q');

    const { isLoading, data } = useQuery<SearchStoresResponse>({
        queryKey: [`SearchStores_${searchWord}`],
        queryFn: () => {
            if (!searchWord) return Promise.resolve(null);
            return fetch(`/api/Store/SearchStores?keyword=${searchWord}`, {
                method: 'GET',
            }).then((res) => {
                if (!res.ok) {
                    return null;
                }
                return res.json();
            })
        },
    });

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                data && Array.isArray(data.Stores) ? (
                    <>
                        <p>推薦商店</p>
                        <StoreBar key={data.Stores[0].StoreID} store={data.Stores[0]} />
                    </>
                ) : (
                    <StoreBar key={null} store={null} />
                )
            )}
        </>
    );
};

export default BriefStoreSearch;