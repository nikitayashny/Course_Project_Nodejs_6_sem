import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../index";
import { Row, Col, Container } from "react-bootstrap";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
    const {product} = useContext(Context)

    const getBrandNameByProductId = (brandId) => {
        const brand = product.brands.find(brand => brand.id === brandId);
        return brand.name;
    }

    return (
            <Row className="d-flex container vh-90">
    {product.products.map(product =>
        <Col key={product.id} xs={12} sm={6} md={4} lg={3} >
            <ProductItem product={product} brand={getBrandNameByProductId(product.brandId)} />
        </Col>
    )}
</Row>
        
    )
})

export default ProductList

