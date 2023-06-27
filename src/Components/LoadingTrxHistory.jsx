import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const LoadingTrxHistory = () => {
    return (
        <div className="w-full h-20 flex justify-center items-center bg-gray-300 rounded-md">
            <FontAwesomeIcon icon={faSpinner} spin />
        </div>
    );
};

export default LoadingTrxHistory;
