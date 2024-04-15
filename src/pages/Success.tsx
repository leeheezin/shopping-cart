import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import storeItems from "../data/items.json"

export function Success() {
    const [searchParams] = useSearchParams();
    const secretKey = "test_sk_yZqmkKeP8gmwagKdExydVbQRxB9l";
    const paymentKey = searchParams.get("paymentKey");
    const authKey = btoa(secretKey + ":");
    const orderId = searchParams.get("orderId");
    const amount = Number(searchParams.get("amount")) //이 어마운트를 넘버로 안줘서..필수파라미터값이 빠졌다고 나옴 string이어서..
    const {cartItems} = useShoppingCart();
    const navigate = useNavigate()

    useEffect(() => {
        if (
        !orderId ||
        !paymentKey ||
        !amount ||
        !authKey 
        )
        return;

        const getOrderConfirmData = async () => {
            try {
                const confirm = await axios.post(
                "https://api.tosspayments.com/v1/payments/confirm",
                { paymentKey: paymentKey, amount: amount, orderId: orderId },
                {
                    headers: {
                    Authorization: `Basic ${authKey}`,
                    "Content-Type": "application/json",
                    },
                }
                );
                console.log('결제 확인 응답:', confirm.data);
            } catch (error) {
                alert('결제 에러')
                console.log('에러', error); 
            }
        };

        getOrderConfirmData();
        
    }, []);

    return (
        <div>
        <h1>주문이 완료 되었습니다!</h1>
        <div>{`주문 아이디: ${orderId}`}</div>
        {cartItems.map(item => {
            const storeItem = storeItems.find(i => i.id === item.id);
            return (
                <div key={item.id}>
                    <p>주문 상품: {storeItem?.name}</p>
                    <img src={storeItem?.imgUrl} alt="" />
                </div>
            );
        })}
        <div>{`결제 금액: ${amount}원`}</div>
        </div>
    );
}
