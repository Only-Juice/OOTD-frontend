import { Card, Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
    return (
        <Card>
            <Row gutter={40}>
                <Col span={24}>
                    <Title level={2}>關於 OOTD</Title>
                    <Paragraph style={{ fontSize: '18px', lineHeight: '1.8' }}>
                        OOTD 是一個致力於世界茶交易的電商網站。我們旨在提升全球茶文化的知識與認識，幫助人們了解正確的茶葉選擇和沖泡方法，提供優質的茶葉及茶具，並將世界各地的優質茶葉帶給每一位消費者。
                    </Paragraph>
                    <Title level={3}>故事的開端</Title>
                    <Paragraph style={{ fontSize: '18px', lineHeight: '1.8' }}>
                        故事的開端要由一個寧靜的夜晚開始說起，某天，有兩個頂尖科大的學生，去吃台北君O飯店的凱菲屋時，同學A突然表示想喝大吉嶺的茶。可惜當兩位才子看遍了茶葉區，卻找不到一絲“大吉嶺”三個字的影子。學生A雖然感到不可思議，但也只好敗興而歸，隨意拿了一個寫著 dagiling 茶包，便回到位置上查大吉嶺的英文，隨後才恍然大悟手上的 dagiling 其實就是大吉嶺茶。
                    </Paragraph>
                    <Paragraph style={{ fontSize: '18px', lineHeight: '1.8' }}>
                        由此事件，我們了解到當代許多人對茶葉的不理解，以及不正確的沖泡方法，這讓大家無法真正享受到茶的美好。為了避免這樣的情況再次發生，我們決定結合課堂所學的資料庫設計與規劃，設計一個名為「線上購茶」的茶葉整合販售網站（OOTD）。這不僅是一個基本的買賣平台，更希望透過學習資料庫邏輯，提升我們的實作能力，同時提升全國人民的喝茶意識。
                    </Paragraph>
                </Col>
            </Row>

            <Row gutter={40} style={{ marginTop: '40px' }}>
                <Col span={24}>
                    <Title level={3}>創辦人名單</Title>
                    <ul style={{ fontSize: '18px', lineHeight: '1.8' }}>
                        <li>111590004 張意昌</li>
                        <li>111590009 陳世昂</li>
                        <li>111590011 吳耀東</li>
                        <li>111590012 林品緯 (舞蹈專家)</li>
                        <li>111590028 張睿恩 (前端大師)</li>
                    </ul>
                </Col>
            </Row>
        </Card>
    );
};

export default AboutUs;