import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

/**
 * Global error-handling middleware for Express.
 * Handles various types of errors and provides standardized error responses.
 *
 * @param {any} err - The error object thrown.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
export const ErrorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Set default error properties if not already defined
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error!";

    /**
     * Handle invalid MongoDB ObjectId (CastError).
     * Typically occurs when an invalid ID is provided in a query or parameter.
     */
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    /**
     * Handle MongoDB duplicate key error.
     * Triggered when a unique field value is violated (e.g., duplicate username/email).
     */
    if (err.code === 11000) {
        const message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )}. Please use a different value.`;
        err = new ErrorHandler(message, 400);
    }

    /**
     * Handle invalid JSON Web Token (JWT).
     * Typically occurs when the token is malformed or tampered with.
     */
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid JSON Web Token. Please try again.";
        err = new ErrorHandler(message, 400);
    }

    /**
     * Handle expired JSON Web Token.
     * Triggered when the token has passed its expiration time.
     */
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired. Please try again.";
        err = new ErrorHandler(message, 400);
    }

    // Send a standardized error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
