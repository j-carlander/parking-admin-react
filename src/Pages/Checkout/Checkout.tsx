import { useLocation } from "react-router-dom"
import fetchService from "../../services/fetchService";

import './Checkout.css'

export function Checkout(){
    const location = useLocation()
    const { orderId } = location.state

    async function checkoutOrder(){
        if(!orderId) return alert('No valid order id');
        const newOrder = await fetchService.checkoutOrderNoPay(orderId) 
        console.log('new order no pay: ', newOrder);
        alert('Order confirmed. Pay at arrival!')
    }
    return(
        <article className="checkout-wrapper">
        <h2>Kassa</h2>
        <h3>Checka ut order: {orderId}</h3>
        <button className="general-button" onClick={checkoutOrder}>Betala senare</button>
        </article>
    )
}