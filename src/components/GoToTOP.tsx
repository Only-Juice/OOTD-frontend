import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const GoToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleVisibility = () => {
        setIsVisible(window.scrollY > 300);
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <Button
            variant="primary"
            className="rounded-circle"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                display: isVisible ? 'block' : 'none',
                zIndex: 1000 // Add this line to ensure the button is on the top layer
            }}
            onClick={scrollToTop}
        >
            <FaArrowUp />
        </Button>
    );
};

export default GoToTop;