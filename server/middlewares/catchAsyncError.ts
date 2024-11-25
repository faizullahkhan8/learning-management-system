import { NextFunction, Request, Response } from "express";

/**
 * A utility to handle async errors in Express routes and middlewares.
 * It ensures unhandled errors in asynchronous functions are passed to the error handler.
 *
 * @param {Function} theFunc - The asynchronous function to wrap.
 * @returns {Function} A wrapped function that handles errors.
 */
export const CatchAsyncError = (
    theFunc: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(theFunc(req, res, next)).catch(next);
    };
};
