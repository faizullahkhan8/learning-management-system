import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import NotificationModel from "../models/notification.model";

export const getAllNotification = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notifications = await NotificationModel.find({}).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                length: notifications.length,
                notifications,
            });
        } catch (error: any) {
            console.log("[ERROR IN GET ALL NOTIFICATION ] :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update notification status

export const updateNotification = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbNotification = await NotificationModel.findById(
                req.params.id
            );

            if (!dbNotification) {
                return next(new ErrorHandler("Notification not found.", 404));
            }

            dbNotification.status
                ? (dbNotification.status = "read")
                : dbNotification.status;

            await dbNotification.save({ validateModifiedOnly: true });

            return res.status(201).json({
                success: true,
                notification: dbNotification,
            });
        } catch (error: any) {
            console.log("[ERROR IN UPDATE NOTIFICATION :]", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
