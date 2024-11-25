import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";

// Middleware to check if the user is authenticated
export const isAuthenticated = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        // Extract access_token from cookies
        const { access_token } = req.cookies;

        // If no token is provided, return an error
        if (!access_token) {
            return next(
                new ErrorHandler("Please log in to access this resource", 401) // Use HTTP 401 for unauthorized access
            );
        }

        try {
            // Verify the token using the secret key
            const decoded = jwt.verify(
                access_token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as JwtPayload;

            const { id } = decoded;

            // If the token does not contain a valid ID, return an error
            if (!id) {
                return next(new ErrorHandler("Invalid access token", 400));
            }

            // Fetch the user from the database
            const user = await userModel.findById(id);

            // If no user is found, return an error
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            // Attach the user object to the request for further use
            req.user = user;

            // Move to the next middleware
            next();
        } catch (error) {
            // Handle errors related to token verification
            return next(
                new ErrorHandler("Invalid or expired access token", 400)
            );
        }
    }
);

// Middleware to validate user roles
export const authorizeRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Check if the user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403 // Use HTTP 403 for forbidden access
                )
            );
        }

        // Move to the next middleware if the role is valid
        next();
    };
};
