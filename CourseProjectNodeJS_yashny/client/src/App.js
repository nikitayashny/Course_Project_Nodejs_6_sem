import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI"
import { Spinner } from "react-bootstrap";
import socket from "./socket";

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        socket.addEventListener('message', (event) => {
          const message = event.data;
          alert(message);
        });

        return () => {
          socket.removeEventListener('message', (event) => {
            const message = event.data;
            alert(message);
          });
        };
    }, []);

    useEffect(() => {
        check().then(data => {
            if (data) {
                user.setUser(true)
                user.setIsAuth(true)
                if (data.role === 'ADMIN') 
                    user.setIsAdmin(true)
                user.setUserId(data.id)
            }
            
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Spinner animation={"grow"} />
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    )
})

export default App;
