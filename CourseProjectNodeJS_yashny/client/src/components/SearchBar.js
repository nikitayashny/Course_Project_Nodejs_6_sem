import { observer } from "mobx-react-lite";
import React, { useContext,  useState} from "react";
import { Context } from "../index";
import { Form, Row, Col, Button } from "react-bootstrap";
import { fetchProducts } from "../http/productAPI";

const SearchBar = observer(() => {
    const { product } = useContext(Context);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery === "") {
            fetchProducts(product.selectedType.id, product.selectedBrand.id, false, product.page, product.limit).then(data => {
                product.setProducts(data.rows)
                product.setTotalCount(data.count)
              })    
              return; 
        }
        fetchProducts(product.selectedType.id, product.selectedBrand.id, false, product.page, 10000 ).then(data => {
            product.setProducts(data.rows.filter(row =>
                row.name.toLowerCase().includes(searchQuery.toLowerCase())
            ));
             product.setTotalCount(product.length)
          })     
    };

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <Form>
            <Row className="mt-2">
                <Col md={3} xs={9}>
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleChange}
                    />
                </Col>
                <Col xs={3}>
                    <Button onClick={handleSearch}>Search</Button>
                </Col>
            </Row>
        </Form>
    );
})

export default SearchBar