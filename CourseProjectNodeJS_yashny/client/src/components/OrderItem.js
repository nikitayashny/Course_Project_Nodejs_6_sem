import { Card, Row } from "react-bootstrap";
import {useNavigate} from 'react-router-dom'
import { ORDER_ROUTE } from "../utils/consts";
import { Context } from "../index";
import React, {useContext} from "react";

const OrderItem = ({order}) => {
    const navigate = useNavigate()
    const {user} = useContext(Context)
    return (
        <Row className="mt-3" onClick={() => navigate(ORDER_ROUTE + '/' + user.userId + '/' + order.id)}>
            
            <Card style={{width: 900, cursor: 'pointer'}} border={"dark"}>
                <div className="m-3">
                    <div style={{width: 50, display: "inline-block"}}>{order.id}</div>
                    <div style={{width: 250, display: "inline-block"}}>{order.total_cost}$</div>
                    <div style={{width: 250, display: "inline-block"}}>{order.status}</div>
                    <div style={{width: 280, display: "inline-block"}}>{order.date.substring(0, 10)}</div>
                </div>
            </Card>
           
        </Row>
    )
}

export default OrderItem