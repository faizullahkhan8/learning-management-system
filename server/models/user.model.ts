require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Interface for User Document
 */
export interface IUser extends Document {
    name: string; // User's name
    email: string; // User's email
    password: string; // User's hashed password
    avatar: {
        public_id: string; // Public ID for the avatar in cloud storage
        url: string; // URL for the avatar
    };
    role: string; // User's role (e.g., "user", "admin")
    isVerified: boolean; // Email verification status
    courses: Array<{ courseId: string }>; // List of enrolled course IDs
    comparePassword: (password: string) => Promise<boolean>; // Method to compare entered password with hashed password
    SignAccessToken: () => string; // Method to sign an access token
    SignRefreshToken: () => string; // Method to sign a refresh token
}

/**
 * User Schema Definition
 */
const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true, // Ensure email uniqueness
            // lowercase: true, // Normalize email to lowercase
            validate: {
                validator: (value: string) =>
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email regex validation
                message: "Please enter a valid email",
            },
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            select: false, // Prevent password from being returned in queries by default
        },
        avatar: {
            public_id: {
                type: String,
                default: "", // Default empty string for public_id
            },
            url: {
                type: String,
                default: "", // Default empty string for URL
            },
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"], // Restrict role to specific values
        },
        isVerified: {
            type: Boolean,
            default: false, // Default email verification status
        },
        courses: [
            {
                courseId: { type: String, required: true }, // Ensure course ID is provided
            },
        ],
    },
    { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

/**
 * Pre-save Middleware: Hash Password
 */
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Instance Method: Compare Password
 */
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Instance Method: Sign Access Token
 */
userSchema.methods.SignAccessToken = function (): string {
    return jwt.sign(
        { id: this._id },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "15m" }
    );
};

/**
 * Instance Method: Sign Refresh Token
 */
userSchema.methods.SignRefreshToken = function (): string {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: "3d" }
    );
};

/**
 * User Model
 */
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
