/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import { useState } from "react";
import Hero from "./components/Route/Hero";

export default function Home() {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");
    return (
        <div>
            <Heading
                title="Home"
                description="ELearning is a platform for students to learn and get help from teacher"
                keywords="programming,MERN,Redux,Mechine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            />
            <Hero />
        </div>
    );
}
