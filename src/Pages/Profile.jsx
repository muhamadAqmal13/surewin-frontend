import React, { useEffect, useState } from "react";
import NavMenu from "../Components/Menu";
import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faUser, faAngleRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { errorMessageState, fundState, successMessageState, tokenState, userState } from "../Recoil";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../Utils/api";
import SuccessMessage from "../Components/SuccessMessage";
import Loading from "../Components/Loading";
import ErrorMessage from "../Components/ErrorMessage";

const fields = [
    { title: "Email", action: "Change Email" },
    { title: "Address", action: "Change Address" },
    { title: "Password", action: "Change Password" },
    { title: "Authenticator", action: "Activate Authenticator" },
];

const Profile = () => {
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [promptRemoveAuth, setPrompRemoveAuth] = useState(false);

    const [user, setUser] = useRecoilState(userState);
    const [token, setToken] = useRecoilState(tokenState);

    const setFund = useSetRecoilState(fundState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const handleCopied = () => {
        navigator.clipboard.writeText(user.address);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1500);
    };

    const handleChange = (key) => {
        if (key === "authenticator") {
            if (user.authentication) {
                setPrompRemoveAuth(true);
            } else {
                navigate(`/authentication/setup/2`);
            }
        } else {
            navigate("/profile/" + key + "/edit");
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        const postLogin = await sendRequest({
            method: "POST",
            path: "/api/v1/customer/logout",
            body: {
                id: user.id,
            },
            auth: true,
        });

        const resPostLogin = await postLogin.json();

        if (!postLogin.ok) {
            setErrorMessage(resPostLogin.message);
            setLoading(false);
            return;
        }
        localStorage.clear();
        setToken({
            accessToken: null,
            refreshToken: null,
        });
        setUser();
        setFund();
        setSuccessMessage(resPostLogin.message);
        navigate("/login");
        setLoading(false);
    };

    useEffect(() => {
        document.title = "Profile";
        if (!user && !token.refreshToken) {
            navigate("/login");
            return;
        }
        const getData = async () => {
            setLoading(true);
            const getCustomer = await sendRequest({
                method: "GET",
                path: "/api/v1/customer/" + user.id,
                auth: true,
            });

            const resGetCustomer = await getCustomer.json();
            if (!getCustomer.ok) {
                setErrorMessage(resGetCustomer.message || "Error when fetching data");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", JSON.stringify(resGetCustomer));
            setUser(resGetCustomer);

            setLoading(false);
        };
        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Header page="Profile"></Header>
            <div className="p-4 w-full pb-20 relative">
                <SuccessMessage />
                <ErrorMessage />
                {promptRemoveAuth && (
                    <div className="absolute w-full h-screen -m-4 p-5 bg-opacity-30 bg-slate-500 z-10">
                        <div className="relative top-1/3 w-full bg-slate-50 rounded-xl p-3">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="font-semibold ">Remove authenticator</h3>
                                <FontAwesomeIcon
                                    className="cursor-pointer"
                                    icon={faTimes}
                                    size="2x"
                                    onClick={() => setPrompRemoveAuth(false)}
                                />
                            </div>
                            <p className="mt-2 text-sm">
                                Are you sure you want to remove the authenticator from your account?
                            </p>
                            <div className="flex justify-end items-center gap-2 mt-5">
                                <button
                                    className="bg-red-500 text-slate-50 font-semibold p-3 rounded-md"
                                    onClick={() => navigate("/authentication/remove")}
                                >
                                    I'm sure
                                </button>
                                <button
                                    className="bg-emerald-500 text-slate-50 font-semibold p-3 rounded-md"
                                    onClick={() => setPrompRemoveAuth(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="flex flex-col items-center">
                            <div className="h-20 w-20 bg-white flex justify-center items-center rounded-full m-4 shadow-input flex-wrap">
                                <FontAwesomeIcon icon={faUser} size="3x" />
                            </div>
                            <div className="flex justify-center flex-col items-center">
                                <p className="font-medium text-xl">{user && user.username}</p>
                                <p className="text-sm text-gray-400">
                                    {user && user.address}
                                    <span className="ml-1 relative">
                                        <FontAwesomeIcon
                                            icon={faCopy}
                                            size="sm"
                                            onClick={handleCopied}
                                            className="cursor-pointer"
                                        />
                                        {isCopied && (
                                            <p className="absolute top-[-24px] rounded-lg right-[-10px] p-1 bg-slate-400 text-slate-50 text-xs">
                                                Copied
                                            </p>
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="w-full bg-white p-4 mt-4 rounded-xl shadow-custom">
                            {fields.map((field) => (
                                <div
                                    key={field.title.toLowerCase()}
                                    onClick={() => handleChange(field.title.toLowerCase())}
                                    className="flex justify-between items-center border-b-2 mt-3 pb-3 cursor-pointer"
                                >
                                    <div>
                                        <p className="text-gray-400 text-sm">{field.title}</p>
                                        <p className="text-sm text-gray-500 mt-1">{field.action}</p>
                                    </div>
                                    <div>
                                        {field.title === "Authenticator" ? (
                                            <div
                                                className={`relative flex text-xs gap-1 p-1 border-2 rounded-full items-center ${
                                                    user && user.authentication
                                                        ? "text-emerald-400 border-emerald-400"
                                                        : "text-red-400 border-red-400"
                                                }`}
                                            >
                                                <div
                                                    className={`absolute w-8 h-8 rounded-full shadow-input ${
                                                        user && user.authentication
                                                            ? "right-[-7px] bg-emerald-400"
                                                            : "left-[-7px] bg-red-400"
                                                    }`}
                                                ></div>
                                                <p>ON</p>
                                                <p>OFF</p>
                                            </div>
                                        ) : (
                                            <FontAwesomeIcon icon={faAngleRight} />
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                className="mt-4 w-full bg-emerald-400 shadow-input rounded-xl text-center p-1 text-slate-50 font-semibold"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
            <NavMenu />
        </>
    );
};

export default Profile;
