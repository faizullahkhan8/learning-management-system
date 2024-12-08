"use client";
import { useSelector } from "react-redux";
import Hero from "./components/Route/Hero";
import Heading from "./utils/Heading";

export default function Home() {
    const user = useSelector((state: any) => state.auth.user);
    return (
        <div>
            <Heading
                title={`ELearning`}
                description="ELearning is a platform for students to learn and get help from teacher"
                keywords="programming,MERN,Redux,Mechine Learning"
            />
            <Hero />
        </div>
    );
}
