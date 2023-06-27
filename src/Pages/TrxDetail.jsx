import { faArrowLeft, faArrowRight, faCheck, faGift, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import Loading from "../Components/Loading";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, tokenState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

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
        color: "blue-500",
        title: "Pending",
    },
    2: {
        color: "blue-500",
        title: "Processing",
    },
    3: {
        color: "emerald-500",
        title: "Completed",
    },
    4: {
        color: "red-500",
        title: "Failed",
    },
    5: {
        color: "red-500",
        title: "Rejected",
    },
    6: {
        color: "amber-500",
        title: "Sending",
    },
    7: {
        color: "amber-500",
        title: "Partially Paid",
    },
};

const TrxDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loadingPage, setLoadingPage] = useState(false);
    const [trx, setTrx] = useState({});

    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);

    const setErrorMessage = useSetRecoilState(errorMessageState);

    useEffect(() => {
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        const trxRefNo = searchParams.get("referenceNo");

        const getData = async () => {
            setLoadingPage(true);
            const getTrxDetail = await sendRequest({
                method: "GET",
                path: `/api/v1/order/transaction-history/${user.id}/detail?referenceNo=${trxRefNo}`,
                auth: true,
            });

            const res = await getTrxDetail.json();
            if (!getTrxDetail.ok) {
                setErrorMessage(res.message);
                setLoadingPage(false);
                return;
            }

            setTrx(res);
            setLoadingPage(false);
        };

        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <HeaderV2 page="Detail" />
            <div className="p-4 mt-4 w-full relative">
                <ErrorMessage />
                <SuccessMessage />
                {loadingPage || !ICON_TRX_HISTORY[trx.type] ? (
                    <Loading />
                ) : (
                    <>
                        <div className="w-full flex justify-start flex-col items-center">
                            <div
                                className={`w-16 h-16 rounded-full flex justify-center items-center bg-${
                                    TRX_STATUSES[trx.status].color
                                }`}
                            >
                                <FontAwesomeIcon
                                    icon={ICON_TRX_HISTORY[trx.type].icon}
                                    className={`text-slate-50`}
                                    size="2x"
                                />
                            </div>
                            <h2 className={`text-${TRX_STATUSES[trx.status].color} text-2xl font-semibold mt-2`}>
                                {trx.type === "Withdrawal" || trx.type === "Loss" ? "- " : "+ "}
                                {trx.payAmount}
                            </h2>
                        </div>
                        {TRX_STATUSES[trx.status].title === "Pending" && (
                            <div className="w-full mt-5">
                                <Link
                                    to={trx.invoice.invoiceUrl}
                                    className="w-full bg-emerald-400 p-3 rounded-lg text-slate-50 font-semibold shadow-input text-sm"
                                >
                                    Pay your pending payment
                                </Link>
                            </div>
                        )}
                        <div className="w-full shadow-custom p-3 rounded-md mt-4 overflow-x-auto">
                            <h3 className="text-md font-semibold">Transaction Detail</h3>
                            <table className="table-auto w-full mt-2 text-[10px]">
                                <tbody className="divide-gray-200 divide-y-2">
                                    <tr>
                                        <td className="py-2">Status</td>
                                        <td className="text-end">{TRX_STATUSES[trx.status].title}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2">Type</td>
                                        <td className="text-end">{trx.type}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Reference Number</td>
                                        <td className="text-end">{trx.trxRefNo}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Paid Amount</td>
                                        <td className="text-end">{trx.amount}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Actual Amount</td>
                                        <td className="text-end">{trx.payAmount}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Currency</td>
                                        <td className="text-end">TRX</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Pay Address</td>
                                        <td className="text-end">{trx.payAddress}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Created at</td>
                                        <td className="text-end">{new Date(trx.createdAt).toLocaleString()}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Updated at</td>
                                        <td className="text-end">{new Date(trx.updatedAt).toLocaleString()}</td>
                                    </tr>
                                    <tr className="">
                                        <td className="py-2">Remark</td>
                                        <td className="text-end">{trx.remark}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default TrxDetail;
