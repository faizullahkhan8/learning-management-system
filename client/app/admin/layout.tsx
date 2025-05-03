"use client";
import React, { FC, useState } from "react";
import AdminSideBar from "../components/Admin/Sidebar/AdminSideBar";
import DashboardHero from "../components/Admin/Dashboard/DashboardHero";
import DashboardHeader from "../components/Admin/Dashboard/DashboardHeader";

type Props = {
    children: React.ReactNode;
};

const layout: FC<Props> = ({ children }) => {
    return (
        <div className="flex h-[200vh]">
            <div className="1500px:w-[16%] w-1/5">
                <AdminSideBar />
            </div>
            <div className="w-[84%]">
                <DashboardHeader />
                {children}
            </div>
        </div>
    );
};

export default layout;
