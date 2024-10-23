import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import userModel from "../models/user.model";

export const isAuthenticated = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        // const access_token = req.cookies.access_token;
        const { access_token } = req.cookies;

        if (!access_token) {
            return next(
                new ErrorHandler("Plase login to access this resource", 400)
            );
        }

        const { id } = jwt.verify(
            access_token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as JwtPayload;

        if (!id) {
            return next(new ErrorHandler("Invalid access token", 400));
        }

        const user = await userModel.findOne({ _id: id }); // NOTE THIS IS BECAUSE OF NO INTERNET CONNECTION BUT WHEN AVAILIBLE REPLACE IT ON (redis.get(id))

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        req.user = user;

        next();
    }
);

// VALIDATE USER ROLE
export const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resources`,
                    403
                )
            );
        }
        next();
    };
};
