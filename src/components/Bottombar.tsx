import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import { FaLocationDot, FaPhoneFlip, FaEnvelope, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa6";
import {FaExclamationTriangle} from "react-icons/fa";

const Bottombar: React.FC = () => {


    return (
        <Container fluid className='mt-5'>
            <hr />
            <Row>
                <Col sm={8} md={4} className='text-center'>
                    <h3 className='mb-4'><Link to="/aboutus" style={{ color: 'inherit', textDecoration: 'none' }}>關於我們</Link></h3>
                    <p className='text-align'>OOTD 是一個致力於世界茶交易的電商網站。我們旨在提升全球茶文化的知識與認識，幫助人們了解正確的茶葉選擇和沖泡方法，提供優質的茶葉及茶具，並將世界各地的優質茶葉帶給每一位消費者。</p>
                </Col>
                <Col sm={4} md={4} className='text-center'>
                    <h3 className='mb-4'>聯絡我們</h3>
                    <p><FaPhoneFlip /> <a href="tel:+886212345678">02-1234-5678</a></p>
                    <p><FaEnvelope /> <a href="mailto:ootd@gmail.com">ootd@gmail.com</a></p>
                    <p><FaLocationDot /> No. 1, Sec. 3, Zhongxiao E. Rd., Da'an Dist., Taipei City 10608 , Taiwan (R.O.C.)</p>
                    <p><FaExclamationTriangle /> <Link to="/report" style={{ color: 'inherit', textDecoration: 'none' }}>舉報</Link></p>
                </Col>
                <Col sm={12} md={4} className='text-center'>
                    <h3 className='mb-4'>社群平台</h3>
                    <p><FaGithub /> <Link to='https://github.com/Only-Juice/OOTD-frontend'>Github</Link></p>
                    <p><FaFacebook /> <Link to='/rickroll'>Facebook</Link></p>
                    <p><FaInstagram /> <Link to='/c8763'>Instagram</Link></p>
                </Col>
                <hr />
                <Col md={12} className='text-center'>
                    <p>NTUT 2024 Fall Database Systems Final Project</p>
                    <p>Made with <Link to='/c0' style={{ color: '#e25555' }}>❤</Link> in Taiwan</p>
                </Col>
            </Row>
        </Container >
    );
};

export default Bottombar;
