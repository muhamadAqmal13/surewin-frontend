import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, successMessageState, tokenState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const RemoveAuthenticator = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [typePassword, setTypePassword] = useState("password");
    const [loading, setLoading] = useState(false);

    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const handleRemoveAuth = async (e) => {
        e.preventDefault();

        setLoading(true);
        const postRemoveAuth = await sendRequest({
            method: "PUT",
            path: "/api/v1/customer/authenticator",
            auth: true,
            body: {
                id: user.id,
                code,
                password,
            },
        });

        const res = await postRemoveAuth.json();
        if (!postRemoveAuth.ok) {
            setErrorMessage(res.message);
            return;
        }

        setSuccessMessage("Authenticator has been successfully removed");
        navigate("/profile");
        setLoading(false);
    };

    useEffect(() => {
        document.title = "Remove Authenticator";
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HeaderV2 page="Authenticator" />
            <div className="p-4 mt-4 w-full relative">
                <ErrorMessage />
                <SuccessMessage />
                <form onSubmit={handleRemoveAuth}>
                    <div className="flex flex-col mt-5">
                        <label htmlFor="authCode" className="font-medium">
                            Authentication Code
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type="text"
                                placeholder="Enter your authentication code"
                                id="authCode"
                                autoComplete="off"
                                className="w-full mt-2 p-4 rounded-xl shadow-input"
                                onChange={(e) => setCode(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mt-5">
                        <label htmlFor="authCode" className="font-medium">
                            Password
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type={typePassword}
                                placeholder="Enter Your Password"
                                id="authCode"
                                className="w-full mt-2 p-4 rounded-xl shadow-input"
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <input
                            type="checkbox"
                            id={`ShowPassword`}
                            disabled={loading}
                            onChange={(e) => (e.target.checked ? setTypePassword("text") : setTypePassword("password"))}
                        />
                        <label htmlFor={`ShowPassword`} className="ml-1">
                            Show password
                        </label>
                    </div>
                    <button
                        type="submit"
                        className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                            !code || !password || loading ? "bg-slate-400" : "bg-red-500"
                        }`}
                        disabled={!code || !password || loading}
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Remove Authenticator"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default RemoveAuthenticator;
