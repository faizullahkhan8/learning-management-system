"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";

interface ProviderProps {
    children: any;
}

export function Providers({ children }: ProviderProps) {
    return <Provider store={store}>{children}</Provider>;
}
