import React from "react";
import Lottie from "lottie-react"
import Books from "../assets/Books.json"

const FlyingBooks = () => {
    return (
        <div className="w-15 h-15  pointer-events-none">
            <Lottie animationData={Books} loop={true} autoplay={true}/>
        </div>
    )
}

export default FlyingBooks;