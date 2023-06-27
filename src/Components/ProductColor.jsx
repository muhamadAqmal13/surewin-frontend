import React from "react";

const ProductColor = (props) => {
    return (
        <div
            className={`${props.style} w-full h-10 flex justify-center items-center rounded-lg cursor-pointer font-bold text-slate-50`}
        >
            {props.title}
        </div>
    );
};

export default ProductColor;
