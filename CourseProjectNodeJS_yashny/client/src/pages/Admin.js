import React, {useState} from "react";
import { Button, Container } from "react-bootstrap";
import CreateBrand from "../components/modals/CreateBrand";
import CreateProduct from "../components/modals/CreateProduct";
import CreateType from "../components/modals/CreateType";
import ChangeProduct from "../components/modals/ChangeProduct";

const Admin = () => {  

  const [brandVisible, setBrandVisible] = useState(false)
  const [typeVisible, setTypeVisible] = useState(false)
  const [productVisible, setProductVisible] = useState(false)
  const [changeProductVisible, setChangeProductVisible] = useState(false)

  return (
    <Container className="d-flex flex-column">
      <Button 
        variant={"outline-dark"} className="mt-4 p-2" onClick={() => setTypeVisible(true)}>
        Добавить категорию
      </Button>
      <Button 
        variant={"outline-dark"} className="mt-4 p-2" onClick={() => setBrandVisible(true)}>
        Добавить бренд
      </Button>
      <Button 
        variant={"outline-dark"} className="mt-4 p-2" onClick={() => setProductVisible(true)}>
        Добавить товар
      </Button>
      <Button 
        variant={"outline-dark"} className="mt-4 p-2" onClick={() => setChangeProductVisible(true)}>
        Изменение товаров
      </Button>
      <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
      <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
      <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
      <ChangeProduct show={changeProductVisible} onHide={() => setChangeProductVisible(false)}/>
    </Container>
  )
}

export default Admin;