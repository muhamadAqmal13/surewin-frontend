import React, { useEffect, useRef } from "react";

const ProductNumber = (props) => {
    const ref = useRef(null);

    useEffect(() => {
        const width = ref.current.offsetWidth;
        ref.current.style.height = `${width}px`;
    }, []);

    return (
        <div
            className="cursor-pointer rounded-full flex justify-center items-center basis-1/5 bg-amber-400 font-bold text-md"
            ref={ref}
        >
            {props.title}
        </div>
    );
};

export default ProductNumber;
