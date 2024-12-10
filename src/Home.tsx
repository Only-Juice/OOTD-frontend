import React from 'react';
import ProductSlider from './ProductSlider';
import { HomeProps } from './types';

const Home: React.FC<HomeProps> = ({ products }) => {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Products</h1>
            <div className="shadow mb-4">
                <ProductSlider products={products} />
            </div>

            <div className="row">
                {products.map(product => (
                    <div key={product.ID} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h2 className="card-title">{product.Name}</h2>
                                <p className="card-text">{product.Description}</p>
                                <p className="card-text">Price: {product.Price}</p>
                                <p className="card-text">Quantity: {product.Quantity}</p>
                                {product.Images.map((image, index) => (
                                    <img key={index} src={image} alt={product.Name} className="img-fluid mb-2" />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;