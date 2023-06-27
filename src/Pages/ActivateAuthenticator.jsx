import { faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import Loading from "../Components/Loading";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, successMessageState, tokenState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const ActivateAuthenticator = () => {
    const navigate = useNavigate();
    const [linkAuthenticator, setLinkAuthenticator] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [loadingPage, setLoadingPage] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const handleActivateAuthenticator = async (e) => {
        e.preventDefault();

        setLoading(true);
        const postActivateAuthenticator = await sendRequest({
            method: "POST",
            path: "/api/v1/customer/authenticator",
            body: {
                id: user.id,
                code: authCode,
            },
            auth: true,
        });

        const res = await postActivateAuthenticator.json();
        if (!postActivateAuthenticator.ok) {
            setErrorMessage(res.message);
            setLoading(false);
            return;
        }

        navigate("/profile");
        setSuccessMessage("Authenticator has been successfully activated");
        setLoading(false);
    };

    useEffect(() => {
        document.title = "Activate authenticator";
        const getLinkAuth = async () => {
            setLoadingPage(true);
            const response = await sendRequest({
                method: "GET",
                path: "/api/v1/customer/authenticator/" + user.id,
                auth: true,
            });

            const res = await response.json();
            if (!response.ok) {
                setErrorMessage(res.message);
                setLoadingPage(false);
                return;
            }
            setLinkAuthenticator(res.link);
            setLoadingPage(false);
        };

        if (user && user.authentication) {
            navigate("/");
        } else if (!token.refreshToken) {
            navigate("/login");
        } else {
            getLinkAuth();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <HeaderV2 page="Authenticator" />
            <div className="p-4 w-full pb-16 relative">
                <ErrorMessage />
                <SuccessMessage />
                {loadingPage ? (
                    <Loading />
                ) : (
                    <>
                        <h1 className="font-semibold text-lg text-center mt-6">Two Factor Step</h1>
                        <div className="flex justify-center mt-5">
                            <img src={linkAuthenticator} alt="Qr code authenticator" />
                        </div>

                        <ol className="w-full text-sm mt-5 list-decimal p-2 pl-3">
                            <li>Install Authenticator (Like Google Authenticator)</li>
                            <li>Scan QR code with the authenticator (or enter the key manually).</li>
                            <li>Enter two step authentication code provided by your app.</li>
                        </ol>

                        <form onSubmit={handleActivateAuthenticator}>
                            <div className="flex flex-col mt-5">
                                <label htmlFor="authCode" className="font-medium">
                                    Authentication Code
                                </label>
                                <div className="flex items-center relative">
                                    <div className="absolute left-4 top-1/3 flex justify-center items-center w-8 h-8">
                                        <FontAwesomeIcon icon={faLock} size="xl" className="text-emerald-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="123456"
                                        id="authCode"
                                        className={`w-full mt-2 p-4 pl-14 rounded-xl shadow-input ${
                                            loading && "bg-gray-100"
                                        }`}
                                        onChange={(e) => setAuthCode(e.target.value)}
                                        maxLength="6"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                                    !authCode || loading ? "bg-slate-400" : "bg-emerald-400"
                                }`}
                                disabled={!authCode || loading}
                            >
                                {loading ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                ) : (
                                    "Activate Authenticator"
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </>
    );
};

export default ActivateAuthenticator;
