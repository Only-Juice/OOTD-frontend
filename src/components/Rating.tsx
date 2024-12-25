import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ListGroup, Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface Rating {
    Username: string;
    Rating: number;
    CreatedAt: string;
}

interface RatingProps {
    productId: number;
    isPVC?: boolean;
}

const Rating: React.FC<RatingProps> = ({ productId, isPVC }) => {
    const queryClient = useQueryClient();
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [totalRating, setTotalRating] = useState(0);
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

    const { isPending, data, refetch } = useQuery<Rating[]>({
        queryKey: [`GetProductRating_${productId}`],
        queryFn: () => fetch(`/api/Rating/GetProductRating?productId=${productId}`).then((res) => {
            if (res.status === 404) {
                return [];
            }
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        }),
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
        }
    }, [data]);


    return (
        <Container>
            <Card className="my-4">
                <Card.Body>
                    <Card.Title className='ms-3'>商品評價</Card.Title>
                    {isPending || data && data.length === 0 ? (
                        <div>暫時沒有評價</div>
                    ) : (
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col xs={12}>
                                        <Card>
                                            <Row className='m-1 mt-3 mb-3'>
                                                <Col xs={12} md={6} lg={4} className='text-center'>
                                                    <h1>
                                                        {totalRating.toFixed(1)}/5.0
                                                    </h1>
                                                </Col>
                                                <Col xs={0} md={6} lg={8} />
                                                <Col xs={12} md={6} lg={4} className='text-center'>
                                                    {renderStars(totalRating, 40)}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {data?.map((rating, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <div>{rating.Username.length > 2 ? `${rating.Username[0]}*****${rating.Username[rating.Username.length - 1]}` : `${rating.Username[0]}*`}</div>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <div>{renderStars(rating.Rating, 30)}</div>
                                        </Col>
                                        <Col xs={12} md={12} className="text-end">
                                            <div><strong>日期:</strong> {new Date(rating.CreatedAt).toLocaleString()}</div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    {isPVC && (
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
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Rating;