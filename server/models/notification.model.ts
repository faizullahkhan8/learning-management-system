import mongoose, { Schema, Model, Document } from "mongoose";

/**
 * Interface for Notification
 */
export interface INotification extends Document {
    user: string; // Reference to the user (user ID or username)
    message: string; // Notification message
    title: string; // Notification title
    status: string; // Status of the notification ("unread" or "read")
}

/**
 * Schema for Notification
 */
const NotificationSchema = new Schema<INotification>(
    {
        user: {
            type: String,
            required: true, // User ID or reference is mandatory
        },
        message: {
            type: String,
            required: true, // Notification message is mandatory
        },
        title: {
            type: String,
            required: true, // Notification title is mandatory
        },
        status: {
            type: String,
            required: true, // Status is mandatory
            enum: ["unread", "read"], // Only "unread" and "read" are allowed
            default: "unread", // Default status is "unread"
        },
    },
    {
        timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
    }
);

/**
 * Model for Notification
 */
const NotificationModel: Model<INotification> = mongoose.model(
    "Notification",
    NotificationSchema
);

export default NotificationModel;
