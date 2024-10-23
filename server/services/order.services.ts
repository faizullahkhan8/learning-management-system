import { NextFunction } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.model";

export const createOrder = CatchAsyncError(
    async (data: any, next: NextFunction) => {
        try {
            const order = await OrderModel.create(data);
            next(order);
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));
        }
    }
);
