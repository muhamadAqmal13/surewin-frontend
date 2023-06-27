import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../Components/ErrorMessage";
import HeaderV2 from "../Components/Header2";
import Loading from "../Components/Loading";
import SuccessMessage from "../Components/SuccessMessage";
import { errorMessageState, tokenState, userIdState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const RemindActivateAuthenticator = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const userId = useRecoilValue(userIdState);
    const token = useRecoilValue(tokenState);
    const [user, setUser] = useRecoilState(userState);
    const setErrorMessage = useSetRecoilState(errorMessageState);

    useEffect(() => {
        document.title = "Setup Authenticator";
        if (token.refreshToken && !user) {
            const getDataUser = async () => {
                setLoading(true);
                const getCustomer = await sendRequest({
                    method: "GET",
                    path: "/api/v1/customer/" + userId,
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

            getDataUser();
        } else if (user && user.authentication) {
            navigate("/");
        } else if (!token.refreshToken) {
            navigate("/login");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <HeaderV2 page="Activate Authenticator" />
            <div className="p-4 w-full pb-16 relative">
                <ErrorMessage />
                <SuccessMessage />
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <h1 className="font-semibold text-lg text-center mt-6">Enable 2 Step Verification</h1>
                        <div className="w-full flex justify-center mt-3 flex-col items-center text-center">
                            <img
                                src="https://surewin.sgp1.digitaloceanspaces.com/assets%2Fauthenticator.png"
                                alt="Logo Authenticator"
                                className="w-52 h-52"
                            />
                            <p className="text-sm text-gray-400 mt-2">
                                Activate 2-step verification to ensure that only you can access your account
                            </p>
                        </div>

                        <div className="w-full flex justify-around items-center fixed bottom-0 mb-4">
                            <Link
                                to="/authentication/setup/2"
                                className="p-4 bg-emerald-400 text-slate-50 font-semibold rounded-xl"
                            >
                                Setup Now
                            </Link>
                            <Link to="/" className="p-4 text-emerald-400 font-semibold">
                                Later
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default RemindActivateAuthenticator;
