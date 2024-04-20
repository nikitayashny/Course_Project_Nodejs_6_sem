import React, { useContext } from "react";
import { Context } from "../index";
import { Card } from "react-bootstrap";
import { observer } from "mobx-react-lite";

const BrandBar = observer( () => {
    const {product} = useContext(Context)
    return (
        <div className="d-flex flex-wrap">
    {product.brands.map(brand =>
        <Card
            style={{cursor: 'pointer'}}
            key={brand.id}
            className="p-3"
            onClick={() => {
                if (product.selectedBrand.id === brand.id)
                    product.setSelectedBrand({})
                else
                    product.setSelectedBrand(brand)
            }}
            border={brand.id === product.selectedBrand.id ? 'danger' : 'light'}
        >
            {brand.name}
        </Card>
    )}
</div>
    )
})

export default BrandBar