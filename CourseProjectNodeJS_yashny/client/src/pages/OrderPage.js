import React, { useEffect, useState, useContext } from "react";
import { Context } from "../index";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { useParams} from 'react-router-dom'
import { getOneUserOrder, fetchBrands, deleteOrder } from "../http/productAPI";
import ProductItem from "../components/ProductItem";
import { observer } from "mobx-react-lite";
import {useNavigate} from 'react-router-dom'
import { ORDER_ROUTE } from "../utils/consts";

const OrderPage = observer(() => {
    const {user} = useContext(Context)
    const {product} = useContext(Context)
    const [products, setProducts] = useState([])
    const [order, setOrder] = useState([{}])
    const {orderId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getOneUserOrder(user.userId, orderId)
          .then(data => {
            setOrder(data);
            setProducts(data[0].products);
          })
    }, [])

    useEffect(() => {
        fetchBrands().then(data => product.setBrands(data))
      }, [])


    const getBrandNameByProductId = (brandId) => {
        const brand =  product.brands.find(brand => brand.id === brandId);
        return brand.name;
    }

    const delOrder = async () => {
        try {
            if (!user.userId) {
                alert("Вы не авторизованы")
                return
            }
            await deleteOrder(orderId)     
            navigate(ORDER_ROUTE)
            alert("Заказ отменён")
        } catch(e) {
            alert(e)
        }
    }

    return (
        <Container>
            <h1>Заказ: {order[0].id}</h1>
            <Row className="mt-2">
                <Col md={8}>
                    <Row className="d-flex">           
                        {products.map(product =>
                            <ProductItem key={product.id} product={product} brand={getBrandNameByProductId(product.brandId)}/>
                        )}
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{width: 300, height: 300, fontSize: 24, border: '5px solid lightgray'}}
                    >
                        <div className="m-3">
                            <div>Цена: {order[0].total_cost}$</div>
                            <div>Статус: {order[0].status}</div>
                            <div>Дата: {`${order[0].date}`.substring(0, 10)}</div>
                        </div>
                        {order[0].status === 'В обработке' ?
                            <Button variant="outline-dark" onClick={() => delOrder()}>Отменить заказ</Button>
                            :
                            <></>
                        }
                        
                    </Card>   
                </Col>
            </Row>
        </Container> 
    )
  
})

export default OrderPage;