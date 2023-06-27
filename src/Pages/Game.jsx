import React, { useEffect, useState } from "react";
import NavMenu from "../Components/Menu";
import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleLeft,
    faAngleRight,
    faCaretDown,
    faCaretUp,
    faClock,
    faSpinner,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { sendRequest } from "../Utils/api";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    errorMessageState,
    fundState,
    gameTypeState,
    gameUserHistoryState,
    productState,
    successMessageState,
    tokenState,
    userIdState,
} from "../Recoil";
import SuccessMessage from "../Components/SuccessMessage";
import ErrorMessage from "../Components/ErrorMessage";
import Loading from "../Components/Loading";
import { useNavigate } from "react-router-dom";

const Game = () => {
    const navigate = useNavigate();
    const [TRANSACTION_HISTORY_MENU, SETTRANSACTIONMENU] = useState([
        { id: "all", name: "All Game History" },
        { id: "myHistory", name: "Your History" },
    ]);
    const [activeSubMenu, setActiveSubMenu] = useState("");
    const [loadingPage, setLoadingPage] = useState(false);
    const [loadingGame, setLoadingGame] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [arrow, setArrow] = useState(faCaretUp);
    const [typeOptions, setTypeOptions] = useState(TRANSACTION_HISTORY_MENU[0].id);
    const [latestGame, setLatestGame] = useState({});
    const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
    const [periode, setPeriode] = useState(0);
    const [displayProduct, setDisplayProduct] = useState({});
    const [gamesUserHistory, setGamesUserHistory] = useState({});
    const [numPage, setNumPage] = useState(1);
    const [totalPage, setTotalPage] = useState(10);
    const [numPageUserGameHistory, setNumPageUserGameHistory] = useState(1);
    const [totalPageUserGameHistory, setTotalPageUserGameHistory] = useState(10);
    const [prompt, setPrompt] = useState(false);
    const [chooseName, setChooseName] = useState("");
    const [chooseCategory, setChooseCategory] = useState("");
    const [chooseId, setChooseId] = useState("");
    const [amount, setAmount] = useState(0);

    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);

    const [gamesHistory, setGamesHistory] = useRecoilState(gameUserHistoryState);
    const [gameTypes, setGameTypes] = useRecoilState(gameTypeState);
    const [products, setProducts] = useRecoilState(productState);

    const [fund, setFund] = useRecoilState(fundState);
    const token = useRecoilValue(tokenState);
    const userId = useRecoilValue(userIdState);

    const reqProducts = async (id) => {
        const getProducts = await sendRequest({
            method: "GET",
            path: "/api/v1/product",
            auth: false,
        });

        const resGetProducts = await getProducts.json();
        if (!getProducts.ok) {
            setErrorMessage(resGetProducts.message);
            setLoadingGame(false);
            return;
        }
        const filteredProducts = resGetProducts.filter((product) => product.gameTypeId === id);
        setDisplayProduct(filteredProducts);
        setProducts(resGetProducts);
        return resGetProducts;
    };

    const reqLatestGame = async (gameTypeId) => {
        const query = `gameTypeId=${gameTypeId}`;
        const getLatestGame = await sendRequest({
            method: "GET",
            path: "/api/v1/latest-game?" + query,
            auth: false,
        });

        const resGetLatestGame = await getLatestGame.json();
        if (!getLatestGame.ok) {
            setErrorMessage(resGetLatestGame.message);
            setLoadingPage(false);
            return;
        }

        setLatestGame(resGetLatestGame);
        setPeriode(parseInt(resGetLatestGame.periode));
        return resGetLatestGame;
    };

    const reqFund = async (userId) => {
        const getDataFund = await sendRequest({
            path: "/api/v1/fund/" + userId,
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
        return resGetDataFund;
    };

    const reqGameType = async () => {
        const getGameType = await sendRequest({
            method: "GET",
            path: "/api/v1/game/type",
            auth: false,
        });

        const resGetGameType = await getGameType.json();
        if (!getGameType.ok) {
            setErrorMessage(resGetGameType.message);
            setLoadingPage(false);
            return;
        }
        setGameTypes(resGetGameType);
        return resGetGameType;
    };

    const reqAllGame = async (page, size, gameTypeId) => {
        const getAllGame = await sendRequest({
            method: "GET",
            path: `/api/v1/game?gameTypeId=${gameTypeId}&page=${page}&size=${size}`,
        });

        const res = await getAllGame.json();
        if (!getAllGame.ok) {
            setErrorMessage(res.message);
            setLoadingPage(false);
            return;
        }
        setGamesHistory(res.data);
        return res;
    };

    const handleClickMenu = async (e, id) => {
        e.preventDefault();
        setActiveSubMenu(id);
        setLoadingGame(true);

        if (token.refreshToken) {
            const getUserHistory = await reqUserHistory(1, 5, null, null, id);
            setGamesUserHistory(getUserHistory);
            setTotalPageUserGameHistory(getUserHistory.totalPage);
        }

        const filteredProducts = products.filter((product) => product.gameTypeId === id);
        setDisplayProduct(filteredProducts);
        await reqLatestGame(id);
        const allGame = await reqAllGame(1, 5, id);
        setTotalPage(allGame.totalPage);
        setLoadingGame(false);
    };

    const handleBtnPreviousAndContinue = async (key) => {
        setLoadingGame(true);
        if (key === "prev") {
            setNumPage(numPage <= 1 ? numPage : numPage - 1);
        } else {
            setNumPage(numPage >= totalPage ? numPage : numPage + 1);
        }

        const size = "5";
        const res = await reqAllGame(key === "prev" ? numPage - 1 : numPage + 1, size, activeSubMenu);
        setTotalPage(res.totalPage);
        setLoadingGame(false);
    };

    const handleBtnPreviousAndContinueUserHistory = async (key) => {
        setLoadingGame(true);
        if (key === "prev") {
            setNumPageUserGameHistory(
                numPageUserGameHistory <= 1 ? numPageUserGameHistory : numPageUserGameHistory - 1,
            );
        } else {
            setNumPageUserGameHistory(
                numPageUserGameHistory >= totalPageUserGameHistory
                    ? numPageUserGameHistory
                    : numPageUserGameHistory + 1,
            );
        }

        const size = "5";
        const res = await reqUserHistory(
            key === "prev" ? numPageUserGameHistory - 1 : numPageUserGameHistory + 1,
            size,
        );
        setTotalPageUserGameHistory(res.totalPage);
        setLoadingGame(false);
    };

    const handleClickChoose = (id, category, name) => {
        setPrompt(true);
        setChooseCategory(name);
        setChooseName(category);
        setChooseId(id);
    };

    const reqUserHistory = async (page = 1, size = 5, type = "all", cifId, gameTypeId) => {
        if (!cifId) {
            cifId = userId;
        }

        if (!gameTypeId) {
            gameTypeId = activeSubMenu;
        }

        if (!type) {
            type = "all";
        }
        const getAllUserHistory = await sendRequest({
            method: "GET",
            path: `/api/v1/result-game-user/${cifId}?page=${page}&size=${size}&type=${type}&gameTypeId=${gameTypeId}`,
            auth: true,
        });

        const res = await getAllUserHistory.json();
        if (!getAllUserHistory.ok) {
            setErrorMessage(res.message);
            setLoadingPage(false);
            return;
        }

        setGamesUserHistory(res);
        return res;
    };

    const handlePostChoose = async (e) => {
        e.preventDefault();
        setLoadingForm(true);

        const postChoose = await sendRequest({
            method: "POST",
            path: "/api/v1/game/user",
            auth: true,
            body: {
                cifId: userId,
                gameId: latestGame.id,
                productId: chooseId,
                amount,
                gameTypeId: activeSubMenu,
            },
        });

        const res = await postChoose.json();
        if (!postChoose.ok) {
            setErrorMessage(res.message);
            setLoadingForm(false);
            return;
        }

        const duplicateData = [...gamesUserHistory.data];
        if (duplicateData.length >= 5) {
            duplicateData.pop();
        }
        duplicateData.unshift({
            periode,
            productId: chooseId,
            cd: chooseCategory,
            result: "PENDING",
        });

        setGamesUserHistory({
            ...gamesUserHistory,
            page: numPageUserGameHistory,
            totalPage: totalPageUserGameHistory,
            size: 5,
            type: "all",
            gameTypeId: activeSubMenu,
            data: duplicateData,
            totalData: gamesUserHistory.totalData,
        });

        setSuccessMessage("Success create your choose");
        setLoadingForm(false);

        const getNewFund = await reqFund(userId);
        setFund(getNewFund);
        setPrompt(false);
        setAmount(0);
        setTypeOptions("myHistory");
        setLoadingGame(false);
    };

    useEffect(() => {
        setPrompt(false);
        setAmount(0);
        const getData = async () => {
            setLoadingPage(true);
            const resGetGameType = await reqGameType();
            await reqProducts(resGetGameType[0].id);
            await reqLatestGame(resGetGameType[0].id);
            const games = await reqAllGame(1, 5, resGetGameType[0].id);
            setTotalPage(games.totalPage);
            setActiveSubMenu(resGetGameType[0].id);

            if (token.refreshToken) {
                if (!fund) {
                    await reqFund(userId);
                }

                const getUserHistory = await reqUserHistory(1, 5, null, null, resGetGameType[0].id);
                setGamesUserHistory(getUserHistory);
                setTotalPageUserGameHistory(getUserHistory.totalPage);
            }

            setLoadingPage(false);
        };

        if (!token.refreshToken) {
            SETTRANSACTIONMENU([{ id: "all", name: "All Game History" }]);
        }

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (gameTypes && activeSubMenu && latestGame) {
            const type = gameTypes.find((type) => type.id === activeSubMenu);
            const timer = setTimeout(async () => {
                const startAt = new Date();
                const finishAt = new Date(latestGame.finishAt);
                const distance = finishAt.getTime() - startAt.getTime();
                console.log(distance);

                const remain = {
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                };

                if (remain.minutes === 0 && remain.seconds === 0) {
                    setPeriode(periode + 1);
                    setTimeLeft({ minutes: 0, seconds: 0 });
                    setTimeout(async () => {
                        await reqLatestGame(type.id);
                        await reqAllGame(1, 5, type.id);
                        if (token.refreshToken) {
                            const newUserHistory = await reqUserHistory();
                            setGamesUserHistory(newUserHistory);
                        }
                    }, 2500);
                } else if (distance > 0) {
                    setTimeLeft(remain);
                } else {
                    setTimeLeft({ minutes: 0, seconds: 0 });
                }
            }, 1000);

            return () => clearTimeout(timer);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeLeft, gameTypes, activeSubMenu]);

    return (
        <>
            <Header page="Game" />
            <div className="p-4 w-full pb-20 relative">
                <SuccessMessage />
                <ErrorMessage />
                {prompt && (
                    <div className="absolute w-full top-0 left-0 right-0 flex justify-center h-full bg-opacity-30 bg-slate-500 z-10">
                        <div className="fixed px-4">
                            <div className="w-full bg-white shadow-custom p-4 rounded-md">
                                {token && token.refreshToken ? (
                                    <>
                                        <div className="flex justify-between">
                                            <h2 className="font-semibold">Spent your balance</h2>
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setPrompt(false);
                                                    setAmount(0);
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm mt-4">
                                            Your choose is{" "}
                                            <span className="font-semibold">
                                                {chooseName} {chooseCategory}
                                            </span>{" "}
                                            with {gameTypes.find((type) => type.id === activeSubMenu).name} type
                                        </p>
                                        <form onSubmit={handlePostChoose}>
                                            <div className="flex flex-col mt-5">
                                                <label htmlFor="amount" className="font-bold">
                                                    Amount
                                                </label>
                                                <div className="flex items-center relative">
                                                    <input
                                                        type="number"
                                                        placeholder="Enter your amount"
                                                        id="amount"
                                                        value={
                                                            amount === 0
                                                                ? ""
                                                                : amount < 0
                                                                ? 0
                                                                : amount > parseFloat(fund.totalBalance)
                                                                ? fund.totalBalance
                                                                : amount
                                                        }
                                                        className={`w-full mt-2 p-4 rounded-xl shadow-input ${
                                                            loadingForm && "bg-slate-100"
                                                        }`}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        disabled={loadingForm}
                                                    />
                                                </div>
                                                <p className="text-xs mt-3">
                                                    * Estimated amount if you win +{" "}
                                                    <span className="font-semibold">
                                                        {amount < 0
                                                            ? 0
                                                            : amount > parseFloat(fund.totalBalance)
                                                            ? parseFloat(fund.totalBalance) * 2
                                                            : amount * 2}
                                                    </span>{" "}
                                                    Trx
                                                </p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!amount || loadingForm || amount <= 0}
                                                className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                                                    !amount || amount <= 0 || loadingForm
                                                        ? "bg-slate-400"
                                                        : "bg-emerald-400"
                                                }`}
                                            >
                                                {loadingForm ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                                                ) : (
                                                    "Choose"
                                                )}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <>{navigate("/login")}</>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {loadingPage ||
                !gameTypes ||
                displayProduct.length === 0 ||
                !activeSubMenu ||
                !gamesHistory ||
                (token.refreshToken && gamesUserHistory && !gamesUserHistory.data) ? (
                    <Loading />
                ) : (
                    <>
                        <div className="w-full bg-slate-50 shadow-custom rounded-lg p-4">
                            <h1 className="font-semibold text-base text-center">Choose your type</h1>
                            <div className="flex justify-between mt-2">
                                {gameTypes.map((type) => (
                                    <div
                                        key={type.id}
                                        className={`flex justify-start flex-col items-center p-2 rounded-lg w-full ml-1 mr-1 text-center ${
                                            activeSubMenu === type.id
                                                ? "bg-blue-400 text-slate-50"
                                                : "bg-slate-50 text-black"
                                        } cursor-pointer`}
                                        onClick={(e) => handleClickMenu(e, type.id)}
                                    >
                                        <p className="font-semibold">{type.loop}</p>
                                        <p className="text-xs">{type.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between mt-6 mb-6">
                            <div className="w-32 bg-slate-50 shadow-custom rounded-r-full text-center text-lg font-medium">
                                {loadingGame ? (
                                    <FontAwesomeIcon icon={faSpinner} spin className="self-center" />
                                ) : (
                                    periode
                                )}
                            </div>
                            <div className="w-32 bg-slate-50 shadow-custom rounded-l-full text-lg font-medium flex items-center gap-2 pl-2">
                                <FontAwesomeIcon icon={faClock} size="1x" />
                                <div className="w-full flex justify-center items-center mr-2">
                                    {loadingGame ? (
                                        <FontAwesomeIcon icon={faSpinner} spin className="self-center" />
                                    ) : (
                                        <p>
                                            {timeLeft.minutes < 10 ? "0" + timeLeft.minutes : timeLeft.minutes}:
                                            {timeLeft.seconds < 10 ? "0" + timeLeft.seconds : timeLeft.seconds}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {token && token.refreshToken && (
                            <p className="mb-6">
                                Balance: <span className="font-semibold">{fund && fund.totalBalance} Trx</span>
                            </p>
                        )}

                        <div className="shadow-custom w-full bg-slate-50 p-4 rounded-md">
                            <div className="w-full flex justify-between gap-3">
                                {displayProduct
                                    .filter((product) => product.category === "color")
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className={`${
                                                product.cd === "green" ? "bg-emerald-500" : "bg-red-500"
                                            } w-full h-10 flex justify-center items-center rounded-lg cursor-pointer font-bold text-slate-50`}
                                            onClick={() =>
                                                handleClickChoose(product.id, product.category, product.name)
                                            }
                                        >
                                            {product.name}
                                        </div>
                                    ))}
                            </div>
                            <div className="w-full flex flex-wrap justify-between mt-4 gap-y-2">
                                {displayProduct
                                    .filter((product) => product.category === "number")
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className="h-12 w-12 cursor-pointer rounded-full flex justify-center items-center bg-amber-400 font-bold text-md"
                                            onClick={() =>
                                                handleClickChoose(product.id, product.category, product.name)
                                            }
                                        >
                                            {product.name}
                                        </div>
                                    ))}
                            </div>
                            <div className="w-full flex justify-around mt-4">
                                {displayProduct
                                    .filter((product) => product.category === "shape")
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className={`${
                                                product.cd === "circle" ? "rounded-full" : "rounded-lg"
                                            } h-20 w-20 font-bold text-slate-50 bg-blue-600 flex justify-center items-center cursor-pointer`}
                                            onClick={() =>
                                                handleClickChoose(product.id, product.category, product.name)
                                            }
                                        >
                                            {product.name}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <h1 className="mt-6 font-bold">Recent Result</h1>
                        <div className="flex justify-between items-center relative">
                            <select
                                className="appearance-none w-full p-3 rounded-md bg-blue-400 font-semibold text-slate-50 mt-2"
                                value={typeOptions}
                                onChange={(e) => setTypeOptions(e.target.value)}
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

                        {loadingGame ? (
                            <div className="h-96 w-full bg-white flex justify-center items-center">
                                <FontAwesomeIcon icon={faSpinner} spin className="self-center" />
                            </div>
                        ) : (
                            <div className="mt-2 text-xs">
                                {typeOptions !== "all" ? (
                                    <>
                                        {token.refreshToken ? (
                                            gamesUserHistory.data.length > 0 ? (
                                                <>
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-blue-400">
                                                            <tr>
                                                                <th
                                                                    scope="col"
                                                                    className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                                >
                                                                    Periode
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                                >
                                                                    Selected
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                                >
                                                                    Result
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="bg-white divide-y-2 divide-gray-200">
                                                            {gamesUserHistory.data.map((game, index) => (
                                                                <tr key={index}>
                                                                    <td className="text-center py-3">{game.periode}</td>
                                                                    <td className="text-center py-3">
                                                                        {products.find(
                                                                            (prod) => prod.id === game.productId,
                                                                        ).category === "color" ? (
                                                                            <div className="">
                                                                                <div
                                                                                    className={`p-2 rounded-md text-slate-50 flex justify-center items-center ${
                                                                                        products.find(
                                                                                            (prod) =>
                                                                                                prod.id ===
                                                                                                game.productId,
                                                                                        ).cd === "green"
                                                                                            ? "bg-emerald-500"
                                                                                            : "bg-red-500"
                                                                                    } font-bold text-md`}
                                                                                >
                                                                                    {
                                                                                        products.find(
                                                                                            (prod) =>
                                                                                                prod.id ===
                                                                                                game.productId,
                                                                                        ).cd
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        ) : products.find(
                                                                              (prod) => prod.id === game.productId,
                                                                          ).category === "number" ? (
                                                                            <div className="w-full flex justify-center items-center">
                                                                                <div className="w-12 h-12 rounded-full flex justify-center items-center bg-amber-400 font-bold text-md">
                                                                                    {
                                                                                        products.find(
                                                                                            (prod) =>
                                                                                                prod.id ===
                                                                                                game.productId,
                                                                                        ).cd
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="w-full flex justify-center items-center">
                                                                                <div
                                                                                    className={`${
                                                                                        products.find(
                                                                                            (prod) =>
                                                                                                prod.id ===
                                                                                                game.productId,
                                                                                        ).cd === "circle"
                                                                                            ? "rounded-full"
                                                                                            : "rounded-lg"
                                                                                    } font-bold text-slate-50 bg-blue-600 flex justify-center items-center w-16 h-16`}
                                                                                >
                                                                                    {
                                                                                        products.find(
                                                                                            (prod) =>
                                                                                                prod.id ===
                                                                                                game.productId,
                                                                                        ).cd
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </td>

                                                                    <td className="text-center py-3">
                                                                        <div className="w-full flex justify-center items-center">
                                                                            <p
                                                                                className={`font-semibold text-slate-50 p-2 rounded-md ${
                                                                                    game.result === "WIN"
                                                                                        ? "bg-emerald-400"
                                                                                        : game.result === "PENDING"
                                                                                        ? "bg-amber-400"
                                                                                        : "bg-red-400"
                                                                                }`}
                                                                            >
                                                                                {game.result}
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="w-full flex justify-center mt-6 gap-2 items-center">
                                                        <button
                                                            className={`w-10 h-10 ${
                                                                numPageUserGameHistory <= 1
                                                                    ? "bg-slate-300"
                                                                    : "bg-emerald-500 text-slate-50"
                                                            } flex justify-center items-center rounded-full`}
                                                            onClick={() =>
                                                                handleBtnPreviousAndContinueUserHistory("prev")
                                                            }
                                                            disabled={numPageUserGameHistory <= 1}
                                                        >
                                                            <FontAwesomeIcon icon={faAngleLeft} />
                                                        </button>
                                                        <p>
                                                            Page {numPageUserGameHistory} of {totalPageUserGameHistory}
                                                        </p>
                                                        <button
                                                            className={`w-10 h-10 ${
                                                                numPageUserGameHistory >= totalPageUserGameHistory
                                                                    ? "bg-slate-300"
                                                                    : "bg-emerald-500 text-slate-50"
                                                            } flex justify-center items-center rounded-full`}
                                                            onClick={() =>
                                                                handleBtnPreviousAndContinueUserHistory("continue")
                                                            }
                                                            disabled={
                                                                numPageUserGameHistory >= totalPageUserGameHistory
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faAngleRight} />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="w-full flex justify-center items-center h-40">
                                                    Empty
                                                </div>
                                            )
                                        ) : (
                                            <div>login</div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-blue-400">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                    >
                                                        Periode
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                    >
                                                        Color
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                    >
                                                        Number
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="text-xs font-extrabold text-slate-50 uppercase tracking-wider text-center"
                                                    >
                                                        Shape
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="bg-white divide-y-2 divide-gray-200">
                                                {gamesHistory.map((game) => (
                                                    <tr key={game.periode}>
                                                        <td className="text-center py-1">{game.periode}</td>
                                                        <td className="text-center py-1">
                                                            <div className="">
                                                                <div
                                                                    className={`p-2 rounded-md text-slate-50 flex justify-center items-center ${
                                                                        game.result.color === "green"
                                                                            ? "bg-emerald-500"
                                                                            : "bg-red-500"
                                                                    } font-bold text-md`}
                                                                >
                                                                    {game.result.color}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center py-1">
                                                            <div className="w-full flex justify-center items-center">
                                                                <div className="w-12 h-12 rounded-full flex justify-center items-center bg-amber-400 font-bold text-md">
                                                                    {game.result.number}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center py-1">
                                                            <div className="w-full flex justify-center items-center">
                                                                <div
                                                                    className={`${
                                                                        game.result.shape === "circle"
                                                                            ? "rounded-full"
                                                                            : "rounded-lg"
                                                                    } font-bold text-slate-50 bg-blue-600 flex justify-center items-center w-16 h-16`}
                                                                >
                                                                    {game.result.shape}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
                                                    numPage >= totalPage
                                                        ? "bg-slate-300"
                                                        : "bg-emerald-500 text-slate-50"
                                                } flex justify-center items-center rounded-full`}
                                                onClick={() => handleBtnPreviousAndContinue("continue")}
                                                disabled={numPage >= totalPage}
                                            >
                                                <FontAwesomeIcon icon={faAngleRight} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <NavMenu />
        </>
    );
};

export default Game;
