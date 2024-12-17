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
    pauseOnHover: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        }
    ]
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