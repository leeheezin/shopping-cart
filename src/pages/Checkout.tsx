import { useEffect, useRef, useState } from "react";
import {
    PaymentWidgetInstance,
    loadPaymentWidget
    } from "@tosspayments/payment-widget-sdk";
    import { nanoid } from "nanoid";
import { useNavigate, useNavigation } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "../components/CartItem";
import { StoreItem } from "../components/StoreItem";
import { formatCurrency } from "../utilities/formatCurrency";
import storeItems from "../data/items.json"
import { Button } from "react-bootstrap";

    const selector = "#payment-widget";
    const clientKey = "test_ck_AQ92ymxN34Ll41emJp1O3ajRKXvd";
    const secretKey = "test_sk_yZqmkKeP8gmwagKdExydVbQRxB9l";


    export function Checkout() {
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<
        PaymentWidgetInstance["renderPaymentMethods"]
    > | null>(null);
    const [price, setPrice] = useState<number>(0);
    const {cartItems} = useShoppingCart();
    const navigate = useNavigate();

    useEffect(() => {
            if (cartItems.length > 0) {
            const totalPrice = cartItems.reduce((total, cartItem) => {
                const item = storeItems.find(i => i.id === cartItem.id);
                return total + (item?.price || 0) * cartItem.quantity;
            }, 0);
            setPrice(totalPrice);
            }
    }, [cartItems]);

    useEffect(() => {
        (async () => {
        const paymentWidget = await loadPaymentWidget(clientKey, secretKey);

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            selector,
            { value: price, currency: "KRW", country: "KR" },
            { variantKey: "DEFAULT" }
        );

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        })();
    }, [price]); 

    const proceedPayment = async () => {
        const paymentWidget = paymentWidgetRef.current;
    
        try {
            const orderId = nanoid();
            const orderName = cartItems.map(item=>{
                const storeItem = storeItems.find(i=>i.id === item.id)
                return storeItem?.name || '';
            }).join(', ');
            
            console.log('orderId:', orderId);
            console.log('orderName:', orderName);
    
            await paymentWidget?.requestPayment({
                orderId: orderId,
                orderName: orderName,
                successUrl: `${window.location.origin}/success`,
                failUrl: `${window.location.origin}/fail`
            });
        } catch (error) {
            console.log('에러', error); 
        }
    }
    
    return (
        <div>
        <h1>주문서</h1>
        {cartItems.map(item =>(
            <CartItem key={item.id} {...item} />
        ))}
        <span>{`${price.toLocaleString()}원`}</span>
        <div>
            <label>
            <input
                type="checkbox"
                onChange={(event) => {
                setPrice(event.target.checked ? price - 10000 : price + 10000);
                }}
            />
            첫 구매 10,000원 할인 쿠폰 적용
            </label>
        </div>
        <div id="payment-widget" />
        <Button variant="success"
            onClick={proceedPayment}
        >
            결제하기
        </Button>
        <Button variant="danger" onClick={()=>navigate(-1)}>뒤로가기</Button>
        </div>
    );
    }
