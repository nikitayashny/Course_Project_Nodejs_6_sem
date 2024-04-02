import React, { useEffect, useState, useContext } from "react";
import { Context } from "../index";
import { Col, Container, Image, Row, Card, Button } from "react-bootstrap";
import star from '../assets/star.png'
import {useParams} from 'react-router-dom'
import { fetchOneProduct } from "../http/productAPI";
import DeleteProduct from "../components/modals/DeleteProduct";
import UpdateProduct from "../components/modals/UpdateProduct";
import { observer } from "mobx-react-lite";

const ProductPage = observer(() => {
    const [product, setProduct] = useState({info: []})
    const {id} = useParams()
    const {user} = useContext(Context)

    const [deleteProductVisible, setDeleteProductVisible] = useState(false)
    const [updateProductVisible, setUpdateProductVisible] = useState(false)

    useEffect(() => {
        fetchOneProduct(id).then(data => setProduct(data))
    }, [])

  return (
    <Container className="mt-3">
        {user.isAdmin ? (
        <>
            <Button variant="outline-dark" className="m-3" onClick={() => setUpdateProductVisible(true)}>Изменить</Button>
            <Button variant="outline-danger" onClick={() => setDeleteProductVisible(true)}>Удалить</Button>
            <DeleteProduct show={deleteProductVisible} onHide={() => setDeleteProductVisible(false)}/>
            <UpdateProduct Product={product} show={updateProductVisible} onHide={() => {
                fetchOneProduct(id).then(data => setProduct(data))
                setUpdateProductVisible(false)}
                }/>
        </>
        ) : null}
        <Row>
        <Col md={4}>
            <Image width={300} height={300} src={process.env.REACT_APP_API_URL + product.img} />
        </Col>
        <Col md={4}>
            <div className="d-flex flex-column align-items-center">
                <h2>{product.name}</h2>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{background: `url(${star}) no-repeat center center`, width: 240, height: 240, backgroundSize: 'cover', fontSize:64}}
                  >
                  {product.rating}
                </div>
            </div>
        </Col>
        <Col md={4}>
            <Card
                className="d-flex flex-column align-items-center justify-content-around"
                style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
            >
                <h3>Цена: {product.price}$</h3>
                <Button variant="outline-dark">Добавить в корзину</Button>
            </Card>
        </Col>
        </Row>   
        <Row className="d-flex flex-column m-1 mt-3">
            <h1>Характеристики</h1>
            {product.info.map((info, index) => 
                <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                    {info.title}: {info.description}
                </Row>  
            )}
        </Row>
    </Container>
  )
})

export default ProductPage;