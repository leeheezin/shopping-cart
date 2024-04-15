import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import storeItems from "../data/items.json"
import { formatCurrency } from "../utilities/formatCurrency";


type ShoppingCartProps = {
    isOpen: boolean
    removeBtn: boolean
}
export function ShoppingCart({isOpen}:ShoppingCartProps) {
    const {closeCart, closeBtn, cartItems, removeAllCart} = useShoppingCart()
    const handleBtn = () => {
        removeAllCart()
        closeBtn()
    }
    return (
        <>
            <Offcanvas show={isOpen} onHide={closeCart} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>장바구니</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Stack gap={3}>
                        {cartItems.map(item =>(
                        <CartItem key={item.id} {...item} />
                        ))}
                        <div className="ms-auto fw-bold fs-5">
                            총{" "}
                            {formatCurrency(cartItems.reduce((total,
                            cartItem) => {
                                const item = storeItems.find(i => i.id === cartItem.id)
                                return total + (item?.price || 0) * cartItem.quantity
                            }, 0))}
                        </div>
                    </Stack>
                    <button onClick={handleBtn} className="btn btn-outline-danger btn-sm">전체 삭제</button>
                    <button className="btn btn-outline-success btn-sm">전체 구매</button>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}