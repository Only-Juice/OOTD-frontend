import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProductSliderProps } from './types';

const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true
};

const ProductSlider: React.FC<ProductSliderProps> = ({ products }) => {
    return (
        <div className="container mt-4">
            <Slider {...settings}>
                {products.map(product => (
                    <div key={product.ID}>
                        <h2>{product.Name}</h2>
                        <p>{product.Description}</p>
                        <p>Price: {product.Price}</p>
                        <p>Quantity: {product.Quantity}</p>
                        {product.Images.map((image, index) => (
                            <img key={index} src={image} alt={product.Name} width="200" />
                        ))}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductSlider;