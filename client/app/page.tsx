"use client";
import { useSelector } from "react-redux";
import Hero from "./components/Route/Hero";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import { useState } from "react";

export default function Home() {
    const user = useSelector((state: any) => state.auth.user);

    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");

    return (
        <div>
            <Heading
                title={`ELearning`}
                description="ELearning is a platform for students to learn and get help from teacher"
                keywords="programming,MERN,Redux,Mechine Learning"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
                setRoute={setRoute}
                route={route}
            />
            <Hero />
        </div>
    );
}
