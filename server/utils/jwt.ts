require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
import { RedisKey } from "ioredis";

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
    const access_token = user.SignAccessToken();
    const refresh_token = user.SignRefreshToken();

    // UPLOAD SESSION TO REDIS
    redis.set(user._id as RedisKey, JSON.stringify(user) as any); // NOTE => UN_COMMENT IT WHEN INTERNET CONNECTION IS AVIALIBLE

    // GET EXPIRES TIME FROM DOT ENV AND CONVERTES INTO BASE 10
    const ACCESS_TOKEN_EXPIRES = parseInt(
        process.env.ACCESS_TOKEN_EXPIRES || "300",
        10
    );
    const REFRESH_TOKEN_EXPIRES = parseInt(
        process.env.REFRESH_TOKEN_EXPIRES || "1200",
        10
    );

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES * 60 * 60 * 1000),
        maxAge: ACCESS_TOKEN_EXPIRES * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        // secure: process.env.NODE_ENV !== "development",
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(
            Date.now() + REFRESH_TOKEN_EXPIRES * 24 * 60 * 60 * 1000
        ),
        maxAge: REFRESH_TOKEN_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        // secure: process.env.NODE_ENV !== "development",
    };

    res.cookie("access_token", access_token, accessTokenOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        access_token,
    });
};
