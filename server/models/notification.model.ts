import mongoose, { Schema, Model, Document } from "mongoose";

export interface INotification extends Document {
    user: string;
    message: string;
    title: string;
    status: string;
}

const NotificationSchema = new Schema<INotification>(
    {
        user: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["unread", "read"],
        },
    },
    {
        timestamps: true,
    }
);

const NotificationModel: Model<INotification> = mongoose.model(
    "Notification",
    NotificationSchema
);

export default NotificationModel;
