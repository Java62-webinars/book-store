import {useState} from "react";
import {useSelector} from "react-redux";

import Burger from "./Burger.jsx";
import FlyingBooks from "./FlyingBooks.jsx";
import {selectCartTotals} from "../features/cart/cartSelectors.js";

const Header = ({onCartClick}) => {
    const [book, setBook] = useState("");

    const {totalBooks} = useSelector(selectCartTotals);

    const handleBook = (e) => {
        e.preventDefault();
        console.log("Searching for:", book);
        setBook(book);
    };

    const cartIcon = totalBooks > 0 ? "/full.png" : "/empty.png";

    return (
        <div
            className="text-white p-4
      bg-[url('/bookhaven1.png')] bg-center bg-contain
      bg-no-repeat h-20"
        >
            {/* ОБЩИЙ FLEX-КОНТЕЙНЕР */}
            <div className="flex items-center justify-between">
                {/* 🟢 ЛЕВАЯ ЧАСТЬ */}
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

                {/* 🔵 ПРАВАЯ ЧАСТЬ */}
                <div className="flex items-center gap-2">
                    {/* Cart button */}
                    <button
                        type="button"
                        onClick={onCartClick}
                        className="relative w-14 h-14 rounded overflow-hidden border-[2px] border-amber-900 btn-hover"
                        aria-label="Open cart"
                    >
                        <img src={cartIcon} alt="Cart" className="w-full h-full object-cover"/>

                        {/* badge */}
                        {totalBooks > 0 && (
                            <span
                                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {totalBooks}
              </span>
                        )}
                    </button>

                    <button className="rounded w-14 h-14 bg-white text-black border-[2px] border-amber-900 btn-hover">
                        Favorite
                    </button>
                    <button className="rounded w-14 h-14 bg-white text-black border-[2px] border-amber-900 btn-hover">
                        Log in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;