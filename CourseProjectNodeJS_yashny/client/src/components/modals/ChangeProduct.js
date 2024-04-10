import React, { useContext, useEffect } from "react";
import {Container, Row, Col } from "react-bootstrap";
import ProductList from "../../components/ProductList";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { fetchBrands, fetchTypes, fetchProducts } from "../../http/productAPI";
import Pages from "../../components/Pages";

const ChangeProduct = observer(({show, onHide}) => {

    const {product} = useContext(Context)

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
        fetchBrands().then(data => product.setBrands(data))
    }, [])

    useEffect(() => {
        fetchProducts(null, null, false, product.page, product.limit).then(data => {
            product.setProducts(data.rows)
            product.setTotalCount(data.count)
        })
    }, [product.page, product.selectedType, product.selectedBrand])

    return (
        <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="pt-1 pb-1">
          <Modal.Title id="contained-modal-title-vcenter">
            Изменение товаров
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Container>
                <Row>
                    <Col md={12}>
                        <ProductList/>
                        <Pages/>
                    </Col>
                </Row>
            </Container>
        </Modal.Body>
        <Modal.Footer className="pt-1 pb-1">
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    )
})

export default ChangeProduct