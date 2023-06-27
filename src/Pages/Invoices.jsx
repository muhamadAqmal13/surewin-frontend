import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import HeaderV2 from "../Components/Header2";
import Loading from "../Components/Loading";
import { errorMessageState, invoiceState, tokenState, userIdState, userState } from "../Recoil";
import { sendRequest } from "../Utils/api";

const Invoices = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const invoiceNo = searchParams.get("invoiceNo");
    const userId = useRecoilValue(userIdState);
    const user = useRecoilValue(userState);
    const token = useRecoilValue(tokenState);
    const setErrorMessage = useSetRecoilState(errorMessageState);
    const setInvoice = useSetRecoilState(invoiceState);

    useEffect(() => {
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        const getData = async () => {
            setLoading(true);
            const checkInvoiceId = await sendRequest({
                method: "GET",
                path: `/api/v1/order/invoice/${user.id || userId}?invoiceNo=${invoiceNo}`,
                auth: true,
            });
            const resCheckInvoice = await checkInvoiceId.json();
            if (!checkInvoiceId.ok) {
                if ((resCheckInvoice.errorCode = "ValidationError")) {
                    navigate("/notfound");
                    return;
                }
                setErrorMessage(resCheckInvoice.message);
                return;
            }
            setLoading(false);
            setInvoice(resCheckInvoice);
        };
        getData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <HeaderV2 page="Invoices" />
            {loading ? (
                <Loading />
            ) : (
                <iframe
                    title="Iframe from nowPayments"
                    src={`${process.env.REACT_APP_BASEURL_NOWPAYMENTS}/payment/?iid=${invoiceNo}`}
                    className="w-full h-screen"
                />
            )}
        </>
    );
};

export default Invoices;
