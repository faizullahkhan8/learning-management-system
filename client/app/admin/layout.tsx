"use client";
import React, { FC } from "react";
import AdminSideBar from "../components/Admin/Sidebar/AdminSideBar";

type Props = {
    children: React.ReactNode;
};

const layout: FC<Props> = ({ children }) => {
    return (
        <div className="flex h-[200vh]">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSideBar />
            </div>
            <div className="w-[84%]">{children}</div>
        </div>
    );
};

export default layout;
