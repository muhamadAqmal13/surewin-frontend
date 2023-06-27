import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBell } from "@fortawesome/free-solid-svg-icons";

const Header = (props) => {
    return (
        <header className="flex items-center justify-between py-4 px-8 bg-slate-50 text-slate-900 shadow-md box-border h-20">
            <h1 className="text-xl font-extrabold font-poppins">
                {props.page === "Dashboard" && (
                    <span className="block font-medium text-sm text-slate-900">Hi, {props.username}</span>
                )}
                {props.page}
            </h1>
            {/* <button className="focus:outline-none">
                <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
            </button> */}
        </header>
    );
};

export default Header;
