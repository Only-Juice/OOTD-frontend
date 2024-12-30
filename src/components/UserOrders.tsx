import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import ShowOrder from './ShowOrder';


const UserOrders: React.FC = () => {
    const [notFound, setNotFound] = useState(false);
    const { isLoading, error, data, refetch } = useQuery({
        queryKey: [`UserOrders`],
        queryFn: () => {
            const token = localStorage.getItem('token');
            if (!token) return null;
            return fetch('/api/Order/GetUserOrders', {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
            }).then((res) => {
                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        return null;
                    } else if (res.status === 404) {
                        setNotFound(true);
                        return null;
                    }
                    throw new Error(res.statusText);
                }
                return res.json();
            })
        },
        retry: false,
    });

    useEffect(() => {
        setNotFound(false);
        refetch();
    }, [localStorage.getItem('token')]);

    return (
        <>
            {isLoading && (
                <Loading />
            )}
            {(error || notFound) &&
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
                        {error && <p style={{ color: 'red' }}>{error.message}</p>}
                        {notFound && <p>找不到訂單</p>}
                    </div>
                </div>
            }

            {data &&
                <ShowOrder data={data} />
            }
        </>
    );
};

export default UserOrders;