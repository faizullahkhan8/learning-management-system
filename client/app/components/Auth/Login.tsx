import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTheme } from "next-themes";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiFillGithub,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "../../styles/styles";
import { useLoginMutation } from "@/app/redux/Features/Auth/authApi";
import toast from "react-hot-toast";

interface ILoginOptions {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
}

const schema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email!")
        .required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
});

const Login: FC<ILoginOptions> = ({ setRoute, setOpen }) => {
    const [show, setShow] = useState(false);

    const [login, { isLoading, error, isSuccess }] = useLoginMutation();

    const { theme } = useTheme();

    useEffect(() => {
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
        if (isSuccess) {
            toast.success("Login Successfully");
            setOpen(false);
        }
    }, [isSuccess, error]);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password });
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full">
            <h1 className={styles.title}>Login with ELearning</h1>
            <form onSubmit={handleSubmit}>
                <label className={styles.label} htmlFor="email">
                    Enter your Email
                </label>
                <input
                    type="email"
                    name="email"
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
                        value={isLoading ? "Loading..." : "Login"}
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
                    Not have any account
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Sign-Up")}
                    >
                        Sign Up
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default Login;
