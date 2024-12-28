import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Container } from 'react-bootstrap';
import { Product } from '../types';

interface ProductsDataProps {
    ProductsData: Product[] | undefined;
    Card: React.FC<{ product: Product | null }>;
}

const ProductSlider: React.FC<ProductsDataProps> = ({ ProductsData, Card }) => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: ProductsData && ProductsData.length < 3 ? ProductsData.length : 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: ProductsData && ProductsData.length < 3 ? ProductsData.length : 2,
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


    return (
        <Container>
            <Slider {...settings}>
                {ProductsData && Array.isArray(ProductsData) ? (
                    ProductsData.slice(0, 5).map((product: Product) => (
                        <Card key={product.ID} product={product} />
                    ))
                ) : (
                    [...Array(5)].map((_, index) => (
                        <Card key={index} product={null} />
                    ))
                )}
            </Slider>
        </Container>
    );
};

export default ProductSlider;