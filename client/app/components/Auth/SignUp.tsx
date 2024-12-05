import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    AiFillGithub,
    AiOutlineEye,
    AiOutlineEyeInvisible,
} from "react-icons/ai";
import { styles } from "../../styles/styles";
import { FcGoogle } from "react-icons/fc";
import { useTheme } from "next-themes";
import { useRegisterMutation } from "@/app/redux/Features/Auth/authApi";
import toast from "react-hot-toast";

interface ISignUpOptions {
    setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name."),
    email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
});

const SignUp: FC<ISignUpOptions> = ({ setRoute }) => {
    const [show, setShow] = useState(false);

    const [register, { data, error, isSuccess, isLoading }] =
        useRegisterMutation();

    useEffect(() => {
        if (isSuccess) {
            const message = data.message || "Registeration successful";
            toast.success(message);
            setRoute("Verification");
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message || "something wents wrong!");
            }
        }
    }, [isSuccess, error]);

    const { theme } = useTheme();

    const formik = useFormik({
        initialValues: { email: "", password: "", name: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password, name }) => {
            const data = { name, email, password };
            await register(data);
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full">
            <h1 className={styles.title}>Join to ELearning</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className={styles.label} htmlFor="name">
                        Enter your Name
                    </label>
                    <input
                        type="text"
                        name=""
                        value={values.name}
                        onChange={handleChange}
                        id="name"
                        placeholder="John Doe"
                        className={`${
                            errors.name && touched.name && "border-red-500"
                        } ${styles.input}`}
                    />
                    {errors.name && touched.name && (
                        <span className="text-red-500 pt-2 block">
                            {errors.name}
                        </span>
                    )}
                </div>
                <label className={styles.label} htmlFor="email">
                    Enter your Email
                </label>
                <input
                    type="email"
                    name=""
                    value={values.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="E.g. example@example.com"
                    className={`${
                        errors.email && touched.email && "border-red-500"
                    } ${styles.input}`}
                />
                {errors.email && touched.email && (
                    <span className="text-red-500 pt-2 block">
                        {errors.email}
                    </span>
                )}
                <div className="w-full mt-5 relative mb-1">
                    <label htmlFor="password" className={styles.label}>
                        Enter you password
                    </label>
                    <input
                        id="password"
                        type={show ? "text" : "password"}
                        placeholder="e.g. example123!@#$%&^*"
                        value={values.password}
                        onChange={handleChange}
                        className={`${
                            errors.password &&
                            touched.password &&
                            "border-red-500"
                        } ${styles.input}`}
                    />
                    {show ? (
                        <AiOutlineEyeInvisible
                            size={25}
                            onClick={() => setShow(false)}
                            fill={theme === "dark" ? "white" : "black"}
                            className="absolute bottom-2 right-2 z-1 cursor-pointer"
                        />
                    ) : (
                        <AiOutlineEye
                            size={25}
                            onClick={() => setShow(true)}
                            fill={theme === "dark" ? "white" : "black"}
                            className="absolute bottom-2 right-2 z-1 cursor-pointer"
                        />
                    )}
                </div>
                {errors.password && touched.password && (
                    <span className="text-red-500 pt-2 block">
                        {errors.password}
                    </span>
                )}

                <div className="w-full mt-5">
                    <input
                        type="submit"
                        value={isLoading ? "Loading..." : "Sign Up"}
                        disabled={isLoading}
                        className={styles.button}
                    />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or join with
                </h5>
                <div className="flex items-center justify-center my-3">
                    <FcGoogle size={30} className="cursor-pointer mr-2" />
                    <AiFillGithub
                        size={30}
                        fill={theme === "dark" ? "white" : "black"}
                        className="cursor-pointer mr-2"
                    />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Already have an account
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Login")}
                    >
                        Log In
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default SignUp;
