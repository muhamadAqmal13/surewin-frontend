import { atom } from "recoil";

export const userIdState = atom({
    key: "user-id-state",
    default: localStorage.getItem("id"),
});

export const userState = atom({
    key: "user-state",
    default: JSON.parse(localStorage.getItem("user")),
});

export const tokenState = atom({
    key: "token-state",
    default: {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
    },
});

export const errorMessageState = atom({
    key: "error-message-state",
    default: "",
});

export const successMessageState = atom({
    key: "success-message-state",
    default: "",
});

export const fundState = atom({
    key: "fund-state",
    default: null,
});

export const trxHistoryState = atom({
    key: "trx-history-state",
    default: null,
});

export const invoiceState = atom({
    key: "invoice-state",
    default: null,
});

export const orderState = atom({
    key: "order-state",
    default: null,
});

export const productState = atom({
    key: "product-state",
    default: null,
});

export const gameTypeState = atom({
    key: "gameType-state",
    default: null,
});

export const gameUserHistoryState = atom({
    key: "game-user-history-state",
    default: null,
});
