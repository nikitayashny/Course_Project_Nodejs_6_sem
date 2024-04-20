import { Card, Row } from "react-bootstrap";
import {useNavigate} from 'react-router-dom'
import { ORDER_ROUTE } from "../utils/consts";
import { Context } from "../index";
import React, {useContext} from "react";

const OrderItem = ({order}) => {
    const navigate = useNavigate()
    const {user} = useContext(Context)
    return (
        <Row className="mt-3 " onClick={() => navigate(ORDER_ROUTE + '/' + user.userId + '/' + order.id)}>
        <Card className="w-100 cursor-pointer border-dark text-center">
          <div className="m-3 d-flex">
            <div style={{width: "50px"}}>{order.id}</div>
            <div style={{width: "250px"}}>{order.total_cost}$</div>
            <div style={{width: "250px"}}>{order.status}</div>
            <div style={{width: "280px"}}>{order.date.substring(0, 10)}</div>
          </div>
        </Card>
      </Row>
    )
}

export default OrderItem