import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux";
import {store} from './store/store.js';
import {attachCartPersistence} from "./features/cart/cartPersistence.js";
import {loadCart} from "./features/cart/loadCart.js";

// 1) Включаем автосохранение корзины
attachCartPersistence(store);

// 2) Загружаем корзину из localStorage в Redux
store.dispatch(loadCart());
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </StrictMode>
)
