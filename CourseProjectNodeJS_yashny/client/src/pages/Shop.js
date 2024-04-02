import React, { useContext, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import ProductList from "../components/ProductList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchBrands, fetchTypes, fetchProducts } from "../http/productAPI";
import Pages from "../components/Pages";
import SearchBar from "../components/SearchBar";

const Shop = observer(() => {
  const {product} = useContext(Context)

  useEffect(() => {
    fetchTypes().then(data => product.setTypes(data))
    fetchBrands().then(data => product.setBrands(data))
  }, [])

  useEffect(() => {
    fetchProducts(product.selectedType.id, product.selectedBrand.id, product.page, product.limit).then(data => {
      product.setProducts(data.rows)
      product.setTotalCount(data.count)
    })
  }, [product.page, product.selectedType, product.selectedBrand])

  

  return (
    <Container>
        <SearchBar/>
        <Row className="mt-2">
          <Col md={3}>
            <TypeBar/>
          </Col>
          <Col md={9}>
            <BrandBar/>
            <ProductList/>
            <Pages/>
          </Col>
        </Row>
    </Container>
  )
})

export default Shop;