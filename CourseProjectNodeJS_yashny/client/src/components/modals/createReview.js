import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createReview } from "../../http/productAPI";

const CreateReview = ({User, Product, show, onHide}) => {

    const [value, setValue] = useState('')
    
    const addReview = () => {
        createReview({text: value, userId: User.userId, productId: Product.id}).then(data => {
          setValue('')
          onHide()
        })
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
            Добавление отзыва
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Введите отзыв"}
                />
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={addReview}>Добавить</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default CreateReview