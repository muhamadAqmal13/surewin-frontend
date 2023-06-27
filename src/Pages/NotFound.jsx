import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    useEffect(() => {
        document.title = "Page Not Found";
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold mb-4">404 Not Found</h1>
            <p className="text-lg mb-4">
                The page you requested could not be found. If you entered the URL manually please check your spelling
                and try again.
            </p>
            <Link to="/" className="bg-emerald-400 p-4 rounded-md m-5 text text-slate-50 font-semibold">
                Back to dashboard
            </Link>
        </div>
    );
};

export default NotFound;
