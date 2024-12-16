import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ProductSliderProps } from '../types';
import { Container } from 'react-bootstrap';
import ProductCard from './ProductCard';

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
        <Container>
            <Slider {...settings}>
                {Array.isArray(products) && products.slice(0, 5).map(product => (
                    <ProductCard key={product.ID} product={product} />
                ))}
            </Slider>
        </Container>
    );
};

export default ProductSlider;