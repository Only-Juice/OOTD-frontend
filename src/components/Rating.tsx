import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ListGroup, Card, Container, Row, Col, Form, Button, ButtonGroup } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaRegUserCircle } from "react-icons/fa";
import { RatingResult } from '../types';
import { Link } from 'react-router-dom';


interface RatingProps {
    productId?: number;
    isPending: boolean;
    data?: RatingResult[];
    refetch: () => void;
    seller?: boolean;
}

const Rating: React.FC<RatingProps> = ({ productId, isPending, data, refetch, seller }) => {
    const queryClient = useQueryClient();
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
    const [filter, setFilter] = useState<number | null>(null);
    const [preprocessedData, setPreprocessedData] = useState<RatingResult[] | null>(null);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    const MySwal = withReactContent(Swal);

    const { data: remainingRatingTimesData, refetch: remainingRatingTimesRefetch } = useQuery({
        queryKey: [`GetRemainingRatingTimes_${productId}`],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!productId || !token) {
                return null;
            }
            return fetch(`/api/Rating/GetRemainingRatingTimes?productId=${productId}`, {
                headers: {
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                    'Content-Type': 'application/json',
                },
            }).then((res) => {
                if (res.status === 404) {
                    return null;
                }
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
        },
    });

    const mutation = useMutation({
        mutationFn: (newRating: { ProductID: number; Rating: number }) => {
            const token = localStorage.getItem('token');
            return fetch('/api/Rating/LeaveRating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token ? ('Bearer ' + token) : ''}`,
                },
                body: JSON.stringify(newRating),
            })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [`GetProductRating_${productId}`] });
            refetch();
            remainingRatingTimesRefetch();
            if (data.status === 400) {
                Toast.fire({
                    icon: "error",
                    title: "評價失敗，請確認是否已購買過本商品"
                });
            } else if (data.status === 401) {
                Toast.fire({
                    icon: "error",
                    title: "請先登入"
                });
            } else if (data.ok) {
                let timerInterval: number;
                MySwal.fire({
                    title: 'Success',
                    text: '評價成功!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                        const timer = Swal.getPopup()?.querySelector("b");
                        if (timer) {
                            timerInterval = setInterval(() => {
                                timer.textContent = `${Swal.getTimerLeft()}`;
                            }, 100);
                        }
                    },
                    willClose: () => {
                        clearInterval(timerInterval);
                    }
                });
            }
        },
        onError: (error: Error) => {
            console.log(error);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) {
            Toast.fire({
                icon: "error",
                title: "請選擇評分"
            });
            return;
        }
        if (!productId) {
            Toast.fire({
                icon: "error",
                title: "內部錯誤"
            });
            return;
        }
        mutation.mutate({ ProductID: productId, Rating: newRating });
    };

    const renderStars = (rating: number, starSize: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <>
                {[...Array(fullStars)].map((_, index) => <FaStar key={`full-${index}`} className="text-warning" size={starSize} />)}
                {halfStar === 1 && <FaStarHalfAlt className="text-warning" size={starSize} />}
                {[...Array(Math.floor(emptyStars))].map((_, index) => <FaRegStar key={`empty-${index}`} className="text-warning" size={starSize} />)}
            </>
        );
    };

    const renderOneStar = (rating: number, position: number) => {
        const starSize = 30; // Adjust the size as needed
        if (rating >= position) {
            return <FaStar key={position} className="text-warning" size={starSize} />;
        } else if (rating >= position - 0.5) {
            return <FaStarHalfAlt key={position} className="text-warning" size={starSize} />;
        } else {
            return <FaRegStar key={position} className="text-warning" size={starSize} />;
        }
    }

    const handleStarClick = (rating: number) => {
        setNewRating(rating);
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setTotalRating(data.reduce((acc, rating) => acc + rating.Rating, 0) / data.length);
            const processedData = data.map(rating => ({
                ...rating,
                Rating: Math.round(rating.Rating * 2) / 2 // Round to nearest 0.5
            }));
            setPreprocessedData(processedData);
        }
    }, [data]);

    const handleFilterChange = (rating: number | null) => {
        setFilter(rating);
    };

    const filteredData = filter !== null ? preprocessedData?.filter(rating => rating.Rating >= filter && rating.Rating < filter + 1) : preprocessedData;

    return (
        <div className='mt-2'>
            {isPending || data && data.length === 0 ? (
                <div>暫時沒有評價</div>
            ) : (
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row>
                            <Col xs={12}>
                                <Row className='mt-3 mb-3'>
                                    <Col lg={12} xl={6} xxl={4} className='text-center'>
                                        <h1>
                                            {totalRating.toFixed(1)}/5.0
                                        </h1>
                                        <div className='text-center'>
                                            {renderStars(totalRating, 40)}
                                        </div>

                                    </Col>
                                    <Col lg={12} xl={6} xxl={8} className="mt-3 align-items-center d-flex justify-content-center">
                                        <Button className='mx-1' variant='outline-primary' onClick={() => handleFilterChange(null)}>全部</Button>
                                        <Button className='mx-1' variant='outline-primary' onClick={() => handleFilterChange(5)}>5星</Button>
                                        <Button className='mx-1' variant='outline-primary' onClick={() => handleFilterChange(4)}>4星</Button>
                                        <Button className='mx-1' variant='outline-primary' onClick={() => handleFilterChange(3)}>3星</Button>
                                        <Button className='mx-1' variant='outline-primary' onClick={() => handleFilterChange(2)}>2星</Button>
                                        <Button className='mx-1' variant='outline-primary' onClick={() => handleFilterChange(1)}>1星</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    {filteredData?.map((rating, index) => (
                        <ListGroup.Item key={index}>
                            <div className='mt-2'>
                                <div><FaRegUserCircle size={30} /> {rating.Username.length > 2 ? `${rating.Username[0]}*****${rating.Username[rating.Username.length - 1]}` : `${rating.Username[0]}*`}</div>
                                <div>{renderStars(rating.Rating, 15)}</div>
                                <span>{new Date(rating.CreatedAt).toLocaleString('zh-TW', { hour12: false })}</span>
                            </div>
                            <div className='mt-2 mb-1'>
                                <span>{rating.Description}</span>
                                {seller && <div className='mt-2'>
                                    <Link to={`/product/${rating.ProductID}`}>
                                        <img src={rating.ProductImageUrl} alt="" style={{ width: '50px', height: '50px' }} />
                                        <span className='ms-2'>{rating.ProductName}</span>
                                    </Link>
                                </div>}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            {productId && remainingRatingTimesData && remainingRatingTimesData.RemainingRatingTimes != 0 && (
                <Form onSubmit={handleSubmit} className="mt-4">
                    <Form.Group controlId="rating">
                        <Form.Label>留下評價</Form.Label>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={`star-${star}`}
                                    style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }}
                                >
                                    <span
                                        style={{ position: 'absolute', left: 0, width: '50%', height: '100%' }}
                                        onMouseEnter={() => setHoverRating(star - 0.5)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStarClick(star - 0.5);
                                        }}
                                    />
                                    <span
                                        style={{ position: 'absolute', right: 0, width: '50%', height: '100%' }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStarClick(star);
                                        }}
                                    />
                                    {renderOneStar(hoverRating || newRating, star)}
                                </span>
                            ))}
                        </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-2">
                        提交
                    </Button>
                </Form>
            )}
        </div>
    );
};

export default Rating;