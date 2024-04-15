import { Card as BootstrapCard, Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext"
import { formatCurrency } from "../utilities/formatCurrency"
import { Link } from 'react-router-dom';

type StoreItemProps = {
    id: number
    name: string
    price: number
    imgUrl: string
}

export function StoreItem({id, name, price, imgUrl}:
StoreItemProps) {
    const { getItemQuantity, 
            increaseCartQuantity, 
            decreaseCartQuantity, 
            removeFromCart,
        } = useShoppingCart()
    const quantity = getItemQuantity(id)
    return (
        <>
            <BootstrapCard className="h-100">
                <BootstrapCard.Img 
                variant="top" 
                src={imgUrl} 
                height="200px" 
                style={{objectFit:"cover"}}
                />
            <BootstrapCard.Body className="d-flex flex-column">
                <BootstrapCard.Title className="d-flex justify-content-between align-items-baseline mb-4">
                    <span className="fs-5">{name}</span>
                    <span className="ms-2 text-muted">{formatCurrency (price)}</span>
                </BootstrapCard.Title>
                <div className="mt-auto">
                    {quantity === 0 ? (
                        <Button className="w-100 bg-success text-light border-0" onClick={() => increaseCartQuantity(id)}>+ 장바구니 담기</Button>
                    ) : <div className="d-flex align-items-center flex-column" style={{gap:".5rem"}}>
                            <div className="d-flex align-items-center justify-content-center" style={{gap:".5rem"}}>
                                <Button onClick={() => decreaseCartQuantity(id)} size="sm" className="bg-success border-0">-</Button>
                                <div>
                                    <span className="fs-3">{quantity}</span>
                                </div>
                                <Button onClick={() => increaseCartQuantity(id)} size="sm" className="bg-success border-0">+</Button>
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="danger" size="sm" onClick={() => removeFromCart(id)}>x 취소</Button>
                                <Button variant="success" size="sm">
                                    <Link className="text-white" to="/checkout">구매하기</Link>
                                </Button>
                            </div>
                        </div>}
                </div>
            </BootstrapCard.Body>
            </BootstrapCard>
        </>
    )
}