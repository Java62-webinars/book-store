import {useState} from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CatalogScreen from "./ui/catalog/CatalogScreen.jsx";
import CartDrawer from "./ui/cart/CartDrawer.jsx";

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen((v) => !v);

    return (
        <div className="min-h-screen flex flex-col m-0 p-0">
            <Header onCartClick={toggleCart}/>

            <main className="flex-1 bg-gray-100 py-4 px-8">
                <CatalogScreen/>
            </main>

            <Footer/>

            <CartDrawer isOpen={isCartOpen} onClose={closeCart}/>
        </div>
    );
}

export default App;