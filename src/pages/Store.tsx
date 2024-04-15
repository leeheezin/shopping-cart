import { Col, Row } from "react-bootstrap"
import { StoreItem } from "../components/StoreItem"
import storeItems from "../data/items.json"

export function Store() {
    return (
        <>
            <h1>인기 상품</h1>
            <Row md={2} xs={1} lg={3} className="g-4">
                {storeItems.map(item => (
                    <Col key={item.id}>
                        <StoreItem {...item}/>
                    </Col>
                ))}
            </Row>
        </>
    )
}