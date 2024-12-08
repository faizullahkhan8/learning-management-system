"use client";
import React from "react";
import Protected from "../hooks/useProtected";
import ProfileComponent from "../components/Profile/Profile";
import Heading from "../utils/Heading";
import { useSelector } from "react-redux";
type Props = {};

const Profile = (props: Props) => {
    const user = useSelector((state: any) => state.auth.user);

    return (
        <div>
            <Protected>
                <Heading
                    title={`Profile | ${user.name}`}
                    description="ELearning is a platform for students to learn and get help from teacher"
                    keywords="programming,MERN,Redux,Mechine Learning"
                />
                <ProfileComponent user={user} />
            </Protected>
        </div>
    );
};

export default Profile;
