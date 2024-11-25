import { Response } from "express";
import userModel from "../models/user.model";
// import { redis } from "../utils/redis";  // Uncomment when Redis is available

/**
 * Service to get user information by user ID.
 * If Redis is used, it should fetch from Redis cache first.
 */
export const getUserById = async (id: string, res: Response) => {
    try {
        // Uncomment when Redis is available to check cache first
        // const user = await redis.get(id);

        // Fetch user from the database
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Respond with the user data
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        // Handle unexpected errors (e.g., database connection issues)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

/**
 * Service to fetch all users from the database, sorted by creation date (latest first).
 */
export const allUsersService = async (res: Response) => {
    try {
        // Fetch all users sorted by creation date
        const allUsers = await userModel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            userLen: allUsers.length,
            users: allUsers,
        });
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

/**
 * Service to update the role of a user by their ID.
 * This function should be used by an admin or authorized role.
 */
export const updateUserRoleService = async (
    res: Response,
    _id: string,
    role: string
) => {
    try {
        // Update the user's role in the database
        const updatedUser = await userModel.findByIdAndUpdate(
            _id,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            updatedUser,
        });
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({
            success: false,
            message: "Failed to update user role",
        });
    }
};
