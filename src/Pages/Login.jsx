import { faEnvelope, faEye, faEyeDropper, faEyeSlash, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderV2 from "../Components/Header2";
import { sendRequest } from "../Utils/api";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { errorMessageState, successMessageState, tokenState, userIdState } from "../Recoil";
import ErrorMessage from "../Components/ErrorMessage";
import SuccessMessage from "../Components/SuccessMessage";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [token, setToken] = useRecoilState(tokenState);
    const setUserId = useSetRecoilState(userIdState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const FORM = [
        {
            type: "email",
            cd: "Email",
            title: "Email",
            placeholder: "johndoe@gmail.com",
            icon: faEnvelope,
            onChange: (e) => setEmail(e.target.value),
        },
        {
            type: "password",
            cd: "Password",
            title: "Password",
            placeholder: "********",
            icon: faLock,
            onChange: (e) => setPassword(e.target.value),
        },
    ];

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        const response = await sendRequest({
            method: "POST",
            path: "/api/v1/customer/login",
            body: {
                email,
                password,
            },
        });

        const res = await response.json();
        if (!response.ok) {
            setErrorMessage(res.message);
            setLoading(false);
            return;
        }

        localStorage.setItem("auth", JSON.stringify({ ...res.data, type: "login" }));
        navigate("/otp");
    };

    useEffect(() => {
        if (token.refreshToken) {
            navigate("/");
        }
    }, []);

    useLayoutEffect(() => {
        document.title = "Login in SUREWIN";
    }, []);

    return (
        <>
            <HeaderV2 page="Login" />
            <div className="p-4 mt-4 w-full relative">
                <ErrorMessage />
                <SuccessMessage />
                <h1 className="font-semibold text-2xl">Login Account</h1>
                <p className="text-sm text-gray-400">Please login with registered account</p>
                <form className="mt-5" onSubmit={handleLogin}>
                    {FORM.map((form) => (
                        <div className="flex flex-col mt-8" key={form.cd}>
                            <label htmlFor={form.cd} className="font-medium">
                                {form.title}
                            </label>
                            <div className="flex items-center relative">
                                <div className="absolute left-4 top-1/3 flex justify-center items-center w-8 h-8">
                                    <FontAwesomeIcon icon={form.icon} size="xl" className="text-emerald-400" />
                                </div>
                                <input
                                    type={form.cd === "Password" ? (showPassword ? "text" : "password") : form.type}
                                    placeholder={form.placeholder}
                                    id={form.cd}
                                    className={`w-full mt-2 p-4 pl-14 rounded-xl shadow-input ${
                                        loading && "bg-gray-100"
                                    }`}
                                    onChange={form.onChange}
                                    disabled={loading}
                                />

                                {(form.cd === "Password" || form.cd === "ConfirmPassword") && (
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEye : faEyeSlash}
                                        className="absolute right-4 top-7 text-lg cursor-pointer text-emerald-400"
                                        onClick={() => (showPassword ? setShowPassword(false) : setShowPassword(true))}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        type="submit"
                        className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                            !email || !password || loading ? "bg-slate-400" : "bg-emerald-400"
                        }`}
                        disabled={!email || !password || loading}
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Login"}
                    </button>
                    <p className="text-sm mt-2 text-gray-400">
                        Don't have an account yet?{" "}
                        <span>
                            <Link to="/register" className="text-blue-400">
                                Register here
                            </Link>
                        </span>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Login;
