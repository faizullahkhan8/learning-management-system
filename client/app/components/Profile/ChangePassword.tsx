import { useChangePasswordMutation } from "@/app/redux/Features/Auth/authApi";
import { styles } from "@/app/styles/styles";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Props = {};

const ChangePassword = (props: Props) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();

    const [changePassword, { isSuccess, error, isLoading }] =
        useChangePasswordMutation();

    const changePasswordHandler = async (e: any) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Confirm password must match");
        } else {
            await changePassword({ oldPassword, newPassword });
        }
    };

    useEffect(() => {
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
        if (isSuccess) {
            toast.success("Password changed successfully");
        }
    }, [isSuccess, error]);

    return (
        <div className="w-full pl-7 px-2 800px:pl-0">
            <h1 className={styles.title}>Change Password</h1>
            <div className="w-full">
                <form
                    aria-required
                    onSubmit={changePasswordHandler}
                    className="flex flex-col items-center"
                >
                    <div className="w-full 800px:w-[60%] mt-5">
                        <label className={`${styles.label} my-4`}>
                            Enter Your Old Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            minLength={6}
                            required
                            id="oldPassword"
                            placeholder="Old Password..."
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className="w-full 800px:w-[60%] mt-5">
                        <label className={`${styles.label} my-4`}>
                            Enter Your New Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            minLength={6}
                            required
                            id="newPassword"
                            placeholder="New Password..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className="w-full 800px:w-[60%] mt-5">
                        <label className={`${styles.label} my-4`}>
                            Confirm Your Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            minLength={6}
                            required
                            id="confirmPassword"
                            placeholder="Confirm Password..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`${styles.input}`}
                        />
                    </div>
                    <div className="w-full 800px:w-[60%] mt-5 relative flex items-center justify-center gap-4">
                        <input
                            type="submit"
                            className={`${styles.button}`}
                            value={isLoading ? "Loading..." : "Change Passwrod"}
                        />
                        <div
                            className={`bg-[#2190ff] w-[58px] h-[50px] rounded-full flex items-center justify-center`}
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible
                                    size={30}
                                    onClick={() => setShowPassword(false)}
                                    fill={theme === "dark" ? "white" : "black"}
                                    className="bottom-2 right-2 z-1 cursor-pointer"
                                />
                            ) : (
                                <AiOutlineEye
                                    size={30}
                                    onClick={() => setShowPassword(true)}
                                    fill={theme === "dark" ? "white" : "black"}
                                    className="bottom-2 right-2 z-1 cursor-pointer"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
