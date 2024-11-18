import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import mongoose from "mongoose";
import courseModel from "../models/course.model";
import { IUser } from "../models/user.model";
import { allOrdersService, newOrder } from "../services/order.services";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMaills";
import NotificationModel from "../models/notification.model";

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

            if (!courseId || !payment_info) {
                return next(
                    new ErrorHandler("Missing payment_info or courseId", 400)
                );
            }

            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return next(new ErrorHandler("Invalid mongoose id(s)", 403));
            }

            // if (user.courses.length > 0) {
            //     const isCourseAlreadyExists = user?.courses.some(
            //         (course: any) => course._id.toString() === courseId
            //     );
            //     if (isCourseAlreadyExists) {
            //         return next(
            //             new ErrorHandler(
            //                 "You have already purchesed this course",
            //                 400
            //             )
            //         );
            //     }
            // }

            const course: any = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found!", 404));
            }

            const data: any = {
                courseId,
                userId: user._id,
                payment_info,
            };

            // const mailData = {
            //     order: {
            //         _id: course._id.toString().slice(0, 6),
            //         name: course.name,
            //         price: course.price,
            //         date: new Date().toLocaleDateString("en-PK", {
            //             year: "numeric",
            //             month: "long",
            //             day: "numeric",
            //         }),
            //     },
            // };

            // try {
            //     if (user) {
            //         await sendMail({
            //             email: user.email,
            //             subject: "Order confirmation",
            //             template: "order.confirmation.email.ejs",
            //             data: mailData,
            //         });
            //     }
            // } catch (error: any) {
            //     return next(new ErrorHandler(error.message, 500));
            // }

            user.courses.push(course._id);

            await user.save();

            await NotificationModel.create({
                user: user._id,
                title: "New Order",
                message: `You have ordered the course ${course.name}`,
            });

            course.purchased = course.purchased + 1;

            await course.save({ validateModifiedOnly: true });

            newOrder(data, res, next);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const getAllOrders = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await allOrdersService(res);
        } catch (error: any) {
            console.log("[ERROR IN GET ALL ORDERS FOR ADMIN] :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
