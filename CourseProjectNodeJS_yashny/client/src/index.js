import { createContext } from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import UserStore from './store/UserStore';
import ProductStore from './store/ProductStore';

export const Context = createContext(null)

createRoot(document.getElementById('root')).render(
    <Context.Provider value={{
        user: new UserStore(),
        product: new ProductStore()
    }}>
         <App />
    </Context.Provider>
)