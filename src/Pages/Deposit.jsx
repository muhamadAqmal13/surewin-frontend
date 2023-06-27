import { faCaretDown, faCaretUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, orderState, tokenState, userIdState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const DEV_STATUS_PAYMENT = [
    {
        id: "success",
        name: "Success",
    },
    {
        id: "common",
        name: "Common",
    },
    {
        id: "failed",
        name: "Failed",
    },
    {
        id: "partially_paid",
        name: "Partially Paid",
    },
];

const Deposit = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [arrow, setArrow] = useState(faCaretDown);
    const [typeOptions, setTypeOptions] = useState(DEV_STATUS_PAYMENT[0].id);

    const userId = useRecoilValue(userIdState);
    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);

    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setOrder = useSetRecoilState(orderState);

    const handleDeposit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const body = {
            cifId: userId || user.id,
            amount: parseInt(amount).toString(),
        };

        if (process.env.REACT_APP_NODE_ENV === "DEVELOPMENT") {
            body.case = typeOptions;
        }
        const postCashIn = await sendRequest({
            method: "POST",
            path: "/api/v1/order/cash-in",
            auth: true,
            body,
        });

        const res = await postCashIn.json();
        if (!postCashIn.ok) {
            setErrorMessage(res.message || "Internal server Error");
            setLoading(false);
            return;
        }
        setOrder(res);
        window.location.replace(res.invoiceUrl);
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    };

    useEffect(() => {
        document.title = "Deposit";
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <HeaderV2 page="Deposit" />
            <div className="p-4 mt-4 w-full">
                <ErrorMessage />
                <SuccessMessage />
                <form onSubmit={handleDeposit}>
                    <div className="flex flex-col mt-5">
                        <label htmlFor="amount" className="font-bold">
                            Amount
                        </label>
                        <div className="flex items-center relative">
                            <input
                                type="number"
                                placeholder="Min amount 50"
                                id="amount"
                                value={amount === 0 ? "" : amount}
                                className={`w-full mt-2 p-4 rounded-xl shadow-input ${loading && "bg-slate-100"}`}
                                onChange={(e) => setAmount(e.target.value > 50000 ? 50000 : e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    {process.env.NODE_ENV === "development" && (
                        <div className="mt-6">
                            <h2>Select Type of result (For Testing Only)</h2>
                            <div className="flex justify-between items-center relative">
                                <select
                                    className="appearance-none w-full p-3 rounded-md bg-blue-400 font-semibold text-slate-50 mt-2"
                                    value={typeOptions}
                                    onChange={(e) => setTypeOptions(e.target.value)}
                                    onClick={() => setArrow(arrow === faCaretUp ? faCaretDown : faCaretUp)}
                                >
                                    {DEV_STATUS_PAYMENT.map((menu) => (
                                        <option
                                            className="font-['Poppins'] bg-slate-50 text-gray-800"
                                            value={menu.id}
                                            key={menu.id}
                                        >
                                            {menu.name}
                                        </option>
                                    ))}
                                </select>
                                <FontAwesomeIcon
                                    icon={arrow}
                                    className="absolute right-5 top-[18px] text-slate-50"
                                    size="2x"
                                />
                            </div>
                        </div>
                    )}
                    <div className="absolute w-full -m-4 bottom-8 p-4">
                        <h3 className="font-semibold">NOTE:</h3>
                        <p className="text-sm">
                            1. Deposits will be credited to your balance within approximately 5 - 10 minutes
                        </p>
                        <p className="text-sm">2. Max amount 50000 Trx</p>
                        <button
                            type="submit"
                            disabled={amount < 50 || !amount || loading}
                            className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                                amount < 50 || !amount || loading ? "bg-slate-400" : "bg-emerald-400"
                            }`}
                        >
                            {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Deposit"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Deposit;
