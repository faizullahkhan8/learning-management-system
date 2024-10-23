import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import courseModel from "../models/course.model";
import { IUser } from "../models/user.model";

interface ICreateOrder {
    // userId: string;
    courseId: string;
    payment_info: object;
}

export const createOrder = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { courseId, payment_info }: ICreateOrder = req.body;

            const user = req.user as IUser;

            if (!payment_info || courseId) {
                return next(
                    new ErrorHandler("Missing payment_info or courseId", 400)
                );
            }

            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return next(new ErrorHandler("Invalid mongoose id(s)", 403));
            }

            const isCourseAlreadyExists = user.courses.some(
                (item: any) => item._id.toStirng() === courseId
            );

            if (isCourseAlreadyExists) {
                return next(
                    new ErrorHandler(
                        "You have already purchesed this course",
                        400
                    )
                );
            }

            const course = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found!", 404));
            }

            const data: any = {
                courseId,
                userId: user._id,
            };

            createOrder(data, res, next);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
