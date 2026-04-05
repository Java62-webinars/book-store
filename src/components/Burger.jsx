import {useState} from "react";

const Burger = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                className={`burger ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span/>
                <span/>
                <span/>
            </button>

            <nav className={`menu ${isOpen ? 'show' : ''} `}>
                <a href='#'> Home </a>
                <a href='#'> About </a>
                <a href='#'> Contacts </a>
            </nav>
        </div>

    )
}

export default Burger;