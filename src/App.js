import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./App.css";
import Balance from "./Pages/Balance";
import Dashboard from "./Pages/Dashboard";
import Game from "./Pages/Game";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import ChangeProfile from "./Pages/ChangeProfile/ChangeProfile";
import ActivateAuthenticator from "./Pages/ActivateAuthenticator";
import RemindActivateAuthenticator from "./Pages/RemindActivateAuthenticator";
import Deposit from "./Pages/Deposit";
import RemoveAuthenticator from "./Pages/RemoveAuthenticator";
import VerificationAuthenticator from "./Pages/VerificationAuthenticator";
import NotFound from "./Pages/NotFound";
import Withdrawal from "./Pages/Withdrawal";
import TrxDetail from "./Pages/TrxDetail";
import VerificationOtp from "./Pages/VerificationOtp";
import TestPages from "./Pages/TestPages";

function App() {
    return (
        <RecoilRoot>
            <div className="max-w-screen-sm mx-auto min-h-screen bg-slate-50 my-auto font-['Poppins'] relative">
                <Router>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/balance" element={<Balance />} />
                        <Route path="/game" element={<Game />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/profile/:type/edit" element={<ChangeProfile />} />

                        <Route path="/authentication/setup/1" element={<RemindActivateAuthenticator />} />
                        <Route path="/authentication/setup/2" element={<ActivateAuthenticator />} />
                        <Route path="/authentication/remove" element={<RemoveAuthenticator />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/login/authentication" element={<VerificationAuthenticator />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/otp" element={<VerificationOtp />} />

                        <Route path="/deposit" element={<Deposit />} />
                        <Route path="/withdrawal" element={<Withdrawal />} />
                        <Route path="/transaction" element={<TrxDetail />} />
                        <Route path="/test-pages" element={<TestPages />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </div>
            <Router>
                <Routes></Routes>
            </Router>
        </RecoilRoot>
    );
}

export default App;
