import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createBrand } from "../../http/productAPI";

const CreateBrand = ({show, onHide}) => {

    const [value, setValue] = useState('')
    
    const addBrand = () => {
      try {
        createBrand({name: value}).then(data => {
          if (data.status == 404)
            alert("Такой бренд уже существует")
          console.log(data)
          setValue('')
          onHide()
        })
      } catch (e) {
        alert(e)
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
            Добавить бренд
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Control 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={"Введите название категории"}
                />
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={addBrand}>Добавить</Button>
        </Modal.Footer>
      </Modal>
    )
}

export default CreateBrand