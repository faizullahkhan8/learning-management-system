"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminSideBar from "../components/Admin/Sidebar/AdminSideBar";
import AdminProtected from "../hooks/useAdminProtected";
import DashboardHero from "../components/Admin/DashboardHero";

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

                <DashboardHero />
            </AdminProtected>
        </div>
    );
};

export default Admin;
