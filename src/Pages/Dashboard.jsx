import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import Header from "../Components/Header";
import Loading from "../Components/Loading";
import NavMenu from "../Components/Menu";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, fundState, userIdState, tokenState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const BUTTON = [
    { id: "withdrawal", title: "Withdrawal", color: "bg-amber-500", link: "/withdrawal" },
    { id: "deposit", title: "Deposit", color: "bg-emerald-500", link: "/deposit" },
];

const _3_TOP_WINNER = [
    { no: 1, id: "1", username: "malmalaq_", totalWinners: 52, totalAmount: "241" },
    { no: 2, id: "2", username: "hamis", totalWinners: 68, totalAmount: "145" },
    { no: 3, id: "3", username: "gow", totalWinners: 12, totalAmount: "100" },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [boxOpen, setBoxOpen] = useState(false);
    const [reward, setReward] = useState("0");

    const token = useRecoilValue(tokenState);
    const userId = useRecoilValue(userIdState);

    const [user, setUser] = useRecoilState(userState);
    const setMsg = useSetRecoilState(errorMessageState);
    const [fund, setFund] = useRecoilState(fundState);

    const handleOpenBox = async () => {
        if (!token.refreshToken) {
            navigate("/login");
        } else if (fund.countOpenBox || fund.countOpenBox > 0) {
            setBoxOpen(false);
            const getReward = await sendRequest({
                method: "GET",
                path: "/api/v1/fund-open-box/" + userId,
                auth: true,
            });

            const res = await getReward.json();
            if (!getReward.ok) {
                setMsg(res.message);
                return;
            }

            setReward(res.reward);
            const getBalance = await sendRequest({
                method: "GET",
                path: "/api/v1/fund/" + userId,
                auth: true,
            });

            const resGetBalance = await getBalance.json();

            if (!getBalance.ok) {
                setMsg(resGetBalance.message || "Error when fetching data");
                setLoading(false);
                return;
            }
            setBoxOpen(true);
            setFund(resGetBalance);
        }
    };

    useEffect(() => {
        document.title = "Dashboard";
        if (token.refreshToken) {
            const getData = async () => {
                if (!user) {
                    const getCustomer = await sendRequest({
                        method: "GET",
                        path: "/api/v1/customer/" + userId,
                        auth: true,
                    });

                    const resGetCustomer = await getCustomer.json();
                    if (!getCustomer.ok) {
                        setMsg(resGetCustomer.message || "Error when fetching data");
                        setLoading(false);
                        return;
                    }

                    localStorage.setItem("user", JSON.stringify(resGetCustomer));
                    setUser(resGetCustomer);
                }

                const getBalance = await sendRequest({
                    method: "GET",
                    path: "/api/v1/fund/" + userId,
                    auth: true,
                });

                const resGetBalance = await getBalance.json();

                if (!getBalance.ok) {
                    setMsg(resGetBalance.message || "Error when fetching data");
                    setLoading(false);
                    return;
                }
                setFund(resGetBalance);
            };

            getData();
        }
        setLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Header page="Dashboard" username={user ? user.username : "User"}></Header>
            <div className="p-4 w-full pb-20 relative">
                <ErrorMessage />
                <SuccessMessage />
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <div className="w-full bg-slate-50 shadow-custom rounded-lg p-4 flex justify-between">
                            {!token.refreshToken ? (
                                <div className="h-28 w-full flex justify-center items-center">
                                    <Link to="/login" className="p-5 bg-emerald-400 rounded-lg">
                                        Login
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <p>Total Balance</p>
                                        <p>
                                            <span className="font-extrabold text-3xl">
                                                {(fund && fund.totalBalance) || 0}
                                            </span>{" "}
                                            Trx
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {BUTTON.map((btn) => (
                                                <Link
                                                    to={btn.link}
                                                    key={btn.id}
                                                    className={`w-28 ${btn.color} h-10 flex justify-center items-center rounded-md font-semibold text-slate-50`}
                                                >
                                                    {btn.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <img
                                        src="https://surewin.sgp1.digitaloceanspaces.com/assets%2Ftrx.png"
                                        alt="Trx Logo"
                                        className="h-20 w-20"
                                    />
                                </>
                            )}
                        </div>

                        <div className="text-slate-50 w-full bg-gradient-to-tr from-red-600 to-red-400 shadow-custom rounded-lg flex flex-col items-center p-2 mt-3">
                            <h1 className="font-bold">Open your gift</h1>
                            <div className="mt-2 relative flex justify-center">
                                <img
                                    src={
                                        boxOpen
                                            ? "https://surewin.sgp1.digitaloceanspaces.com/assets%2Fgift%20opened.png"
                                            : "https://surewin.sgp1.digitaloceanspaces.com/assets%2Fgift%20closed.png"
                                    }
                                    alt="Gift Box"
                                    className={`${boxOpen ? "w-48" : "w-32 cursor-pointer"}`}
                                    onClick={handleOpenBox}
                                />
                                {boxOpen && reward !== "0" && (
                                    <div className="absolute top-11">
                                        <p
                                            className="font-black text-5xl text-slate-50"
                                            style={{ textShadow: "1px 1px 30px gray" }}
                                        >
                                            {reward}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {boxOpen && reward !== "0" && <p className="text-xs font-bold">You won {reward} Trx</p>}
                            <h2 className="text-xs mt-3">
                                Total opportunities :{" "}
                                <span className="font-semibold">
                                    {fund && fund.countOpenBox ? fund.countOpenBox : 0}
                                </span>{" "}
                                times
                            </h2>
                            <p className="text-[8px] mt-3 text-start">
                                * Chance to open the box will be added when you successfully make a deposit.
                            </p>
                        </div>

                        {/* <div className="mt-8">
                            <h2 className="font-semibold text-base">Highest weekly winners</h2>
                            <div className="flex justify-between">
                                <p className="font-medium text-xs">Periode 2 Feb - 2 Mar</p>
                                <Link to="/top-10-winners" className="text-xs text-blue-600 font-semibold">
                                    See Top 10
                                </Link>
                            </div>
                            {_3_TOP_WINNER.map((data) => (
                                <div
                                    key={data.id}
                                    className={`flex justify-between items-center p-3 rounded-2xl mt-1 h-16 ${
                                        data.no === 1 ? "bg-amber-400" : data.no === 2 ? "bg-amber-300" : "bg-amber-200"
                                    }`}
                                >
                                    <div className="flex gap-2 items-center">
                                        <div className="rounded-full w-12 h-12 bg-white"></div>
                                        <div className="relative">
                                            <h1 className="text-base font-semibold">
                                                {data.username}
                                                {data.username === (user && user.username) && (
                                                    <span className="text-red-700 font-semibold text-xs absolute top-0">
                                                        You
                                                    </span>
                                                )}
                                            </h1>
                                            <p className="font-medium text-[10px]">
                                                Number of winner is {data.totalWinners} times
                                            </p>
                                        </div>
                                    </div>

                                    <p className="font-semibold text-[18px]">+{data.totalAmount}</p>
                                </div>
                            ))}
                        </div> */}
                    </>
                )}
            </div>
            <NavMenu />
        </>
    );
};

export default Dashboard;
