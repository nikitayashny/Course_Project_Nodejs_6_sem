import React, {  useEffect, useState, useContext } from "react";
import {Container, Dropdown, Card, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { observer } from "mobx-react-lite";
import { getAllOrders, changeStatus } from "../../http/productAPI";
import ProductItem from "../../components/ProductItem";
import { Context } from "../../index";

const ManageOrders = observer(({show, onHide}) => {
  const [orders, setOrders] = useState([])
  const {product} = useContext(Context)

  useEffect(() => {
    getAllOrders().then(data => 
      setOrders(data))
  }, [])

  const getBrandNameByProductId = (brandId) => {
    const brand =  product.brands.find(brand => brand.id === brandId);
    return brand.name;
}

  const setStatus = async(orderId, status) => {
    let statusId
    switch (status){
      case "В обработке": statusId = 1 
        break
      case "Подтверждено": statusId = 2
        break
      case "Выполнено": statusId = 3
        break
    }
    let params = {
      orderId: orderId,
      orderStatusId: statusId
    }
  
    await changeStatus(params)
    await getAllOrders().then(data => 
      setOrders(data))
  } 

    
    return (
        <Modal
        show={show}
        onHide={onHide}
        size={"xl"}
        centered
      >
        <Modal.Header closeButton className="pt-1 pb-1">
          <Modal.Title id="contained-modal-title-vcenter">
            Управление заказами
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Container className="col-12">
            
            {orders.map(order => 
            <>
              <div className=" d-flex flex-wrap">
              <Row className="mt-3 col-10">
            
                  <Card style={{width: 950}} border={"dark"}>
                      <div className="m-3">
                          <div style={{width: 50, display: "inline-block"}}>id: {order.id}</div>
                          <div style={{width: 200, display: "inline-block"}}>{order.total_cost}$</div>
                          <div style={{width: 200, display: "inline-block"}}>{order.status}</div>
                          <div style={{width: 200, display: "inline-block"}}>{order.date.substring(0, 10)}</div>
                          <div style={{width: 300, display: "inline"}}>{order.user.email}</div>
                      </div>
                  
                  </Card>
                  <Row className="d-flex mb-3" >           
                        {order.products.map(product =>
                            <ProductItem key={product.id} product={product} brand={getBrandNameByProductId(product.brandId)}/>
                        )}
                  </Row>
              </Row>

                <Dropdown className="m-4 mb-0" >
                    <Dropdown.Toggle>{order.status}</Dropdown.Toggle>
                        <Dropdown.Menu> 
                            {["В обработке", "Подтверждено", "Выполнено"].map(status => ( 
                            <Dropdown.Item onClick={() => {setStatus(order.id, status)}} 
                                key={status} > 
                                {status} 
                            </Dropdown.Item> ))} 
                        </Dropdown.Menu>
                </Dropdown>
              </div>
            </>        
            )}
        </Container>
        </Modal.Body>
        <Modal.Footer className="pt-1 pb-1">
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    )
})

export default ManageOrders