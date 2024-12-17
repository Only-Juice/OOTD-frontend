import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Container } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useQuery } from '@tanstack/react-query';

const ProductSlider: React.FC = () => {
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

    const { data } = useQuery({
        queryKey: [`GetTopProducts`], queryFn: () => fetch(`/api/Product/GetTopProducts?count=5`).then((res) => {
            if (!res.ok) {
                return null;
            }
            return res.json();
        })
    },
    );

    return (
        <Container>
            <Slider {...settings}>
                {data && Array.isArray(data) ? (
                    data.slice(0, 5).map((product: any) => (
                        <ProductCard key={product.ID} product={product} />
                    ))
                ) : (
                    [...Array(5)].map((_, index) => (
                        <ProductCard key={index} product={null} />
                    ))
                )}
            </Slider>
        </Container>
    );
};

export default ProductSlider;