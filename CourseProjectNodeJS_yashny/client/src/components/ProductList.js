import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../index";
import { Row } from "react-bootstrap";
import ProductItem from "./ProductItem";

const ProductList = observer(() => {
    const {product} = useContext(Context)

    const getBrandNameByProductId = (brandId) => {
        const brand = product.brands.find(brand => brand.id === brandId);
        return brand.name;
    }

    return (
        <Row className="d-flex">
            {product.products.map(product =>
                <ProductItem key={product.id} product={product} brand={getBrandNameByProductId(product.brandId)}/>
            )}
        </Row>
    )
})

export default ProductList

