import { Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import userModel from "../models/user.model";
// import { redis } from "../utils/redis";

// GET USER INFO
export const getUserById = CatchAsyncError(
    async (id: string, res: Response) => {
        // const user = await redis.get(id);
        const user = await userModel.findById(id);

        return res.status(200).json({
            success: true,
            user: JSON.stringify(user),
        });
    }
);

export const allUsersService = async (res: Response) => {
    const allUsers = await userModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        userLen: allUsers.length,
        Users: allUsers,
    });
};

export const updateUserRoleService = async (
    res: Response,
    _id: string,
    role: String
) => {
    const updatedUser = await userModel.findByIdAndUpdate(
        _id,
        { role },
        { new: true }
    );

    return res.status(201).json({
        success: true,
        message: "User role updated successfully.",
        updatedUser,
    });
};
