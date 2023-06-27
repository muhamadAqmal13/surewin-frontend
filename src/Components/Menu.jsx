import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faGamepad, faUser, faWallet } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useLocation } from "react-router-dom";

const MENU_ITEMS = [
    { title: "Dashboard", icon: faChartBar, link: "/" },
    { title: "Game", icon: faGamepad, link: "/game" },
    { title: "Balance", icon: faWallet, link: "/balance" },
    { title: "Profile", icon: faUser, link: "/profile" },
];

const MenuBar = () => {
    const location = useLocation();

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 bg-slate-50 flex justify-around max-w-screen-sm mx-auto font-poppins`}
            style={{
                boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.25)",
            }}
        >
            {MENU_ITEMS.map((item) => (
                <NavLink
                    to={item.link}
                    key={item.title}
                    className={`flex flex-col items-center justify-center py-2 hover:text-emerald-400 focus:text-emerald-400 focus:outline-none ${
                        location.pathname === item.link ? "text-emerald-400" : "text-gray-500"
                    }`}
                >
                    <div className="h-1 w-full"></div>
                    <FontAwesomeIcon icon={item.icon} size="lg" />
                    <span className="text-sm">{item.title}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default MenuBar;
