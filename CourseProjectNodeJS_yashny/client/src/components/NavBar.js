import React, { useContext } from "react";
import { Context } from "../index";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE, BASKET_ROUTE, LOGIN_ROUTE, ORDER_ROUTE, SHOP_ROUTE, ABOUTUS_ROUTE } from "../utils/consts";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import {useNavigate} from 'react-router-dom'
import { check } from "../http/userAPI";

const NavBar = observer( () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({})
        user.setIsAuth(false)
        user.setIsAdmin(false)
        user.setUserId(null)
    }

    const toAdmin = () => {
        if (user.isAdmin === true) {
            navigate(ADMIN_ROUTE)
        } else {
            alert('Нет доступа')
        }
    }

    const toBasket = async () => {
        navigate(BASKET_ROUTE)
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="md">
    <Container>
        <NavLink style={{color: 'white'}} to={SHOP_ROUTE}>Perlee</NavLink>  
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            {user.isAuth ?
                <Nav style={{color: 'white'}}>
                    <Button variant="outline-light" onClick={() => navigate(ABOUTUS_ROUTE)}>О нас</Button>
                    {user.isAdmin &&
                        <Button variant="outline-light" onClick={() => toAdmin()} className="mr-2">Админ панель</Button>
                    }
                    <Button variant="outline-light" onClick={() => navigate(ORDER_ROUTE)} className="mr-2">Заказы</Button>
                    <Button variant="outline-light" onClick={() => toBasket()} className="mr-2">Корзина</Button>
                    <Button variant="outline-light" onClick={() => logOut()} className="mr-2">Выйти</Button>
                </Nav>
                :
                <Nav style={{color: 'white'}}>
                    <Button variant="outline-light" onClick={() => navigate(ABOUTUS_ROUTE)}>О нас</Button>
                    <Button variant="outline-light" onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
                </Nav>
            }
        </Navbar.Collapse>
    </Container>
</Navbar>
    )
})

export default NavBar