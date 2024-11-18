require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import sendMail from "../utils/sendMaills";
import { sendToken } from "../utils/jwt";
import cloudinary from "cloudinary";
// import { redis } from "../utils/redis";
import { RedisKey } from "ioredis";
import {
    allUsersService,
    updateUserRoleService,
} from "../services/user.services";

// REGISTER USER

interface IRegisterationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const UserRegistration = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body as IRegisterationBody;

            if (!name || !email || !password) {
                return next(new ErrorHandler("In-complete data", 400));
            }

            const isEmailExists = await userModel.findOne({ email });

            if (isEmailExists) {
                return next(new ErrorHandler("Email already exist", 400));
            }

            const user: IRegisterationBody = {
                name,
                email,
                password,
            };

            const activationToken = createActivationToken(user);

            const activationCode = activationToken.activationCode;

            const data = { user: { name: user.name }, activationCode };

            console.log(activationToken, activationCode);

            try {
                // await sendMail({
                //     email: user.email,
                //     subject: "Activation your account",
                //     template: "activation.email.ejs",
                //     data,
                // });

                res.status(201).json({
                    success: true,
                    message: `Plase cheak your email ${user.email} to activate your account`,
                    activationToken: activationToken.token,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message, 400));
            }
        } catch (error: any) {
            next(error);
        }
    }
);

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET as Secret,
        {
            expiresIn: "5m",
        }
    );

    return { token, activationCode };
};

// ACTIVATE USE
interface IActivationRequest {
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { activation_token, activation_code } =
            req.body as IActivationRequest;

        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as { user: IUser; activationCode: string };

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const { name, email, password } = newUser.user;

        const isUserExists = await userModel.findOne({ email });

        if (isUserExists) {
            return next(new ErrorHandler("email already exists", 400));
        }

        const user = await userModel.create({
            name,
            email,
            password,
        });

        sendToken(user, 200, res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// LOGIN USER
interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body as ILoginRequest;

            if (!email || !password) {
                return next(
                    new ErrorHandler("Please enter email and password", 400)
                );
            }

            const user = await userModel.findOne({ email }).select("+password");

            if (!user) {
                return next(new ErrorHandler("Invalid email or password", 400));
            }

            const isPasswordMatch = await user.comparePassword(password);

            if (!isPasswordMatch) {
                return next(new ErrorHandler("Invalid email or password", 400));
            }

            sendToken(user, 200, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// LOGOUT USER
export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        // res.cookie("refresh_token", "", { maxAge: 1 });
        // res.cookie("access_token", "", { maxAge: 1 });

        // redis.del(req.user.id); //WHEN INTERNET CONNECTION IS AVAILIBLE

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
};

// UPDATE ACCESS TOKEN
export const updateAccessToken = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refresh_token } = req.cookies;

            const decoded = jwt.verify(
                refresh_token,
                process.env.REFRESH_TOKEN_SECRET as Secret
            ) as JwtPayload;

            if (!decoded) {
                return next(new ErrorHandler("Could't refresh token", 400));
            }

            const user = await userModel.findOne({ _id: decoded.id });
            // const user = await redis.get(decoded.id); // NOTE => TODO WHEN INTERNET CONNECTION IS THERE

            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            req.user = user;

            sendToken(user, 200, res);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// GET USER INFO
export const getUserInfo = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const user = await userModel.findById(userId);

            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// SOCIAL AUTH
interface ISocialAuth {
    email: string;
    name: string;
    avatar: string;
}

export const socialAuth = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name, avatar } = req.body as ISocialAuth;

            const user = await userModel.findOne({ email });

            if (!user) {
                const newUser = await userModel.create({ email, name, avatar });
                sendToken(newUser, 200, res);
            } else {
                sendToken(user, 200, res);
            }
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// UPDATE USER
interface IUpdateUserOptions {
    name: string;
    email: string;
}

export const updateUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email } = req.body as IUpdateUserOptions;

            const userId = req.user._id;

            const user = await userModel.findOne({ _id: userId });

            if (name && user) {
                user.name = name;
            }
            if (email && user) {
                const isEmailExists = await userModel.findOne({ email });
                if (isEmailExists) {
                    return next(new ErrorHandler("Email already exists", 400));
                }

                user.email = email;
            }

            await user?.save();

            // TODO WHEN INTERNET CONNECTION IS THERE
            // redis.set(userId as RedisKey, JSON.stringify(user));

            return res.status(201).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// UPDATE USER PASSWORD
interface IUpdatePasswordOptions {
    oldPassword: string;
    newPassword: string;
}

export const updateUserPassword = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { oldPassword, newPassword } =
                req.body as IUpdatePasswordOptions;

            if (!oldPassword || !newPassword) {
                return next(
                    new ErrorHandler("Enter old password and new password", 400)
                );
            }

            const user = await userModel
                .findById(req.user?._id)
                .select("+password");

            if (!user) {
                return next(new ErrorHandler("User not found !", 404));
            }

            const isPasswordMatch = await user?.comparePassword(oldPassword);

            if (!isPasswordMatch) {
                return next(
                    new ErrorHandler("Invalid password try again", 401)
                );
            }

            user.password = newPassword;

            user?.save();

            return res.status(201).json({
                success: true,
                message: "Password changed successfully",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// UPDATE USER PROFILE PICTURE
interface IUserProfilePictureOptions {
    avatar: string;
}

export const updateUserProfilePicture = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { avatar } = req.body as IUserProfilePictureOptions;

            if (!avatar) {
                return next(
                    new ErrorHandler("Please provide a profile picture!", 404)
                );
            }

            const user = await userModel.findById(req.user?._id);

            if (!user) {
                return next(new ErrorHandler("User not found !", 404));
            }

            // if (user?.avatar?.public_id) {
            //     await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

            //     const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            //         folder: "avatars",
            //         width: 150,
            //     });

            //     user.avatar = {
            //         public_id: myCloud.public_id,
            //         url: myCloud.url,
            //     };
            // } else {
            //     const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            //         folder: "avatars",
            //         width: 300,
            //         transformation: {
            //             crop: "scale",
            //         },
            //     });

            //     user.avatar = {
            //         public_id: myCloud.public_id,
            //         url: myCloud.url,
            //     };
            // }

            await user.save();

            // await redis.set(user._id as RedisKey, JSON.stringify(user)); //TODO => UNCOMMENT IT WHEN INTERNET CONNECTION IS THERE

            return res.status(200).json({
                success: true,
                user,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// all users only for admin
export const getAllUsers = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await allUsersService(res);
        } catch (error: any) {
            console.log("[ERROR IN GET ALL USER] :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// update user role only for admin
export const updateUserRole = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { _id, role } = req.body;

            await updateUserRoleService(res, _id, role);
        } catch (error: any) {
            console.log("[ ERROR IN UPDATE USER ROLE ] :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const deleteUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;

            if (userId === req.user?._id?.toString()) {
                return next(
                    new ErrorHandler("You'r trying to delete yourself", 400)
                );
            }

            const dbUser = await userModel.findById(userId);

            if (!dbUser) {
                return next(new ErrorHandler("User not found.", 404));
            }

            await dbUser.deleteOne();

            return res.status(200).json({
                success: true,
                message: "User deleted successfully.",
            });
        } catch (error: any) {
            console.log("[ ERROR IN DELETE USER ] :", error.message);
        }
    }
);
