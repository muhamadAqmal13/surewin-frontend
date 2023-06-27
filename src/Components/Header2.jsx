import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const HeaderV2 = (props) => {
    const [nextPage, setNextPage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (props.page === "Login" || props.page === "Register" || props.page === "Activate Authenticator") {
            setNextPage("/");
        } else {
            setNextPage(-1);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <header className="flex items-center justify-between py-4 px-8 bg-slate-50 text-slate-900 shadow-md box-border h-20">
            <button className="cursor-pointer place-self-center" onClick={() => navigate(nextPage)}>
                <FontAwesomeIcon icon={faArrowLeft} className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-extrabold flex-1 text-center">{props.page}</h1>
        </header>
    );
};

export default HeaderV2;
