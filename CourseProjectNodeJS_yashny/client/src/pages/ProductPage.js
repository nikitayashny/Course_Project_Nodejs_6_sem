import React, { useEffect, useState, useContext } from "react";
import { Context } from "../index";
import { Col, Container, Image, Row, Card, Button, Dropdown } from "react-bootstrap";
import star from '../assets/star.png'
import { useParams} from 'react-router-dom'
import { createRate, fetchOneProduct, addToBasket, getBasket, deleteFromBasket, getReviews, deleteReview } from "../http/productAPI";
import DeleteProduct from "../components/modals/DeleteProduct";
import UpdateProduct from "../components/modals/UpdateProduct";
import CreateReview from "../components/modals/createReview";
import { observer } from "mobx-react-lite";
import { check } from "../http/userAPI";

const ProductPage = observer(() => {
    const [product, setProduct] = useState({info: []})
    const {id} = useParams()
    const {user} = useContext(Context)
    const [products, setProducts] = useState([])
    const [reviews, setReviews] = useState([])

    const [deleteProductVisible, setDeleteProductVisible] = useState(false)
    const [updateProductVisible, setUpdateProductVisible] = useState(false)
    const [createReviewVisible, setCreateReviewVisible] = useState(false)

    useEffect(() => {
        fetchOneProduct(id).then(data => setProduct(data))
        getReviews(id).then(data => setReviews(data))
    }, [])

    useEffect(() => {
        if (user.userId) {
            getBasket(user.userId).then(data => 
                setProducts(data))
        }
      }, [])

    const makeRate = async (rate) => {
        try {
            if (!user.userId) {
                alert("Вы не авторизованы")
                return
            }
            let token = await check()
            let rateObj = {
            number: rate,
            userId: token.id,
            productId: product.id
            }
        createRate(rateObj)
        } catch(e) {
            alert('Вы не зарегистрированы')
        }
        
    }

    const addToBask = async () => {
        try {
            if (!user.userId) {
                alert("Вы не авторизованы")
                return
            }
            let params = {
                userId: user.userId,
                productId: product.id
            }
            await addToBasket(params)     
            await getBasket(user.userId).then(data => setProducts(data))
            alert("Товар добавлен в корзину")
        } catch(e) {
            alert(e)
        }
    }

    const delFromBasket = async () => {
        try {
            if (!user.userId) {
                alert("Вы не авторизованы")
                return
            }
            await deleteFromBasket(user.userId, product.id)    
            await getBasket(user.userId).then(data => setProducts(data)) 
            alert("Товар удалён из корзины")
        } catch(e) {
            alert(e)
        }
    }

    const postReview = () => {
        try {
            if (!user.userId) {
                alert("Вы не авторизованы")
                return
            }
            setCreateReviewVisible(true)
        } catch(e) {
            alert(e)
        }
    }

    const removeReview = async (reviewId) => {
        try {
            if (!user.userId) {
                alert("Вы не авторизованы")
                return
            }
            await deleteReview(reviewId, user.userId)
            getReviews(id).then(data => setReviews(data))
        } catch(e) {
            alert(e)
        }
    }

  return (
    <Container className="mt-3">
        
        {user.isAdmin ? (
        <>
            <Button variant="outline-dark" className="m-3" onClick={() => setUpdateProductVisible(true)}>Изменить</Button>
            <Button variant="outline-danger" onClick={() => setDeleteProductVisible(true)}>Удалить</Button>
            <DeleteProduct show={deleteProductVisible} onHide={() => setDeleteProductVisible(false)}/>
            <UpdateProduct Product={product} show={updateProductVisible} onHide={() => {
                fetchOneProduct(id).then(data => setProduct(data))
                setUpdateProductVisible(false)}
                }/>
        </>
        ) : null}
        <CreateReview User={user} Product={product} show={createReviewVisible} onHide={() => {
            getReviews(id).then(data => setReviews(data))
            setCreateReviewVisible(false)
        }}/>
        <Row>
        <Col md={4}>
            <Image width={300} height={300} src={process.env.REACT_APP_API_URL + product.img} />
        </Col>
        <Col md={4}>
            <div className="d-flex flex-column align-items-center">
                <h2>{product.name}</h2>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{background: `url(${star}) no-repeat center center`, width: 200, height: 200, backgroundSize: 'cover', fontSize:64}}
                  >
                  {product.rating}
                </div>
                <Dropdown className="mt-2 mb-2">
                    <Dropdown.Toggle>Оценить</Dropdown.Toggle>
                        <Dropdown.Menu> 
                            {[1, 2, 3, 4, 5].map(rate => ( 
                            <Dropdown.Item onClick={() => makeRate(rate)} 
                                key={rate} > 
                                {rate} 
                            </Dropdown.Item> ))} 
                        </Dropdown.Menu>
                </Dropdown>
            </div>
            
        </Col>
        <Col md={4}>
            <Card
                className="d-flex flex-column align-items-center justify-content-around"
                style={{width: 300, height: 300, fontSize: 32, border: '5px solid lightgray'}}
            >
                <h3>Цена: {product.price}$</h3>

                {product.isSold 
                ? 
                <div>Товар продан</div> 
                :
                <>
                {products.some(element => element.id === product.id) ? 
                    <Button variant="outline-dark" onClick={() => delFromBasket()}>Удалить из корзины</Button> 
                    : 
                    <Button variant="outline-dark" onClick={() => addToBask()}>Добавить в корзину</Button>
                }   
                </>
                }
            </Card>
        </Col>
        </Row>   
        <Row className="d-flex flex-column m-1 mt-3">
            <h1>Характеристики</h1>
            {product.info.map((info, index) => 
                <Row key={info.id} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>
                    {info.title}: {info.description}
                </Row>  
            )}
        </Row>
        <Row className="d-flex flex-column m-1 mt-3">
            <div className="d-flex">
                <h1>Отзывы</h1>
                <Button variant="outline-success" 
                        style={{width: 150, height: 30, marginLeft: 20, marginTop: 15}} 
                        className="pt-0"
                        onClick={postReview}>
                            Оставить отзыв</Button>
            </div>
            
            {reviews.map((i) => 
                <Card key={i} 
                      className="mt-2 p-3">
                    <Card.Title>{i.user.email.slice(0, -10)}</Card.Title>
                    <div className="d-flex justify-content-between">
                        {i.text}
                        {user.isAdmin
                            ?
                            <Button variant="outline-danger" onClick={() => removeReview(i.id)}>Удалить</Button>
                            :
                            i.userId === user.userId 
                            ?
                            <Button variant="outline-danger" onClick={() => removeReview(i.id)}>Удалить</Button> 
                            :
                            <></>
                        }
                        
                    </div>
                    
                </Card>  
            )}
        </Row>
    </Container>
  )
})

export default ProductPage;