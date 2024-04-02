import { observer } from "mobx-react-lite";
import React, { useContext,  useState} from "react";
import { Context } from "../index";
import { Form, Row, Col, Button } from "react-bootstrap";
import { fetchProducts } from "../http/productAPI";

const SearchBar = observer(() => {
    const { product } = useContext(Context);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        fetchProducts(product.selectedType.id, product.selectedBrand.id, product.page, product.limit).then(data => {
            product.setProducts(data.rows)
            product.setTotalCount(data.count)
            product.setProducts(product.products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ));
          })     
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Form>
            <Row className="mt-2">
                <Col md={3}>
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleChange}
                    />
                </Col>
                <Col>
                    <Button onClick={handleSearch}>Search</Button>
                </Col>
            </Row>
        </Form>
    );
})

export default SearchBar