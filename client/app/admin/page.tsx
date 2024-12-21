"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminSideBar from "../components/Admin/Sidebar/AdminSideBar";
import AdminProtected from "../hooks/useAdminProtected";

type Props = {};

const Admin = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Dashboard | admin"
                    description="ELearning is a platform for students to learn and get help from teacher"
                    keywords="programming,MERN,Redux,Mechine Learning"
                />
                <div className="flex h-[200vh]">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%]"></div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default Admin;
