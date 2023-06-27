import React, { useEffect, useState } from "react";
import NavMenu from "../Components/Menu";
import Header from "../Components/Header";
import ErrorMessage from "../Components/ErrorMessage";
import SuccessMessage from "../Components/SuccessMessage";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { errorMessageState, fundState, tokenState, trxHistoryState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleLeft,
    faAngleRight,
    faArrowLeft,
    faArrowRight,
    faCaretDown,
    faCaretUp,
    faCheck,
    faGamepad,
    faGift,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "../Components/Loading";
import qs from "qs";
import LoadingTrxHistory from "../Components/LoadingTrxHistory";

const TRANSACTION_HISTORY_MENU = [
    { id: "all", name: "All" },
    { id: "withdrawal", name: "Withdrawal" },
    { id: "deposit", name: "Deposit" },
    { id: "game", name: "Game" },
    { id: "bonus", name: "Bonus" },
];

const ICON_TRX_HISTORY = {
    Withdrawal: {
        icon: faArrowLeft,
        color: "text-red-500",
    },
    Deposit: {
        icon: faArrowRight,
        color: "text-emerald-500",
    },
    Bonus: {
        icon: faGift,
        color: "text-emerald-500",
    },
    Play: {
        icon: faGamepad,
        color: "text-red-500",
    },
    Win: {
        icon: faCheck,
        color: "text-emerald-500",
    },
    Loss: {
        icon: faTimes,
        color: "text-red-500",
    },
};

const TRX_STATUSES = {
    1: {
        bgColor: "bg-blue-500",
        title: "Pending",
    },
    2: {
        bgColor: "bg-blue-500",
        title: "Processing",
    },
    3: {
        bgColor: "bg-emerald-500",
        title: "Completed",
    },
    4: {
        bgColor: "bg-red-500",
        title: "Failed",
    },
    5: {
        bgColor: "bg-red-500",
        title: "Rejected",
    },
    6: {
        bgColor: "bg-amber-500",
        title: "Sending",
    },
    7: {
        bgColor: "bg-amber-500",
        title: "Partially Paid",
    },
    Bonus: {
        bgColor: "bg-emerald-500",
        title: "Bonus",
    },
    Win: {
        bgColor: "bg-emerald-500",
        title: "Win",
    },
    Loss: {
        bgColor: "bg-red-500",
        title: "Loss",
    },
};

const Balance = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loadingTrxHistory, setLoadingTrxHistory] = useState(false);
    const [typeOptions, setTypeOptions] = useState(TRANSACTION_HISTORY_MENU[0].id);
    const [displayTrxHistory, setDisplayTrxHistory] = useState([]);
    const [numPage, setNumPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const [arrow, setArrow] = useState(faCaretUp);

    const [fund, setFund] = useRecoilState(fundState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setTrxHistory = useSetRecoilState(trxHistoryState);
    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);

    const handleBtnPreviousAndContinue = async (key) => {
        setLoadingTrxHistory(true);
        if (key === "prev") {
            setNumPage(numPage <= 1 ? numPage : numPage - 1);
        } else {
            setNumPage(numPage >= totalPage ? numPage : numPage + 1);
        }

        const size = "10";
        const params = qs.stringify({
            page: key === "prev" ? numPage - 1 : numPage + 1,
            size,
            type: typeOptions,
        });

        const getTrxHistory = await sendRequest({
            path: `/api/v1/order/transaction-history/${user.id}?${params}`,
            method: "GET",
            auth: true,
        });

        const resGetTrxHistory = await getTrxHistory.json();
        if (!getTrxHistory.ok) {
            setErrorMessage(resGetTrxHistory.message);
            setLoading(false);
            return;
        }

        setTrxHistory(resGetTrxHistory);
        setDisplayTrxHistory(resGetTrxHistory.data.filter((trx) => !(trx.type === "Play")));
        setTotalPage(resGetTrxHistory.totalPage);
        setLoadingTrxHistory(false);
    };

    const handleClickSubMenu = async (id) => {
        setLoadingTrxHistory(true);
        setTypeOptions(id);
        setNumPage(1);

        const size = "10";
        const params = qs.stringify({
            page: numPage,
            size,
            type: id,
        });

        const getTrxHistory = await sendRequest({
            path: `/api/v1/order/transaction-history/${user.id}?${params}`,
            method: "GET",
            auth: true,
        });

        const resGetTrxHistory = await getTrxHistory.json();
        if (!getTrxHistory.ok) {
            setErrorMessage(resGetTrxHistory.message);
            setLoading(false);
            return;
        }

        setTrxHistory(resGetTrxHistory);
        setDisplayTrxHistory(resGetTrxHistory.data.filter((trx) => !(trx.type === "Play")));
        setTotalPage(resGetTrxHistory.totalPage);
        setLoadingTrxHistory(false);
    };

    useEffect(() => {
        document.title = "Balance";
        if (!token.refreshToken) {
            navigate("/login");
            setLoading(false);
            return;
        }

        const getData = async () => {
            const getDataFund = await sendRequest({
                path: "/api/v1/fund/" + user.id,
                method: "GET",
                auth: true,
            });

            const resGetDataFund = await getDataFund.json();
            if (!getDataFund.ok) {
                setErrorMessage(resGetDataFund.message);
                setLoading(false);
                return;
            }

            setFund(resGetDataFund);

            const getTrxHistory = await sendRequest({
                path: "/api/v1/order/transaction-history/" + user.id,
                method: "GET",
                auth: true,
            });

            const resGetTrxHistory = await getTrxHistory.json();
            if (!getTrxHistory.ok) {
                setErrorMessage(resGetTrxHistory.message);
                setLoading(false);
                return;
            }

            setTrxHistory(resGetTrxHistory);
            setDisplayTrxHistory(resGetTrxHistory.data);
            setTotalPage(resGetTrxHistory.totalPage);
            setLoading(false);
        };

        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header page="Balance"></Header>
            <div className="p-4 w-full pb-20">
                <ErrorMessage />
                <SuccessMessage />
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="w-full shadow-custom mt-3 rounded-lg overflow-hidden flex justify-between items-center relative">
                            <div className="bg-red-500 text-slate-50 w-1/2 h-28 p-3 flex flex-col justify-between">
                                <p className="font-bold text-sm">Balance</p>
                                <p className="font-bold text-2xl">{fund && fund.balance}</p>
                                <p className="text-[8px]">Balance is withdrawable</p>
                            </div>
                            <div className="relative h-full">
                                <div className="bg-slate-50 w-20 h-20 rounded-full shadow-custom absolute left-1/2 transform -translate-y-1/2 -translate-x-1/2 flex justify-center items-center">
                                    <img
                                        src="https://surewin.sgp1.digitaloceanspaces.com/assets%2Ftrx.png"
                                        alt="Trx Logo"
                                        className="w-12 h-12"
                                    />
                                </div>
                            </div>
                            <div className="bg-slate-50 text-red-500 w-1/2 h-28 p-3 flex flex-col items-end justify-between">
                                <p className="font-bold text-sm">Bonus</p>
                                <p className="font-bold text-2xl">{fund && fund.bonus}</p>
                                <p className="text-[8px]">Balance can't be withdrawn</p>
                            </div>
                        </div>

                        <div className="w-full flex justify-center mt-5 gap-2 text-slate-50 font-semibold">
                            <Link
                                to="/deposit"
                                className="bg-emerald-500 w-28 h-10 flex justify-center items-center rounded-md"
                            >
                                Deposit
                            </Link>
                            <Link
                                to="/withdrawal"
                                className="bg-amber-500 w-28 h-10 flex justify-center items-center rounded-md"
                            >
                                Withdrawal
                            </Link>
                        </div>

                        <div className="mt-5">
                            <h1 className="font-semibold">Transaction History</h1>
                            <div className="flex justify-between items-center relative">
                                <select
                                    className="appearance-none w-full p-3 rounded-md bg-blue-400 font-semibold text-slate-50 mt-2"
                                    value={typeOptions}
                                    onChange={(e) => handleClickSubMenu(e.target.value)}
                                    onClick={() => setArrow(arrow === faCaretUp ? faCaretDown : faCaretUp)}
                                >
                                    {TRANSACTION_HISTORY_MENU.map((menu) => (
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
                            <div className="w-full">
                                {loadingTrxHistory ? (
                                    <LoadingTrxHistory />
                                ) : (
                                    <>
                                        {displayTrxHistory.length === 0 ? (
                                            <div className="w-full h-20 flex justify-center items-center bg-gray-300 rounded-md">
                                                <p className="font-semibold text-sm text-gray-600">No Data</p>
                                            </div>
                                        ) : (
                                            displayTrxHistory.map((trx) => (
                                                <div
                                                    className={`w-full flex justify-between items-center border-b-2 border-gray-300 p-3 rounded-md`}
                                                    key={trx.id}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full">
                                                            <FontAwesomeIcon
                                                                icon={ICON_TRX_HISTORY[trx.type].icon}
                                                                className={`${ICON_TRX_HISTORY[trx.type].color}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h2 className="text-sm">
                                                                {trx.type === "Win" ||
                                                                trx.type === "Loss" ||
                                                                trx.type === "Bonus"
                                                                    ? trx.description
                                                                    : trx.type}
                                                            </h2>
                                                            <p className="font-light text-[9px] text-gray-400">
                                                                {new Date(trx.updatedAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <p className={`${ICON_TRX_HISTORY[trx.type].color}`}>
                                                            {trx.type === "Withdrawal" ||
                                                            trx.type === "Loss" ||
                                                            trx.type === "Play"
                                                                ? "- "
                                                                : "+ "}
                                                            {trx.payAmount || "0"}
                                                        </p>
                                                        <div className="flex gap-2">
                                                            {trx.status === "1" && trx.invoiceUrl && (
                                                                <Link
                                                                    to={trx.invoiceUrl}
                                                                    className="text-slate-50 bg-emerald-400 font-semibold text-[11px] w-20 h-5 rounded-md flex justify-center items-center"
                                                                >
                                                                    Pay Here
                                                                </Link>
                                                            )}
                                                            <div
                                                                className={`${
                                                                    trx.type === "Win" ||
                                                                    trx.type === "Loss" ||
                                                                    trx.type === "Bonus"
                                                                        ? TRX_STATUSES[trx.type].bgColor
                                                                        : TRX_STATUSES[trx.status].bgColor
                                                                } text-slate-50 font-semibold text-[11px] w-20 h-5 rounded-md flex justify-center items-center`}
                                                            >
                                                                {trx.type === "Win" ||
                                                                trx.type === "Loss" ||
                                                                trx.type === "Bonus"
                                                                    ? trx.type
                                                                    : TRX_STATUSES[trx.status].title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </>
                                )}
                                <div className="w-full flex justify-center mt-6 gap-2 items-center">
                                    <button
                                        className={`w-10 h-10 ${
                                            numPage <= 1 ? "bg-slate-300" : "bg-emerald-500 text-slate-50"
                                        } flex justify-center items-center rounded-full`}
                                        onClick={() => handleBtnPreviousAndContinue("prev")}
                                        disabled={numPage <= 1}
                                    >
                                        <FontAwesomeIcon icon={faAngleLeft} />
                                    </button>
                                    <p>
                                        Page {numPage} of {totalPage}
                                    </p>
                                    <button
                                        className={`w-10 h-10 ${
                                            numPage >= totalPage ? "bg-slate-300" : "bg-emerald-500 text-slate-50"
                                        } flex justify-center items-center rounded-full`}
                                        onClick={() => handleBtnPreviousAndContinue("continue")}
                                        disabled={numPage >= totalPage}
                                    >
                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <NavMenu />
        </>
    );
};

export default Balance;
