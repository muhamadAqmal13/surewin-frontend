import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { errorMessageState } from "../Recoil";

const ErrorMessage = () => {
    const [msg, setMsg] = useRecoilState(errorMessageState);

    useEffect(() => {
        if (msg) {
            setTimeout(() => {
                setMsg("");
            }, 5000);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [msg]);
    return (
        <>
            {msg && (
                <div className="bg-red-500 bg-opacity-80 p-4 rounded-lg absolute mx-2 right-0 w-fit overflow-hidden z-50">
                    <p className="font-medium text-slate-50 text-opacity-100">{msg}</p>
                </div>
            )}
        </>
    );
};

export default ErrorMessage;
