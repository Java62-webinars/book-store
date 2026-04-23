import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Burger from "./Burger.jsx";
import FlyingBooks from "./FlyingBooks.jsx";
import {selectCartTotals} from "../features/cart/cartSelectors.js";
import {selectCurrentUser} from "../features/auth/authSelectors.js";
import {logout, setCurrentUser} from "../features/auth/authSlice.js";
import {clearAuthStorage, saveAuthToStorage} from "../features/auth/authStorage.js";

const Header = ({onCartClick}) => {
    const [book, setBook] = useState("");
    const dispatch = useDispatch();

    const {totalBooks} = useSelector(selectCartTotals);
    const currentUser = useSelector(selectCurrentUser);

    const handleBook = (e) => {
        e.preventDefault();
        console.log("Searching for:", book);
        setBook(book);
    };

    const handleLoginAsAdmin = () => {
        const adminUser = {
            id: "demo-admin",
            name: "Admin",
            role: "admin",
        };

        dispatch(setCurrentUser(adminUser));
        saveAuthToStorage(adminUser);
    };

    const handleLoginAsUser = () => {
        const user = {
            id: "demo-user",
            name: "User",
            role: "user",
        };

        dispatch(setCurrentUser(user));
        saveAuthToStorage(user);
    };

    const handleLogout = () => {
        dispatch(logout());
        clearAuthStorage();
    };

    const cartIcon = totalBooks > 0 ? "/full.png" : "/empty.png";

    return (
        <div
            className="text-white p-4
      bg-[url('/bookhaven1.png')] bg-center bg-contain
      bg-no-repeat h-20"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Burger/>

                    <form className="flex items-center gap-2" onSubmit={handleBook}>
                        <input
                            type="text"
                            value={book}
                            onChange={(e) => setBook(e.target.value)}
                            className="border-[2px] border-amber-900 p-2 rounded text-white h-14"
                        />
                        <button
                            className="bg-blue-900 px-5 py-2 rounded text-xl h-14 btn-hover"
                            type="submit"
                        >
                            Find book
                        </button>
                    </form>

                    <FlyingBooks/>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCartClick}
                        className="relative w-14 h-14 rounded overflow-hidden border-[2px] border-amber-900 btn-hover"
                        aria-label="Open cart"
                    >
                        <img src={cartIcon} alt="Cart" className="w-full h-full object-cover"/>

                        {totalBooks > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                                {totalBooks}
                            </span>
                        )}
                    </button>

                    <div className="rounded bg-white text-black px-3 py-2 border-[2px] border-amber-900">
                        {currentUser ? `${currentUser.name} (${currentUser.role})` : "Guest"}
                    </div>

                    <button
                        type="button"
                        onClick={handleLoginAsUser}
                        className="rounded px-3 py-2 bg-white text-black border-[2px] border-amber-900 btn-hover"
                    >
                        User
                    </button>

                    <button
                        type="button"
                        onClick={handleLoginAsAdmin}
                        className="rounded px-3 py-2 bg-white text-black border-[2px] border-amber-900 btn-hover"
                    >
                        Admin
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded px-3 py-2 bg-white text-black border-[2px] border-amber-900 btn-hover"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;