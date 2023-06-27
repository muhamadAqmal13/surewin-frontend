import {
    faCreditCard,
    faEnvelope,
    faEye,
    faEyeSlash,
    faLock,
    faSpinner,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, successMessageState, tokenState, userIdState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [iconPassword, setIconPassword] = useState(faEyeSlash);
    const [iconConfirmPassword, setIconConfirmPassword] = useState(faEyeSlash);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [token, setToken] = useRecoilState(tokenState);
    const setUserId = useSetRecoilState(userIdState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const handleShowPassword = (e) => {
        if (e === "ConfirmPassword") {
            setShowConfirmPassword(showConfirmPassword ? false : true);
            setIconConfirmPassword(showConfirmPassword ? faEyeSlash : faEye);
        } else {
            setShowPassword(showPassword ? false : true);
            setIconPassword(showPassword ? faEyeSlash : faEye);
        }
    };

    const FORM = [
        {
            type: "text",
            cd: "Username",
            title: "Username",
            placeholder: "johndoe_",
            minLength: "6",
            maxLength: "16",
            icon: faUser,
            onChange: (e) => {
                setUsername(e.target.value);
            },
        },
        {
            type: "email",
            cd: "Email",
            title: "Email",
            placeholder: "johndoe@gmail.com",
            icon: faEnvelope,
            onChange: (e) => {
                setEmail(e.target.value);
            },
        },
        {
            type: "text",
            cd: "TrxAddress",
            title: "TRX Address",
            placeholder: "TQjZHwFSVEF7ogcADDC......tZjZ8",
            icon: faCreditCard,
            onChange: (e) => {
                setAddress(e.target.value);
            },
        },
        {
            type: "password",
            cd: "Password",
            title: "Password",
            placeholder: "********",
            minLength: "8",
            maxLength: "16",
            icon: faLock,
            onChange: (e) => {
                setPassword(e.target.value);
            },
        },
        {
            type: "password",
            cd: "ConfirmPassword",
            title: "Confirm Password",
            placeholder: "********",
            minLength: "8",
            maxLength: "16",
            icon: faLock,
            onChange: (e) => {
                setConfirmPassword(e.target.value);
            },
        },
    ];

    const handleRegister = async (e) => {
        e.preventDefault();

        setLoading(true);
        const response = await sendRequest({
            method: "POST",
            path: "/api/v1/customer/registration",
            body: {
                username,
                email,
                address,
                password,
                confirmPassword,
            },
        });

        const res = await response.json();
        if (!response.ok) {
            setErrorMessage(res.message);
            setLoading(false);
            return;
        }

        localStorage.setItem("auth", JSON.stringify({ ...res.data, type: "register" }));
        navigate("/otp");
    };

    useEffect(() => {
        document.title = "Register";
        if (token.refreshToken) {
            navigate("/");
            return;
        }
        // const getData = async () => {
        //     const getIp = await fetch("https://ipapi.co/json/");
        //     if (getIp.ok) {
        //         const res = await getIp.json();
        //         console.log(res);
        //     }
        // };

        // getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HeaderV2 page="Register" />
            <div className="p-4 mt-4 w-full relative">
                <ErrorMessage />
                <SuccessMessage />
                <h1 className="font-semibold text-2xl">Create Account</h1>
                <p className="text-sm text-gray-400">
                    Start creating your account to login and get 10 Trx. Free 10 Trx only for the first 1000 registered
                    users
                </p>
                <form className="mt-5" onSubmit={handleRegister}>
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
                                    type={
                                        form.cd === "Password"
                                            ? showPassword
                                                ? "text"
                                                : "password"
                                            : form.cd === "ConfirmPassword"
                                            ? showConfirmPassword
                                                ? "text"
                                                : "password"
                                            : form.type
                                    }
                                    placeholder={form.placeholder}
                                    id={form.cd}
                                    className={`w-full mt-2 p-4 pl-14 rounded-xl shadow-input ${
                                        loading && "bg-gray-100"
                                    }`}
                                    onChange={form.onChange}
                                    disabled={loading}
                                    maxLength={form.maxLength}
                                />

                                {(form.cd === "Password" || form.cd === "ConfirmPassword") && (
                                    <FontAwesomeIcon
                                        icon={form.cd === "Password" ? iconPassword : iconConfirmPassword}
                                        className="absolute right-4 top-7 text-lg cursor-pointer text-emerald-400"
                                        onClick={() => handleShowPassword(form.cd)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                            !username || !email || !address || !password || !confirmPassword || loading
                                ? "bg-slate-400"
                                : "bg-emerald-400"
                        }`}
                        disabled={!username || !email || !address || !password || !confirmPassword || loading}
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Register"}
                    </button>
                    <p className="text-sm mt-2 text-gray-400">
                        Already have an account?{" "}
                        <span>
                            <Link to="/login" className="text-blue-400">
                                Login here
                            </Link>
                        </span>
                    </p>
                </form>
            </div>
        </>
    );
};

export default Register;
