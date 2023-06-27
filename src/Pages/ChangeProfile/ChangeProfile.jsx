import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenState } from "../../Recoil";
import ChangeEmailOrAddress from "./ChangeEmailOrAddress";
import ChangePassword from "./ChangePassword";

const ChangeProfile = () => {
    const navigate = useNavigate();
    const { type } = useParams();

    const token = useRecoilValue(tokenState);

    useEffect(() => {
        if (!token.refreshToken) {
            navigate("/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (type === "email" || type === "address") {
        return <ChangeEmailOrAddress />;
    } else if (type === "password") {
        return <ChangePassword />;
    }
};

export default ChangeProfile;
