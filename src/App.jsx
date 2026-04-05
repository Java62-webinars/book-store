import {useState} from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CatalogScreen from "./ui/catalog/CatalogScreen.jsx";
import CartWidget from "./ui/cart/CartWidget.jsx";

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const toggleCart = () => setIsCartOpen((v) => !v);

    return (
        <div className="min-h-screen flex flex-col m-0 p-0">
            <Header onCartClick={toggleCart}/>

            <main className="flex-1 bg-gray-100 py-4 px-8">
                <CatalogScreen/>
            </main>

            <Footer/>

            {/* Cart overlay (drawer/modal) */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 z-50"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop: клик по затемнению закрывает */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeCart}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 overflow-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-lg font-semibold">Your cart</div>
                            <button
                                onClick={closeCart}
                                className="px-3 py-2 border rounded hover:bg-gray-100"
                                aria-label="Close cart"
                            >
                                ✕
                            </button>
                        </div>

                        <CartWidget/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;