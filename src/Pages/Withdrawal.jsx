import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import Loading from "../Components/Loading";
import SuccessMessage from "../Components/SuccessMessage";
import {
    errorMessageState,
    fundState,
    orderState,
    successMessageState,
    tokenState,
    userIdState,
    userState,
} from "../Recoil";
import { sendRequest } from "../Utils/api";

const Withdrawal = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(0);
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [typePassword, setTypePassword] = useState("password");
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const userId = useRecoilValue(userIdState);
    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);

    const [fund, setFund] = useRecoilState(fundState);

    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);
    const setOrder = useSetRecoilState(orderState);

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        setLoading(true);

        const postCashOut = await sendRequest({
            method: "POST",
            path: "/api/v1/order/cash-out",
            auth: true,
            body: {
                cifId: userId || user.id,
                amount: parseInt(amount).toString(),
                currency: "trx",
                address,
            },
        });

        const res = await postCashOut.json();
        if (!postCashOut.ok) {
            setErrorMessage(res.message || "Internal server Error");
            setLoading(false);
            return;
        }

        setSuccessMessage("Success request withdrawal");
        setOrder(res);
        navigate("/balance");
        setLoading(false);
    };

    useEffect(() => {
        document.title = "Withdrawal";
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        const getData = async () => {
            setLoadingPage(true);
            const getDataFund = await sendRequest({
                path: "/api/v1/fund/" + user.id,
                method: "GET",
                auth: true,
            });

            const resGetDataFund = await getDataFund.json();
            if (!getDataFund.ok) {
                setErrorMessage(resGetDataFund.message);
                setLoadingPage(false);
                return;
            }

            setFund(resGetDataFund);
            setLoadingPage(false);
        };

        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HeaderV2 page="Withdrawal" />
            <div className="p-4 mt-4 w-full">
                <ErrorMessage />
                <SuccessMessage />
                {loadingPage ? (
                    <Loading />
                ) : (
                    <>
                        <div className="flex justify-between items-center bg-emerald-400 shadow-input text-slate-50 p-4 rounded-md">
                            <p className="font-semibold">Available Balance</p>
                            <p className="font-bold text-3xl">
                                {(fund && fund.balance) || 0} <span className="font-semibold text-sm">Trx</span>
                            </p>
                        </div>
                        <form onSubmit={handleWithdrawal} className="mt-7">
                            <div className="flex flex-col">
                                <label htmlFor="amount" className="font-bold">
                                    Amount
                                </label>
                                <div className="flex items-center relative">
                                    <input
                                        type="number"
                                        placeholder="Min amount 50"
                                        id="amount"
                                        value={amount === 0 ? "" : amount}
                                        className={`w-full mt-2 p-4 rounded-xl shadow-input ${
                                            loading && "bg-slate-100"
                                        }`}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAmount(fund.balance)}
                                        className="bg-emerald-400 absolute right-0 p-[17px] top-[7px] rounded-r-xl font-semibold text-slate-50"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col mt-5">
                                <label htmlFor="address" className="font-bold">
                                    Address
                                </label>
                                <div className="flex items-center relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your address"
                                        id="address"
                                        value={address}
                                        className={`w-full mt-2 p-4 rounded-xl shadow-input ${
                                            loading && "bg-slate-100"
                                        }`}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex gap-1 items-center mt-2">
                                    <input
                                        type="checkbox"
                                        name="useMyAddress"
                                        id="useMyAddress"
                                        onChange={() => setAddress(user.address)}
                                    />
                                    <label htmlFor="useMyAddress">Use my address</label>
                                </div>
                            </div>
                            <div className="flex flex-col mt-5 ">
                                <label htmlFor="password" className="font-bold">
                                    Password
                                </label>
                                <div className="flex items-center relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        id="password"
                                        value={password}
                                        className={`w-full mt-2 p-4 rounded-xl shadow-input ${
                                            loading && "bg-slate-100"
                                        }`}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEye : faEyeSlash}
                                        className="absolute right-4 top-7 text-lg cursor-pointer text-emerald-400"
                                        onClick={() => (showPassword ? setShowPassword(false) : setShowPassword(true))}
                                    />
                                </div>
                            </div>
                            {user && user.authentication && (
                                <div className="flex flex-col mt-5">
                                    <label htmlFor="authenticator" className="font-bold">
                                        Authentication code
                                    </label>
                                    <div className="flex items-center relative">
                                        <input
                                            type="text"
                                            placeholder="Enter your authentication code"
                                            id="authenticator"
                                            value={authCode}
                                            className={`w-full mt-2 p-4 rounded-xl shadow-input ${
                                                loading && "bg-slate-100"
                                            }`}
                                            onChange={(e) => setAuthCode(e.target.value)}
                                            disabled={loading}
                                            maxLength="6"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="w-full mt-8">
                                <h3 className="font-semibold">NOTE:</h3>
                                <p className="text-sm">
                                    1. Withdrawals will be credited to your wallet within approximately 5 - 10 minutes
                                </p>
                                <button
                                    type="submit"
                                    disabled={
                                        amount < 50 ||
                                        amount > fund.balance ||
                                        !address ||
                                        (user && user.authentication && !authCode) ||
                                        loading
                                    }
                                    className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                                        amount < 50 ||
                                        amount > fund.balance ||
                                        !address ||
                                        (user && user.authentication ? !authCode : "") ||
                                        loading
                                            ? "bg-slate-400"
                                            : "bg-emerald-400"
                                    }`}
                                >
                                    {loading ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                    ) : (
                                        "Withdrawal"
                                    )}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </>
    );
};

export default Withdrawal;
