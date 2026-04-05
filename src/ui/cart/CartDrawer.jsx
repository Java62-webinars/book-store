import CartWidget from "./CartWidget.jsx";

function CartDrawer({isOpen, onClose}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose}/>

            {/* Panel */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-semibold">Your cart</div>
                    <button
                        onClick={onClose}
                        className="px-3 py-2 border rounded hover:bg-gray-100"
                        aria-label="Close cart"
                    >
                        ✕
                    </button>
                </div>

                <CartWidget/>
            </div>
        </div>
    );
}

export default CartDrawer;