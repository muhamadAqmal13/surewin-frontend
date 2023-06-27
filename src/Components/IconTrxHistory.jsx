import { faArrowLeft, faArrowRight, faCheck, faGift, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const IconTrxHistory = ({ type }) => {
    const [style, setStyle] = useState({
        icon: "",
        color: "",
    });
    switch (type) {
        case "buy":
            setStyle({
                icon: faArrowRight,
                color: "text-emerald-500",
            });
            break;
        case "sell":
            setStyle({
                icon: faArrowLeft,
                color: "text-red-500",
            });
            break;
        case "win":
            setStyle({
                icon: faCheck,
                color: "text-emerald-500",
            });
            break;
        case "loss":
            setStyle({
                icon: faTimes,
                color: "text-red-500",
            });
            break;
        case "bonus":
            setStyle({
                icon: faGift,
                color: "text-emerald-500",
            });
            break;
        default:
            setStyle({
                icon: "",
                color: "",
            });
            break;
    }
    return (
        <div className="bg-gray-200 flex justify-center items-center w-10 h-10">
            <FontAwesomeIcon icon={style.icon} size="1x" className={style.color} />
        </div>
    );
};

export default IconTrxHistory;
