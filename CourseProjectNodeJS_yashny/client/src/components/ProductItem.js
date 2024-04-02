import { Card, Col, Image } from "react-bootstrap";
import star from '../assets/star.png'
import {useNavigate} from 'react-router-dom'
import { PRODUCT_ROUTE } from "../utils/consts";


const ProductItem = ({product, brand}) => {
    const navigate = useNavigate()
    
    return (
        <Col md={3} className="mt-3" onClick={() => navigate(PRODUCT_ROUTE + '/' + product.id)}>
            
            <Card style={{width: 150, cursor: 'pointer'}} border={"light"}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + product.img} />
                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div>{brand}</div>
                    <div className="d-flex align-items-center">
                        <div>{product.rating}</div>
                        <Image style={{margin: '2px 0 0 2px'}} width={15} height={15} src={star}/>
                    </div>

                </div>
                <div>{product.name}</div>
            </Card>
           
        </Col>
    )
}

export default ProductItem