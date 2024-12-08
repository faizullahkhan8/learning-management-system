import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";

interface IUseProtectedOptions {
    children: React.ReactNode;
}

export default function useProtected({ children }: IUseProtectedOptions) {
    const isAuthenticated = userAuth();

    return isAuthenticated ? children : redirect("/");
}
