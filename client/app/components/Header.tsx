"use client";
import Link from "next/link";
import React, { FC, useState } from "react";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";

import AvatarPlaceHolder from "@/public/images/avatar.png";

import CustomModel from "../utils/CustomModel";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Verification from "../components/Auth/Verification";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useLoadUserQuery } from "../redux/Features/api/apiSlice";

interface HeaderProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    setActiveItem: (item: number) => void;
    setRoute: (route: string) => void;
    route: string;
}

const Header: FC<HeaderProps> = ({
    open,
    setOpen,
    activeItem,
    setActiveItem,
    route,
    setRoute,
}) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const { user } = useSelector((state: any) => state.auth);

    const { isLoading } = useLoadUserQuery({});

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }

    const handleSidebarClose = (e: any) => {
        if (e.target.id === "screen") {
            setOpenSidebar(false);
        }
    };

    return (
        <div className="w-full relative">
            <div
                className={`${
                    active
                        ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow transition duration-500"
                        : "w-full border-transparent border-b dark:border dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
                }`}
            >
                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full flex items-center">
                    <div className="w-full h-[80%] flex items-center justify-between p-3">
                        <div>
                            <Link
                                href={"/"}
                                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                            >
                                ELearning
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems
                                activeItem={activeItem}
                                setActiveItem={setActiveItem}
                                isMobile={false}
                            />
                            <ThemeSwitcher />
                            {/* ONLY FOR MOBILE */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    size={30}
                                    className="cursor-pointer dark:text-white text-black "
                                    onClick={() => setOpenSidebar(true)}
                                />
                            </div>
                            {!isLoading && user ? (
                                <Link
                                    href="/profile"
                                    onClick={() => setActiveItem(5)}
                                >
                                    <Image
                                        src={
                                            user.avatar
                                                ? user.avatar.url
                                                : AvatarPlaceHolder
                                        }
                                        alt="user avatar"
                                        width={40}
                                        height={40}
                                        className="hidden 800px:block rounded-full border dark:border-transparent border-black cursor-pointer"
                                        style={{
                                            border:
                                                activeItem === 5
                                                    ? "3px solid #37a39a"
                                                    : "none",
                                        }}
                                    />
                                </Link>
                            ) : (
                                <HiOutlineUserCircle
                                    size={30}
                                    className="hidden 800px:block cursor-pointer dark:text-white text-black "
                                    onClick={() => setOpen(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>
                {openSidebar && (
                    <div
                        className="800px:hidden fixed w-full h-screen top-0 left-0 z-[999] dark:bg-[unset] bg-[#00000024]"
                        onClick={handleSidebarClose}
                        id="screen"
                    >
                        <div className="w-[70%] fixed z-[9999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                            <div className="w-full text-center py-6">
                                <Link href={"/"} passHref>
                                    <span className="text-[25px] font-Poppins font-[500] text-black dark:text-white">
                                        ELearning
                                    </span>
                                </Link>
                            </div>
                            <NavItems
                                setActiveItem={setActiveItem}
                                activeItem={activeItem}
                                isMobile={true}
                            />
                            {user ? (
                                <>
                                    <Link href="/profile">
                                        <Image
                                            src={
                                                user.avatar
                                                    ? user.avatar.url
                                                    : AvatarPlaceHolder
                                            }
                                            alt="user avatar"
                                            className="rounded-full ml-5 my-2 w-[30px] h-[30px] border dark:border-transparent border-black cursor-pointer"
                                        />
                                    </Link>
                                </>
                            ) : (
                                <HiOutlineUserCircle
                                    size={25}
                                    className="cursor-pointer ml-5 my-2 dark:text-white text-black "
                                    onClick={() => setOpen(true)}
                                />
                            )}
                            <br />
                            <br />
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                                Copyright &copy; 2024 ELearning
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {route === "Login" && (
                <>
                    {open && (
                        <CustomModel
                            activeItem={activeItem}
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            component={Login}
                        />
                    )}
                </>
            )}
            {route === "Sign-Up" && (
                <>
                    {open && (
                        <CustomModel
                            activeItem={activeItem}
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            component={SignUp}
                        />
                    )}
                </>
            )}
            {route === "Verification" && (
                <>
                    {open && (
                        <CustomModel
                            activeItem={activeItem}
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            component={Verification}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Header;
