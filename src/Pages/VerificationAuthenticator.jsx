import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, successMessageState, tokenState, userIdState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const VerificationAuthenticator = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const codeInputs = useRef([]);

    const userId = useRecoilValue(userIdState);
    const [token, setToken] = useRecoilState(tokenState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const handleChange = (event, index) => {
        const value = event.target.value;
        if (value.length <= 1) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (value.length > 0 && index < 6 - 1) {
                codeInputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            codeInputs.current[index - 1].focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasteData = event.clipboardData.getData("text/plain");
        const pasteValues = pasteData
            .slice(0, 6)
            .split("")
            .map((value) => value.trim().slice(0, 1));
        const newCode = [...code];
        pasteValues.forEach((value, index) => {
            newCode[index] = value;
        });
        setCode(newCode);
        codeInputs.current[0].focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        const verifCode = code.join("");

        const postConfirmLogin = await sendRequest({
            method: "POST",
            path: "/api/v1/customer/login/confirm-auth",
            body: {
                id: userId,
                loginId: localStorage.getItem("loginId"),
                code: verifCode,
            },
        });

        const res = await postConfirmLogin.json();
        if (!postConfirmLogin.ok) {
            setErrorMessage(res.message);
            setLoading(false);
            return;
        }

        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        localStorage.setItem("id", res.id);

        setToken({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
        });
        localStorage.removeItem("loginId");
        setSuccessMessage("Login successful");
        navigate("/");
        setLoading(false);
    };

    useEffect(() => {
        document.title = "Verification Authenticator";
        if (token.refreshToken) {
            navigate("/");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <HeaderV2 page="Authentication" />
            <div className="p-4 w-full pb-16 relative h-screen">
                <ErrorMessage />
                <SuccessMessage />
                <div className="mt-5">
                    <h1 className="font-semibold text-lg">2 Step Verification</h1>
                    <p className="text-xs text-gray-500">
                        Please type the verification code sent of your authenticator app
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mt-16">
                    <div className="flex justify-center items-center flex-wrap gap-2">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                className="w-10 h-10 rounded-md text-center border-2 border-gray-300 focus:outline-none focus:border-emerald-500 focus:shadow-input"
                                maxLength="1"
                                value={value}
                                onPaste={handlePaste}
                                onChange={(event) => handleChange(event, index)}
                                onKeyDown={(event) => handleKeyDown(event, index)}
                                ref={(ref) => (codeInputs.current[index] = ref)}
                                disabled={loading}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={code.join("").length !== code.length}
                        className={`w-full mt-12 p-3 text-slate-50 font-semibold rounded-xl ${
                            code.join("").length !== code.length || loading ? "bg-slate-400" : "bg-emerald-400"
                        }`}
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Verification"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default VerificationAuthenticator;
