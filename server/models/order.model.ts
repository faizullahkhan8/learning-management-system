import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Interface for Order
 */
export interface IOrder extends Document {
    userId: string; // ID of the user placing the order
    courseId: string; // ID of the course being purchased
    payment_info: Record<string, unknown>; // Payment details (use specific structure if known)
}

/**
 * Schema for Order
 */
const OrderSchema = new Schema<IOrder>(
    {
        userId: {
            type: String,
            required: true, // User ID is mandatory
        },
        courseId: {
            type: String,
            required: true, // Course ID is mandatory
        },
        payment_info: {
            type: Object,
            required: true, // Payment details are mandatory
            default: {}, // Default to an empty object if not provided
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

/**
 * Model for Order
 */
const OrderModel: Model<IOrder> = mongoose.model("Order", OrderSchema);

export default OrderModel;
