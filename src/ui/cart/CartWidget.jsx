import CartItemsList from "./CartItemsList.jsx";
import CheckoutForm from "./CheckoutForm.jsx";
import LastOrderPanel from "./LastOrderPanel.jsx";

function CartWidget() {
    return (
        <div className="space-y-5">
            <CartItemsList/>
            <CheckoutForm/>
            <LastOrderPanel/>
        </div>
    );
}

export default CartWidget;