import React from "react";

const ButtonSubmit = ({ props }) => {
    return (
        <button type="submit" className="w-full bg-emerald-400 mt-8 p-3 text-slate-50 font-semibold rounded-xl">
            {props.title}
        </button>
    );
};

export default ButtonSubmit;
