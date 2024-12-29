import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';

const Bottombar: React.FC = () => {
    // 定义样式
    const titleStyle = {
        fontSize: '24px',
        margin: 0,
    };

    const footerStyle = {
        fontSize: '18px',
        lineHeight: '1.6',
    };

    const paragraphStyle = {
        margin: '5px 0',
    };

    const [footerMargin, setFooterMargin] = useState(0);

    useEffect(() => {
        // 計算視口的高度
        const updateFooterMargin = () => {
            const windowHeight = window.innerHeight;
            const bodyHeight = document.body.offsetHeight;
            // 根據頁面內容的高度調整 marginTop，保證 footer 在底部
            const margin = windowHeight - bodyHeight > 0 ? windowHeight - bodyHeight : 0;
            setFooterMargin(margin);
        };

        // 當頁面加載時，執行一次計算
        updateFooterMargin();

        // 監聽視口變化，調整 marginTop
        window.addEventListener('resize', updateFooterMargin);

        // 清理事件監聽器
        return () => {
            window.removeEventListener('resize', updateFooterMargin);
        };
    }, []);  // 空依賴數組，確保只在加載時和視口變化時執行

    return (
        <footer style={{
            backgroundColor: 'black',
            color: 'white',
            padding: '20px',
            marginTop: `${footerMargin}px`, // 给 footer 添加顶部外边距
        }}>
            <Row gutter={40}>
                {/* 聯絡我們區域 */}
                <Col span={2}>
                    <h3 style={titleStyle}>聯絡我們</h3>
                </Col>

                <Col span={6}>
                    <footer style={footerStyle}>
                        <p style={paragraphStyle}>電話：02-1234-5678</p>
                        <p style={paragraphStyle}>電子信箱：ootd@gmail.com</p>
                        <p style={paragraphStyle}>地址：10608台北市大安區忠孝東路三段1號</p>
                    </footer>
                </Col>

                {/* Contact Us 區域 */}
                <Col span={2}>
                    <h3 style={titleStyle}>Contact Us</h3>
                </Col>
                <Col span={6}>
                    <footer style={footerStyle}>
                        <p style={paragraphStyle}>Phone: 02-1234-5678</p>
                        <p style={paragraphStyle}>Email: ootd@gmail.com</p>
                        <p style={paragraphStyle}>Address: No. 1, Sec. 3, Zhongxiao E. Rd., Da'an Dist., Taipei City 10608 , Taiwan (R.O.C.)</p>
                    </footer>
                </Col>

                {/* About Us 和 關於我們區域 */}
                <Col span={6} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <Link
                        to="/aboutus"
                        style={{
                            textDecoration: 'none',  // 禁用下划线
                            color: 'white',          // 保证文字颜色为白色
                        }}
                    >
                        <h3 style={titleStyle}>關於我們</h3>
                        <h3 style={{ ...titleStyle, marginTop: '10px' }}>About Us</h3>
                    </Link>
                </Col>
            </Row>
        </footer>
    );
};

export default Bottombar;
