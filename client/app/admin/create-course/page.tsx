import CreateCourse from "@/app/components/Admin/CreateCourse/CreateCourse";
import Heading from "@/app/utils/Heading";
import React from "react";

type Props = {};

const page = (props: Props) => {
    return (
        <div>
            <Heading
                title="Elearning - Adming"
                description="ELearning is a platform for students to learn and get help form teachers"
                keywords="Programming,MERN,Next.js,Redux,Online Learning,Courses"
            />
            <CreateCourse />
        </div>
    );
};

export default page;
