import React, { useEffect, useRef } from "react";

const ProductShape = (props) => {
    const ref = useRef(null);

    useEffect(() => {
        const width = ref.current.offsetWidth;
        ref.current.style.height = `${width}px`;
    }, []);

    return (
        <div
            className={`${props.style} font-bold text-slate-50 bg-blue-600 w-1/4 flex justify-center items-center cursor-pointer`}
            ref={ref}
        >
            {props.title}
        </div>
    );
};

export default ProductShape;
