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

const VerificationOtp = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const codeInputs = useRef([]);
    const [email, setEmail] = useState("");
    const [idAuth, setIdAuth] = useState("");
    const [isTime, setIsTime] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
    const [type, setType] = useState("");
    const [createdDate, setCreatedDate] = useState();

    const setUserId = useSetRecoilState(userIdState);
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

        const postAuthOtp = await sendRequest({
            method: "POST",
            path: "/api/v1/otp",
            body: {
                id: idAuth,
                code: verifCode,
                type,
            },
        });

        const res = await postAuthOtp.json();
        if (!postAuthOtp.ok) {
            setErrorMessage(res.message);
            setLoading(false);
            return;
        }

        if (!res.authentication) {
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            localStorage.setItem("id", res.id);

            setToken({
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
            });
            setUserId(res.id);
            setSuccessMessage(`${type === "login" ? "Login" : "Registration"} successful`);
            if (type === "login") {
                navigate("/");
            } else {
                navigate("/authentication/setup/1");
            }
            localStorage.removeItem("auth");
            return;
        }

        setUserId(res.id);
        localStorage.setItem("loginId", res.loginId);
        navigate("/login/authentication");
        localStorage.removeItem("auth");
    };

    const handleRequestNewOtp = async () => {
        if (!isTime) {
            const getNewOtp = await sendRequest({
                method: "GET",
                path: "/api/v1/otp/" + idAuth + "?type=" + type,
                auth: false,
            });

            const res = await getNewOtp.json();
            if (!getNewOtp.ok) {
                setErrorMessage(res.message);
                return;
            }
            localStorage.setItem("auth", JSON.stringify({ ...res.data, type }));
            setCreatedDate(new Date(res.data.createdAt));
            setIsTime(true);
        }
    };

    useEffect(() => {
        document.title = "Verification Otp";
        const data = JSON.parse(localStorage.getItem("auth"));
        if (token.refreshToken) {
            navigate("/");
            return;
        } else if (!data) {
            navigate("/register");
            return;
        }

        setType(data.type);
        setEmail(data.email);
        setIdAuth(data.id);
        setCreatedDate(new Date(data.createdAt));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (createdDate) {
            const timer = setTimeout(async () => {
                const now = new Date().getTime();
                const endDate = createdDate.getTime() + 60000;
                const distance = endDate - now;
                const remain = {
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                };
                if (distance <= 0) {
                    setIsTime(false);
                }

                setTimeLeft(remain);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [timeLeft, createdDate]);

    return (
        <>
            <HeaderV2 page="Verification Otp" />
            <div className="p-4 w-full pb-16 relative h-screen">
                <ErrorMessage />
                <SuccessMessage />
                <div className="mt-5">
                    <h1 className="font-semibold text-lg">Verification Code</h1>
                    <p className="text-xs text-gray-400">Please type the verification code sent to</p>
                    <p className="text-xs text-gray-400">{email}</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-16">
                    <div className="flex justify-center items-center flex-wrap gap-2 text-start">
                        {code.map((value, index) => (
                            <input
                                key={index}
                                type="number"
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
                        <p className="text-xs text-gray-400">
                            It may take a minute to receive your code. Send new code :{" "}
                            <span
                                onClick={handleRequestNewOtp}
                                className={`text-emerald-400 font-semibold ${!isTime && "cursor-pointer"}`}
                            >
                                {isTime
                                    ? `${timeLeft.minutes < 10 ? "0" + timeLeft.minutes : timeLeft.minutes}:
                                            ${timeLeft.seconds < 10 ? "0" + timeLeft.seconds : timeLeft.seconds}`
                                    : "Click Here"}
                            </span>
                        </p>
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

export default VerificationOtp;
