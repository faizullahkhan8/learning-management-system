"use client";
import { FC, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogoutQuery } from "@/app/redux/Features/Auth/authApi";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
interface IProfileOptions {
    user: any;
}

const Profile: FC<IProfileOptions> = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [logout, setLogout] = useState(false);

    const [active, setActive] = useState<number>(1);
    const {} = useLogoutQuery(undefined, {
        skip: !logout ? true : false,
    });

    const logOutHandler = async () => {
        // signOut();  WHEN THE SOCIAL AUTH IS READY
        setLogout(true);
    };

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 150) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    }

    return (
        <div className="w-[85%] flex mx-auto">
            <div
                className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${
                    scroll ? "top-[120px]" : "top-[30px]"
                } left-[30px]`}
            >
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logOutHandler={logOutHandler}
                />
            </div>
        </div>
    );
};

export default Profile;
