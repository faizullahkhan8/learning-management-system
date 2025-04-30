import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";
import { useSelector } from "react-redux";

interface IUseProtectedOptions {
    children: React.ReactNode;
}

export default function useAdminProtected({ children }: IUseProtectedOptions) {
    const { user } = useSelector((state: any) => state.auth);

    if (user) {
        const isAuthenticated = user.role === "admin";
        return isAuthenticated ? children : redirect("/");
    }
}
