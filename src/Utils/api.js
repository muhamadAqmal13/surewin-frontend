import { enc } from "crypto-js";
import HmacSHA512 from "crypto-js/hmac-sha512";
import jwtDecode from "jwt-decode";

const getNewToken = async (id) => {
    const sign = createSignApp("get", { path: `/api/v1/customer/token/${id}` });
    const resNewToken = await fetch(`${process.env.REACT_APP_BASE_URL_API}/api/v1/customer/token/${id}`, {
        method: "GET",
        headers: {
            "x-sign-app": sign,
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include",
    });

    if (!resNewToken.ok) {
        window.localStorage.clear();
        window.location.replace(`${process.env.REACT_APP_BASE_URL}/login`);
    } else {
        return await resNewToken.json();
    }
};

const createSignApp = (method, data) => {
    let payload;
    if (method.toLowerCase() === "get" || method.toLowerCase() === "delete") {
        payload = `${data.path}`;
    } else {
        payload = JSON.stringify(data.body, Object.keys(data.body).sort());
    }

    return HmacSHA512(payload, process.env.REACT_APP_SIGN_KEY).toString(enc.Hex);
};

export const sendRequest = async (data) => {
    const userId = localStorage.getItem("id");
    const refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("accessToken");
    let needNewToken = false;
    if (accessToken === "undefined" || (data.auth && refreshToken && !accessToken)) {
        needNewToken = true;
    } else if (data.auth && accessToken) {
        const decode = await jwtDecode(accessToken);
        const expirationDate = new Date(decode.exp * 1000).getTime();
        const now = new Date().getTime();

        if (now > expirationDate) {
            needNewToken = true;
        }
    }

    if (needNewToken) {
        const newToken = await getNewToken(userId);
        localStorage.setItem("accessToken", newToken.accessToken);
        accessToken = newToken.accessToken;
    }

    const config = {
        method: data.method,
        headers: {
            "Content-Type": "Application/json",
            "Access-Control-Allow-Origin": "*",
        },
        credentials: "include",
    };

    if (data.body) {
        config["body"] = JSON.stringify(data.body);
    }
    if (data.auth) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const sign = createSignApp(data.method, data);
    config.headers["x-sign-app"] = sign;

    return await fetch(`${process.env.REACT_APP_BASE_URL_API}${data.path}`, config);
};
