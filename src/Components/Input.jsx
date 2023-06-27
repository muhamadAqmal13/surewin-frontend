import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const FormInput = ({ props }) => {
    const [typePassword, setTypePassword] = useState("password");
    const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");
    const handleShowPassword = (e) => {
        if (e.currentTarget.id === "showConfirmPassword") {
            e.target.checked ? setTypeConfirmPassword("text") : setTypeConfirmPassword("password");
        } else {
            e.target.checked ? setTypePassword("text") : setTypePassword("password");
        }
    };
    return (
        <>
            <label htmlFor={props.cd} className="font-medium">
                {props.title}
            </label>
            <div className="flex items-center relative">
                <div className="absolute left-4 top-1/3 flex justify-center items-center w-8 h-8">
                    <FontAwesomeIcon icon={props.icon} size="xl" className="text-emerald-400" />
                </div>
                <input
                    type={
                        props.cd === "Password"
                            ? typePassword
                            : props.cd === "ConfirmPassword"
                            ? typeConfirmPassword
                            : props.type
                    }
                    placeholder={props.placeholder}
                    id={props.cd}
                    className="w-full mt-2 p-4 pl-14 rounded-xl shadow-input"
                />
            </div>
            {props.cd === "Password" || props.cd === "ConfirmPassword" ? (
                <div className="mt-2 flex items-center">
                    <input type="checkbox" id={`Show${props.cd}`} onChange={handleShowPassword} />
                    <label htmlFor={`Show${props.cd}`} className="ml-1">
                        Show {props.title}
                    </label>
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export default FormInput;
