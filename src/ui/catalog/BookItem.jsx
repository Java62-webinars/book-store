import {useDispatch} from "react-redux";
import {useState} from "react";

import {addItemToCart} from "../../features/cart/addItemToCart.js";
import {toggleBookAvailability} from "../../features/catalog/thunks/toggleBookAvailability.js";

import BookItemEdit from "./BookItemEdit.jsx";

function BookItem({book}) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);

    const handleAddToCart = () => {
        dispatch(addItemToCart(book.isbn));
    };

    const handleToggleSale = () => {
        dispatch(toggleBookAvailability(book.isbn));
    };

    if (isEditing) {
        return <BookItemEdit book={book} stopShowCompnent={() => setIsEditing(false)}/>;
    }

    return (
        <div className="card">
            <p className="text-center px-3">{book.title}</p>

            <div className="mt-2 text-sm text-gray-700">
                <div>{book.author}</div>
                <div className="font-semibold">${book.price}</div>
            </div>

            <div className="mt-4 flex gap-2">
                {/* Add to cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={book.flagOutOfStock}
                    className="bg-emerald-700 text-white px-3 py-2 rounded btn-hover text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add to cart
                </button>

                {/* Take off sale / Return to sale */}
                <button
                    onClick={handleToggleSale}
                    className="bg-blue-900 text-white px-3 py-2 rounded btn-hover text-sm"
                >
                    {book.flagOutOfStock ? "Return to sale" : "Take off sale"}
                </button>

                {/* Edit */}
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-black border-2 border-amber-900 px-3 py-2 rounded btn-hover text-sm"
                >
                    Edit
                </button>
            </div>

            {/* Overlay from design CSS */}
            <div className="card-overlay">
                <div>
                    <div>
                        <b>ISBN:</b> {book.isbn}
                    </div>
                    <div>
                        <b>Out of sale:</b> {String(book.flagOutOfStock)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookItem;