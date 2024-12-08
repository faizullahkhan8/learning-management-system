import Image from "next/image";
import React, { FC } from "react";
import AvatarPlaceHolder from "@/public/images/avatar.png";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiBook, BiLogOut } from "react-icons/bi";
import { useTheme } from "next-themes";

type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (value: number) => void;
    logOutHandler: () => void;
};

const SideBarProfile: FC<Props> = ({
    user,
    active,
    avatar,
    logOutHandler,
    setActive,
}) => {
    const { theme } = useTheme();
    return (
        <div className="w-full">
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer rounded-t-[5px] ${
                    active === 1
                        ? "dark:bg-slate-800 bg-white"
                        : "bg-transparent"
                }`}
                onClick={() => setActive(1)}
            >
                <Image
                    src={
                        user.avatar || avatar
                            ? user.avatar || avatar
                            : AvatarPlaceHolder
                    }
                    alt="user avatar"
                    className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
                />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    My Account
                </h5>
            </div>
            {/* CHANGE PASSWORD */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                    active === 2
                        ? "dark:bg-slate-800 bg-white"
                        : "bg-transparent"
                }`}
                onClick={() => setActive(2)}
            >
                <RiLockPasswordLine
                    size={20}
                    fill={theme === "dark" ? "#fff" : "#000"}
                />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    Change Password
                </h5>
            </div>
            {/* ENROLLED COURSE */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                    active === 3
                        ? "dark:bg-slate-800 bg-white"
                        : "bg-transparent"
                }`}
                onClick={() => setActive(3)}
            >
                <BiBook size={20} fill={theme === "dark" ? "#fff" : "#000"} />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    Enrolled Course
                </h5>
            </div>
            {/* LOG OUT */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${
                    active === 4
                        ? "dark:bg-slate-800 bg-white"
                        : "bg-transparent"
                }`}
                onClick={() => logOutHandler()}
            >
                <BiLogOut size={20} fill={theme === "dark" ? "#fff" : "#000"} />
                <h5 className="pl-2 800px:block hidden font-Poppins dark:text-white text-black">
                    Log Out
                </h5>
            </div>
        </div>
    );
};

export default SideBarProfile;
