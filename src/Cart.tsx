import React ,{ useState, useEffect }from 'react';
const Cart: React.FC = () => {
    const [Product, setcatchProduct] = useState([]);
    const [error,seterror] = useState(false);

    const token = localStorage.getItem('token');
    const fetchUserInfo = (token: string) => {

        fetch('/api/Product/GetCartProducts',{
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })  // 替換成您的 API URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  // 解析 JSON 回應
            })
            .then(data => {
                setcatchProduct(data); // 在這裡處理 API 返回的數據
            })
            .catch(error => {
                seterror(true);  // 處理錯誤
            });
    };
    if(token == null){
        return(
            <h1 style={{fontSize: '90px',textAlign: 'center',marginTop:'90px'}}>你他媽的應該要先登入</h1>
        )
    }
    fetchUserInfo(token);


    if(Product.length !== 0){
        return(
            <div>
                <h1 style={{fontSize: '100px'}}>Cart Information</h1>
                <div style={{marginLeft: '100px'}}>
                    <label style={{fontSize: '36px', display: 'flex'}}>
                        <input type="checkbox" style={{transform: 'scale(3)', marginRight: '20px'}}/> 全選
                    </label>
                </div>
                <h1 style={{fontSize: '100px',textAlign: 'center'}}> 商品載入中 </h1>
                <br></br>
                <div style={{marginLeft: '100px'}}>
                    <button style={{transform: 'scale(1.5)'}}>購買</button>
                    <button style={{marginLeft: '100px', transform: 'scale(1.5)'}}>刪除</button>
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                <h1 style={{fontSize: '90px',textAlign: 'center',marginTop:'90px'}}> 你他媽的應該要先買東西再來點那該死的購物車 </h1>
            </div>
        )
    }
    /*
    return(
        <div>
            <h1 style={{fontSize: '100px'}}>Cart Information</h1>
            <div style={{marginLeft: '100px'}}>
                <label style={{fontSize: '36px', display: 'flex'}}>
                    <input type="checkbox" style={{transform: 'scale(3)', marginRight: '20px'}}/> 全選
                </label>
            </div>

            <br></br>
            <div style={{marginLeft: '100px'}}>
                <button style={{transform: 'scale(1.5)'}}>購買</button>
                <button style={{marginLeft: '100px', transform: 'scale(1.5)'}}>刪除</button>
            </div>
        </div>
    );
    */
}

export default Cart;