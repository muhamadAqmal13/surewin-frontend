import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ErrorMessage from "../../Components/ErrorMessage";
import HeaderV2 from "../../Components/Header2";
import { errorMessageState, successMessageState, tokenState, userState } from "../../Recoil";
import { sendRequest } from "../../Utils/api";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [typeOldPassword, setTypeOldPassword] = useState("password");
    const [typeNewPassword, setTypeNewPassword] = useState("password");
    const [typeConfirmNewPassword, setTypeConfirmNewPassword] = useState("password");
    const [loading, setLoading] = useState(false);

    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setSuccessMessage = useSetRecoilState(successMessageState);
    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);

    const INPUT = [
        {
            title: "Old Password",
            changeType: (e) => (e.target.checked ? setTypeOldPassword("text") : setTypeOldPassword("password")),
            type: typeOldPassword,
            name: "oldPassword",
            placeholder: "Enter you old password",
            onChange: (e) => setOldPassword(e.target.value),
        },
        {
            title: "New Password",
            changeType: (e) => (e.target.checked ? setTypeNewPassword("text") : setTypeNewPassword("password")),
            type: typeNewPassword,
            name: "newPassword",
            placeholder: "Enter you new password",
            onChange: (e) => setNewPassword(e.target.value),
        },
        {
            title: "Confirm New Password",
            changeType: (e) =>
                e.target.checked ? setTypeConfirmNewPassword("text") : setTypeConfirmNewPassword("password"),
            type: typeConfirmNewPassword,
            name: "confirmNewPassword",
            placeholder: "Enter you confirm new password",
            onChange: (e) => setConfirmNewPassword(e.target.value),
        },
    ];

    const handleChangePassword = async (e) => {
        e.preventDefault();

        setLoading(true);
        if (oldPassword === newPassword) {
            return setErrorMessage("Old and new passwords cannot be the same");
        } else if (newPassword !== confirmNewPassword) {
            return setErrorMessage("New password and the password confirmation do not match");
        }

        const responseChangePassword = await sendRequest({
            method: "PUT",
            path: "/api/v1/customer-password",
            auth: true,
            body: {
                id: user.id,
                oldPassword,
                newPassword,
            },
        });

        const res = await responseChangePassword.json();
        if (!responseChangePassword.ok) {
            setErrorMessage(res.message);
            setLoading(false);
            return;
        }

        setSuccessMessage("Change password successfully");
        navigate("/profile");
        setLoading(false);
    };

    useEffect(() => {
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <HeaderV2 page="Change Password" direct="/profile" />
            <div className="p-4 w-full pb-20 h-fit relative">
                <ErrorMessage />
                <form onSubmit={handleChangePassword}>
                    {INPUT.map((input, index) => (
                        <div className={`flex flex-col ${index !== 0 && "mt-6"}`} key={input.name}>
                            <label htmlFor={input.name} className="font-medium">
                                {input.title}
                            </label>
                            <input
                                type={input.type}
                                placeholder={input.placeholder}
                                id={input.name}
                                className={`w-full mt-2 p-4 rounded-xl shadow-input ${loading && "bg-slate-100"}`}
                                onChange={input.onChange}
                                disabled={loading}
                            />
                            <div className="mt-2 flex items-center">
                                <input type="checkbox" id={`Show${input.name}`} onChange={input.changeType} />
                                <label htmlFor={`Show${input.name}`} className="ml-1">
                                    Show {input.title}
                                </label>
                            </div>
                        </div>
                    ))}
                    <button
                        type="submit"
                        className={`w-full mt-8 p-3 text-slate-50 font-semibold rounded-xl ${
                            !oldPassword || !newPassword || !confirmNewPassword || loading
                                ? "bg-slate-400"
                                : "bg-emerald-400"
                        }`}
                        disabled={!oldPassword || !newPassword || !confirmNewPassword || loading}
                    >
                        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : "Change your password"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChangePassword;
