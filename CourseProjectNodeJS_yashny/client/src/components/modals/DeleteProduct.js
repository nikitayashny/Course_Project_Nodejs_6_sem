import React, { useContext } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { deleteProduct } from "../../http/productAPI";
import {useNavigate} from 'react-router-dom'
import { SHOP_ROUTE } from "../../utils/consts";

const DeleteProduct = observer(({show, onHide}) => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    
    const delProduct = () => {
        if (user.isAdmin) {
            let urlParts = window.location.href.split("/");
            let productId = parseInt(urlParts[urlParts.length - 1]);
            deleteProduct(productId).then(data => {
                onHide()
                navigate(SHOP_ROUTE)
              })
        }
    }

    return (
        <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Удаление товара
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>Вы уверены, что хотите удалить товар?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={delProduct}>Удалить</Button>
        </Modal.Footer>
      </Modal>
    )
})

export default DeleteProduct