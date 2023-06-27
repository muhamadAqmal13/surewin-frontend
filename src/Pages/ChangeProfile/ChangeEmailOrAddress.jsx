import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../../Components/ErrorMessage";
import HeaderV2 from "../../Components/Header2";
import { errorMessageState, successMessageState, tokenState, userState } from "../../Recoil";
import { sendRequest } from "../../Utils/api";

const ChangeEmailOrAddress = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const token = useRecoilValue(tokenState);

    const [user, setUser] = useRecoilState(userState);
    const setSuccessMsg = useSetRecoilState(successMessageState);
    const setErrMsg = useSetRecoilState(errorMessageState);

    const { type } = useParams();
    const title = type.charAt(0).toUpperCase() + type.slice(1);

    const handleChangeEmailOrAddress = async (e) => {
        e.preventDefault();

        setLoading(true);
        if (input === user[type]) {
            setErrMsg(`The new ${type} cannot be the same as the old one`);
            return;
        }

        const body = {
            id: user.id,
            username: user.username,
            address: user.address,
            email: user.email,
        };

        const response = await sendRequest({
            method: "PUT",
            path: "/api/v1/customer",
            body: {
                ...body,
                [type]: input,
            },
            auth: true,
        });

        const res = await response.json();
        if (!response.ok) {
            setErrMsg(res.message);
            setLoading(false);
            return;
        }
        setSuccessMsg(`Change ${type} successfully`);
        setUser(res);
        localStorage.setItem("user", JSON.stringify(res));
        navigate("/profile");
        setLoading(false);
    };

    useEffect(() => {
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HeaderV2 page={`Change ${title}`}></HeaderV2>
            <div className="p-4 w-full pb-20 h-fit relative">
                <ErrorMessage />
                <form onSubmit={handleChangeEmailOrAddress}>
                    <div className="flex flex-col mt-4">
                        <label htmlFor={type} className="font-medium">
                            New {title}
                        </label>
                        <input
                            type="text"
                            placeholder={`Enter a new ${title}`}
                            id={type}
                            className={`w-full mt-2 p-4 rounded-xl shadow-input ${loading && "bg-slate-100"}`}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                            !input || loading ? "bg-slate-400" : "bg-emerald-400"
                        }`}
                        disabled={!input || loading}
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : `Change your ${type}`}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChangeEmailOrAddress;
