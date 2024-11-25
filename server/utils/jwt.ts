require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
// import { redis } from "./redis";  // Uncomment when Redis is available

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

// Helper function to generate the cookie options
const generateTokenOptions = (
    expiresIn: number,
    isSecure: boolean
): ITokenOptions => {
    return {
        expires: new Date(Date.now() + expiresIn), // expires in the future based on the milliseconds
        maxAge: expiresIn,
        httpOnly: true, // Ensures cookies are not accessible via JavaScript
        sameSite: "lax", // Helps prevent CSRF attacks
        secure: isSecure, // Set secure flag to true in production (when using HTTPS)
    };
};

// Send Tokens to client
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    // Sign the access and refresh tokens
    const access_token = user.SignAccessToken();
    const refresh_token = user.SignRefreshToken();

    // Redis session storage (uncomment when internet connection is available)
    // redis.set(user._id as RedisKey, JSON.stringify(user));

    // Get expiration times from environment variables
    const ACCESS_TOKEN_EXPIRES =
        parseInt(process.env.ACCESS_TOKEN_EXPIRES || "300", 10) * 60 * 1000; // Default: 300 seconds
    const REFRESH_TOKEN_EXPIRES =
        parseInt(process.env.REFRESH_TOKEN_EXPIRES || "1200", 10) * 60 * 1000; // Default: 1200 seconds

    // Determine if cookies should be set as secure based on the environment
    const isSecure = process.env.NODE_ENV === "production";

    // Generate cookie options for access and refresh tokens
    const accessTokenOptions = generateTokenOptions(
        ACCESS_TOKEN_EXPIRES,
        isSecure
    );
    const refreshTokenOptions = generateTokenOptions(
        REFRESH_TOKEN_EXPIRES,
        isSecure
    );

    // Set the cookies with the generated tokens
    res.cookie("access_token", access_token, accessTokenOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenOptions);

    // Respond with success and tokens
    res.status(statusCode).json({
        success: true,
        user,
        access_token, // Optionally include tokens in the response body
    });
};
