import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import OrderModel from "../models/order.model";

export const newOrder = CatchAsyncError(
    async (data: any, res: Response, next: NextFunction) => {
        const order = await OrderModel.create(data);

        res.status(201).json({
            success: true,
            order,
        });
    }
);

export const allOrdersService = async (res: Response) => {
    const allOrders = await OrderModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        ordersLen: allOrders.length,
        orders: allOrders,
    });
};
