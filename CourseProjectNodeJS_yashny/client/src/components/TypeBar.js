import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../index";
import { ListGroup } from "react-bootstrap";

const TypeBar = observer(() => {
    const {product} = useContext(Context)
    return (
        <ListGroup>
            {product.types.map(type => 
                <ListGroup.Item 
                    style={{cursor: 'pointer'}}
                    active={type.id === product.selectedType.id}
                    onClick={() => {
                        if (product.selectedType.id === type.id)
                            product.setSelectedType({})
                        else
                            product.setSelectedType(type)
                    }}
                    key={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    )
})

export default TypeBar