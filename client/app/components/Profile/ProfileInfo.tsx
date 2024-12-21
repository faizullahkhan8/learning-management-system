import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import UserAvatarPlaceholder from "@/public/images/avatar.png";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "@/app/styles/styles";
import { useUpdateUserInfoMutation } from "@/app/redux/Features/userApi/userApi";
import toast from "react-hot-toast";
import { useLoadUserQuery } from "@/app/redux/Features/api/apiSlice";

type IProfileInfoOptions = {
    user: any;
    avatar: string | null;
    setAvatar: (value: string) => void;
};

const ProfileInfo: FC<IProfileInfoOptions> = ({ user, avatar, setAvatar }) => {
    const [name, setName] = useState(user.name || "");
    const [updated, setUpdated] = useState(false);

    // TODO: when avatar functionality is ready

    // const imageHandler = (e: any) => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setAvatar(reader.result as any);
    //     };
    //     reader.readAsDataURL(file);
    // };

    const [updateUserInfo, { isSuccess, error, isLoading }] =
        useUpdateUserInfoMutation();

    const {} = useLoadUserQuery(undefined, { skip: updated ? false : true });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (user.name !== name) {
            await updateUserInfo({ name });
            setUpdated(true);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Name updated successfully");
        }

        if (error) {
            if (typeof "data" in error) {
                const errorData = error as any;
                toast.error(errorData.data.message);
            }
        }
    }, [isSuccess, error]);

    return (
        <>
            <div className="w-full justify-center flex">
                <div className="relative">
                    <Image
                        src={
                            user.avatar || avatar
                                ? user.avatar || avatar
                                : UserAvatarPlaceholder
                        }
                        width={120}
                        height={120}
                        alt="user profile avatar"
                        className="cursor-pointer border-[3px] border-[#37a39a] rounded-full"
                    />
                    <input
                        type="file"
                        name=""
                        id="avatar"
                        className="hidden"
                        // onChange={imageHandler}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                    />
                    <label htmlFor="avatar">
                        <div className="w-[30px] h-[30px] bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera
                                size={20}
                                className="z-[1]"
                                fill="white"
                            />
                        </div>
                    </label>
                </div>
            </div>
            <br />
            <br />
            <div className="w-full pl-6 800px:pl-10">
                <form onSubmit={handleSubmit}>
                    <div className="800px:w-[50%] m-auto block pb-4">
                        <div className="w-[100%]">
                            <label className={styles.label}>Full Name</label>
                            <input
                                type="text"
                                className={`${styles.input} mb-4 800px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="w-[100%] pt-2">
                            <label className={`${styles.label} block pb-2`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                readOnly
                                className={`${styles.input}  mb-1 800px:mb-0`}
                                value={user.email}
                            />
                        </div>
                        <input
                            type="submit"
                            disabled={user.name === name}
                            value={isLoading ? "Loading..." : "Update"}
                            className={`${styles.button} block mt-[30px] disabled:bg-[#718181]`}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProfileInfo;
