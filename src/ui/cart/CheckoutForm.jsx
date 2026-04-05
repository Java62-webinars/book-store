import {useDispatch, useSelector} from "react-redux";
import {useMemo} from "react";

import {setBuyerField} from "../../features/order/orderSlice.js";
import {placeOrderFromCart} from "../../features/order/placeOrderFromCart.js";

function CheckoutForm() {
    const dispatch = useDispatch();

    const buyerName = useSelector((s) => s.order?.draftBuyer?.name ?? "");
    const buyerContact = useSelector((s) => s.order?.draftBuyer?.contact ?? "");

    const orderError = useSelector((s) => s.order?.error ?? null);
    const warning = useSelector((s) => s.order?.warning ?? null);

    const cartSize = useSelector((s) => (s.cart?.cartItems ?? []).length);

    const canPlaceOrder = useMemo(() => {
        const hasCart = cartSize > 0;
        const hasBuyer =
            String(buyerName).trim().length > 0 &&
            String(buyerContact).trim().length > 0;
        return hasCart && hasBuyer;
    }, [cartSize, buyerName, buyerContact]);

    const handlePlaceOrder = () => {
        dispatch(placeOrderFromCart());
    };

    return (
        <section className="pt-4 border-t">
            <h3 className="text-base font-semibold">Buyer</h3>

            <div className="mt-2 space-y-3">
                <label className="block">
                    <div className="text-sm text-gray-700 mb-1">Name</div>
                    <input
                        value={buyerName}
                        onChange={(e) =>
                            dispatch(setBuyerField({field: "name", value: e.target.value}))
                        }
                        className="w-full border rounded px-3 py-2"
                        placeholder="Your name"
                    />
                </label>

                <label className="block">
                    <div className="text-sm text-gray-700 mb-1">Contact</div>
                    <input
                        value={buyerContact}
                        onChange={(e) =>
                            dispatch(
                                setBuyerField({field: "contact", value: e.target.value})
                            )
                        }
                        className="w-full border rounded px-3 py-2"
                        placeholder="Email / phone"
                    />
                </label>
            </div>

            <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
                className="mt-4 w-full bg-blue-900 text-white px-4 py-3 rounded btn-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Place order
            </button>

            {orderError ? (
                <div className="mt-3 text-sm text-red-700">{orderError}</div>
            ) : null}

            {warning ? (
                <div className="mt-2 text-sm text-amber-800">{warning}</div>
            ) : null}
        </section>
    );
}

export default CheckoutForm;