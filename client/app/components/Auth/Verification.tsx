/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { styles } from "@/app/styles/styles";
import React, { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { VscWorkspaceTrusted } from "react-icons/vsc";

import { useActivationMutation } from "@/app/redux/Features/Auth/authApi";

interface IVerificationOptions {
    setRoute: (route: string) => void;
}

interface IVerificationNumber {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
}

const Verification: FC<IVerificationOptions> = ({ setRoute }) => {
    const [invalidError, setInvalidError] = useState<boolean>(false);

    const [activation, { error, isSuccess, isLoading }] =
        useActivationMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Account activated successfully.");
            setRoute("Login");
        }
        if (error) {
            if ("data" in error) {
                setInvalidError(true);
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<IVerificationNumber>({
        0: "",
        1: "",
        2: "",
        3: "",
    });

    const verificationHandler = async () => {
        const activation_code = Object.values(verifyNumber).join("");

        if (activation_code.length !== 4) {
            setInvalidError(true);
            return;
        }

        await activation({ activation_code });
    };

    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);
        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);

        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    return (
        <div className="w-full">
            <h1 className={styles.title}>Verify Your Account</h1>
            <br />
            <div className="w-full flex items-center justify-center mt-2">
                <div className="w-[80px] h-[80px] rounded-full bg-[#497df2] flex items-center justify-center">
                    <VscWorkspaceTrusted size={40} />
                </div>
            </div>
            <br />
            <br />
            <div className="m-auto flex items-center gap-8 justify-center">
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        type="number"
                        key={key}
                        ref={inputRefs[index]}
                        className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[10px] flex items-center text-black dark:text-white justify-center text-[18px] font-Poppins outline-none text-center ${
                            invalidError
                                ? "shake border-red-500"
                                : "dark:border-white border-[#0000004a]"
                        }`}
                        placeholder=""
                        maxLength={1}
                        value={verifyNumber[key as keyof IVerificationNumber]}
                        onChange={(e) =>
                            handleInputChange(index, e.target.value)
                        }
                    />
                ))}
            </div>
            <br />
            <br />
            <div className="w-full flex justify-center">
                <button className={styles.button} onClick={verificationHandler}>
                    {isLoading ? "Loading..." : "Verify OTP"}
                </button>
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white ">
                Go back to Sign In ?{" "}
                <span
                    className="text-[#2190ff] pl-1 cursor-pointer"
                    onClick={() => setRoute("Login")}
                >
                    Login
                </span>
            </h5>
        </div>
    );
};

export default Verification;
