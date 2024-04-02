import React, { useContext } from "react";
import { Context } from "../index";
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import Button from "react-bootstrap/Button";
import { observer } from "mobx-react-lite";
import {useNavigate} from 'react-router-dom'

const NavBar = observer( () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({})
        user.setIsAuth(false)
        user.setIsAdmin(false)
    }

    const toAdmin = () => {
        if (user.isAdmin === true) {
            navigate(ADMIN_ROUTE)
        } else {
            alert('Нет доступа')
        }
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <NavLink style={{color: 'white'}} to={SHOP_ROUTE}>Perlee</NavLink>  
                {user.isAuth ?
                    <Nav className="ml-auto" style={{color: 'white'}}>
                        {user.isAdmin ?
                        <Button variant={"outline-light"} onClick={() => toAdmin()}>Админ панель</Button>
                        : null
                        }
                        <Button variant={"outline-light"} onClick={() => logOut()} style={{margin: '0 0 0 5px'}}>Выйти</Button>
                    </Nav>
                    :
                    <Nav className="ml-auto" style={{color: 'white'}}>
                        <Button variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
                    </Nav>
                }
            </Container>
            
        </Navbar>
    )
})

export default NavBar