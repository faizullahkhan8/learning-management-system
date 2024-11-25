import { NextFunction, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import OrderModel from "../models/order.model";

/**
 * Controller to create a new order.
 * Wrapped with CatchAsyncError for automatic error handling.
 */
export const newOrder = CatchAsyncError(
    async (data: any, res: Response, next: NextFunction) => {
        // Create a new order in the database using the provided data
        const order = await OrderModel.create(data);

        // Respond with the newly created order
        return res.status(201).json({
            success: true,
            order,
        });
    }
);

/**
 * Service to fetch all orders from the database, sorted by creation date (latest first).
 * Provides pagination and response structure.
 */
export const allOrdersService = async (res: Response) => {
    // Fetch all orders from the database and sort by creation date
    const allOrders = await OrderModel.find().sort({ createdAt: -1 });

    // Respond with the orders and total count
    return res.status(200).json({
        success: true,
        ordersLen: allOrders.length,
        orders: allOrders,
    });
};
