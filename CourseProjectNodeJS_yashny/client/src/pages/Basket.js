import { observer } from "mobx-react-lite";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import ProductItem from "../components/ProductItem";
import React, {useContext, useState, useEffect} from "react";
import { Context } from "../index";
import { getBasket, fetchBrands } from "../http/productAPI";

const Basket = observer(() => {
  const {product} = useContext(Context)
  const [products, setProducts] = useState([])
  const {user} = useContext(Context)

  useEffect(() => {
    getBasket(user.userId).then(data => 
      setProducts(data))
  }, [])

  useEffect(() => {
    fetchBrands().then(data => product.setBrands(data))
  }, [])

  const getBrandNameByProductId = (brandId) => {
    const brand =  product.brands.find(brand => brand.id === brandId);
    return brand.name;
    }

  return (
    <Container>
        <h1>Корзина</h1>
        <Row className="mt-2">
          <Col md={9}>
          <Row className="d-flex">
             {products.map(product =>
                <ProductItem key={product.id} product={product} brand={getBrandNameByProductId(product.brandId)}/>
            )}
        </Row>
          </Col>
          <Col md={3}>
            <Card
                className="d-flex flex-column align-items-center justify-content-around"
                style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
            >
                <h3>Общая сумма: {products.reduce((sum, product) => sum + product.price, 0)}$</h3>
                <Button variant="outline-dark">Оформить заказ</Button>
            </Card>
        </Col>
        </Row>
    </Container>
  )
})

export default Basket;