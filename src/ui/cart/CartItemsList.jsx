import {useDispatch, useSelector} from "react-redux";
import {selectCartDetailedItems, selectCartTotalPrice, selectCartTotals,} from "../../features/cart/cartSelectors.js";
import {changeQuantity, removeItem} from "../../features/cart/cartSlice.js";

function CartItemsList() {
    const dispatch = useDispatch();

    const items = useSelector(selectCartDetailedItems);
    const totalPrice = useSelector(selectCartTotalPrice);
    const {uniqueISBN, totalBooks} = useSelector(selectCartTotals);

    const inc = (isbn, currentQty) =>
        dispatch(changeQuantity({isbn, newQuantity: Number(currentQty) + 1}));

    const dec = (isbn, currentQty) =>
        dispatch(
            changeQuantity({isbn, newQuantity: Math.max(0, Number(currentQty) - 1)})
        );

    const remove = (isbn) => dispatch(removeItem(isbn));

    return (
        <section>
            <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">Cart</h2>
                <div className="text-sm text-gray-600">
                    {uniqueISBN} items / {totalBooks} books
                </div>
            </div>

            <div className="mt-3 space-y-3">
                {items.length === 0 ? (
                    <div className="text-gray-600 text-sm">Cart is empty</div>
                ) : (
                    items.map((it) => (
                        <div
                            key={it.isbn}
                            className="border rounded-lg p-3 flex gap-3 items-start"
                        >
                            <div className="flex-1">
                                <div className="font-medium leading-snug">
                                    {it.title || it.isbn}
                                </div>
                                <div className="text-sm text-gray-600">{it.author}</div>
                                <div className="text-sm text-gray-700 mt-1">
                                    ${it.price} × {it.quantity} ={" "}
                                    <span className="font-semibold">${it.lineTotal}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => dec(it.isbn, it.quantity)}
                                        className="px-2 py-1 border rounded hover:bg-gray-100"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <div className="w-8 text-center py-1">{it.quantity}</div>
                                    <button
                                        onClick={() => inc(it.isbn, it.quantity)}
                                        className="px-2 py-1 border rounded hover:bg-gray-100"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => remove(it.isbn)}
                                    className="text-sm text-red-700 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-lg font-semibold">${totalPrice}</div>
            </div>
        </section>
    );
}

export default CartItemsList;