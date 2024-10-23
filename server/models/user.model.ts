require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            // validate: {
            //     validator: function (value: string) {
            //         return EMAIL_REGEX_PATTERN.test(value);
            //     },
            //     message: "Please enter a valid email",
            // },
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        courses: [{ courseId: String }],
    },
    { timestamps: true }
);

// HASH PASSWORD
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<Boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

// SIGN ACCESS TOKEN
userSchema.methods.SignAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET || "", {
        expiresIn: "15m",
    });
};

// SIGN REFRESH TOKEN
userSchema.methods.SignRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET || "", {
        expiresIn: "3d",
    });
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
