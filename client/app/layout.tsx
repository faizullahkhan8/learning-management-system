"use client";
import { ThemeProvider } from "next-themes";
import { Providers } from "./Provider";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import Header from "./components/Header";
import React, { FC, useState } from "react";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-Josefin",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} ${josefin.variable} !bg-[#868db44c] bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
            >
                <Providers>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <Header
                            open={open}
                            setOpen={setOpen}
                            activeItem={activeItem}
                            setRoute={setRoute}
                            route={route}
                        />
                        {children}
                        <Toaster position="top-center" reverseOrder={false} />
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
}
