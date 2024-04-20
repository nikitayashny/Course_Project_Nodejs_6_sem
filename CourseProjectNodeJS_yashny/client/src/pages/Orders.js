import { observer } from "mobx-react-lite";
import { Container } from "react-bootstrap";
import OrderItem from "../components/OrderItem";
import React, {useContext, useState, useEffect} from "react";
import { Context } from "../index";
import { getUserOrders } from "../http/productAPI";

const Orders = observer(() => {
    const [orders, setOrders] = useState([])
    const {user} = useContext(Context)

    useEffect(() => {
        getUserOrders(user.userId).then(data => 
            setOrders(data))
    }, [])

    return (
        <Container>
        <h1>Заказы</h1>
            {orders.map(order =>
                <OrderItem key={order.id} order={order}/>
            )}
        </Container>
    )
})

export default Orders;