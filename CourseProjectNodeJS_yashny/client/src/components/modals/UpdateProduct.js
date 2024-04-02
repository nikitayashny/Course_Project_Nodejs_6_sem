import React, { useContext, useState, useEffect } from "react";
import { Dropdown, Form, Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Context } from "../../index";
import { fetchBrands, fetchTypes, updateProduct } from "../../http/productAPI";
import { observer } from "mobx-react-lite";

const UpdateProduct = observer(({Product, show, onHide}) => {

    const {product} = useContext(Context)
    const [info, setInfo] = useState([])
   
    const [name, setName] = useState(null)
    const [file, setFile] = useState(null)
    const [price, setPrice] = useState()

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data))
        fetchBrands().then(data => product.setBrands(data))      
      }, [])

    useEffect(() => {
        setInfo(Product.info);
    }, [Product]);

    const addInfo = () => {
        setInfo([...info, {title: '', description: '', number: Date.now()}])
    }
    const removeInfo = (title) => {
        setInfo(info.filter(i => i.title !== title))
    }

    const selectFile = e => {
        setFile(e.target.files[0])
    }

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }

    const update = () => {
        const formData = new FormData()
        formData.append('name', name || Product.name)
        formData.append('price', price ? `${price}` : `${Product.price}`)
        formData.append('img', file)
        formData.append('brandId', product.selectedBrand.id || Product.brandId)
        formData.append('typeId', product.selectedType.id || Product.typeId)
        formData.append('info', JSON.stringify(info))
        let urlParts = window.location.href.split("/");
        let productId = parseInt(urlParts[urlParts.length - 1]);
        updateProduct(productId, formData).then(data => onHide())
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
            Изменение товара
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>{product.selectedType.name || 'Выберите категорию'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {product.types.map(type => 
                            <Dropdown.Item 
                                onClick={() => product.setSelectedType(type)} 
                                key={type.id}
                                >
                                {type.name}
                            </Dropdown.Item>    
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>{product.selectedBrand.name || 'Выберите бренд'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {product.brands.map(brand => 
                            <Dropdown.Item 
                                onClick={() => product.setSelectedBrand(brand)} 
                                key={brand.id}
                                >
                                {brand.name}
                            </Dropdown.Item>    
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                <Form.Control 
                    className="mt-3"
                    onChange={e => setName(e.target.value)}
                    value={name}
                    placeholder="Введите название товара"
                />
                <Form.Control 
                    className="mt-3"
                    onChange={e => setPrice(Number(e.target.value))}
                    value={price}
                    placeholder="Введите стоимость товара"
                    type="number"
                />
                <Form.Control 
                    className="mt-3"
                    type="file"
                    onChange={selectFile}
                />
                <hr />
                <Button
                    variant="outline-dark"
                    onClick={addInfo}
                >
                    Добавить новую характеристику
                </Button>
                {info.map(i => 
                    <Row className="mt-2" key={i.number}>
                        <Col md={4}>
                            <Form.Control 
                                value={i.title}
                                onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                placeholder="Введите название"
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control 
                                value={i.description}
                                onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                placeholder="Введите описание"
                            />
                        </Col>
                        <Col md={4}>
                            <Button 
                                variant="outline-danger"
                                onClick={() => removeInfo(i.title)}
                            >
                                Удалить
                            </Button>
                        </Col>
                    </Row>
                )}
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
          <Button variant="outline-success" onClick={update}>Изменить</Button>
        </Modal.Footer>
      </Modal>
    )
})

export default UpdateProduct