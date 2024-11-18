import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get user analytics --> only admin
export const getUserAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await generateLast12MonthsData(userModel);

            return res.status(200).json({
                success: true,
                users,
            });
        } catch (error: any) {
            console.log("ERROR IN GET USER ANALYTICS :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get courses analytics --> only admin
export const getCourseAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await generateLast12MonthsData(courseModel);

            return res.status(200).json({
                success: true,
                courses,
            });
        } catch (error: any) {
            console.log("ERROR IN GET COURSES ANALYTICS :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get orders analytics --> only admin
export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await generateLast12MonthsData(OrderModel);

            return res.status(200).json({
                success: true,
                orders,
            });
        } catch (error: any) {
            console.log("ERROR IN GET ORDERS ANALYTICS :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
