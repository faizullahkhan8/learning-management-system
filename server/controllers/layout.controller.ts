import { Request, Response, NextFunction } from "express";

import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middlewares/catchAsyncError";

import cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";

export const createLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const type = req.query.type;

            if (await LayoutModel.findOne({ type })) {
                return next(new ErrorHandler(`${type} already exits.`, 400));
            }

            if (type === "BANNER") {
                const { image, title, subTitle } = req.body;

                if (!image || !title || !subTitle) {
                    return next(
                        new ErrorHandler("In-complete Banner data", 400)
                    );
                }

                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });

                const banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                };

                await LayoutModel.create({ type, banner });
            }

            if (type === "FAQ") {
                const { faq } = req.body;

                if (!faq) {
                    return next(new ErrorHandler("FAQ is missing.", 400));
                }

                await LayoutModel.create({ type, faq });
            }

            if (type === "CATEGORY") {
                const { categories } = req.body;

                if (!categories) {
                    return next(new ErrorHandler("CATEGORY is missing.", 400));
                }

                await LayoutModel.create({
                    type,
                    categories,
                });
            }

            res.status(200).json({
                success: true,
                message: `${type} created successfully`,
            });
        } catch (error: any) {
            console.log("ERROR IN CREATE CREATE LAYOUT :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const editLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const type = req.query.type;

            if (type === "BANNER") {
                const dbBanner: any = await LayoutModel.findOne({ type });
                if (!dbBanner) {
                    return next(new ErrorHandler("Banner not found!", 404));
                }

                await cloudinary.v2.uploader.destroy(dbBanner.banner.public_id);

                const { title, subTitle, image } = req.body;

                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });

                const banner = {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                };

                dbBanner.banner = banner;
                await dbBanner.save({ validateModifiedOnly: true });
            }

            if (type === "FAQ") {
                const faqId = req.query.faqId;

                const { question, answer } = req.body;

                console.log(question, answer);

                const faqDoc = await LayoutModel.findOne({ type });

                if (!faqDoc) {
                    return res.status(404).json({ message: "FAQ not found" });
                }

                // Find the FAQ item within the array by its unique faqId
                const faqItem = faqDoc.faq.find(
                    (faq) => faq._id?.toString() === faqId
                );

                if (!faqItem) {
                    return res
                        .status(404)
                        .json({ message: "FAQ question not found" });
                }

                // Update the question and answer if provided
                // faqItem.question = question || faqItem.question;
                // faqItem.answer = answer || faqItem.answer;

                console.log(question, answer);

                const dbLayout = await LayoutModel.findOneAndUpdate(
                    { _id: faqDoc._id, "faq._id": faqItem._id },
                    {
                        $set: {
                            ...(question && { "faq.$.question": question }),
                            ...(answer && { "faq.$.answer": answer }),
                        },
                    },
                    {
                        new: true,
                    }
                );

                // // Save the updated FAQ document
                // await faqDoc.save();
            }

            if (type === "CATEGORY") {
                const dbCategory = await LayoutModel.findOne({ type });

                if (!dbCategory) {
                    return next(new ErrorHandler("FAQ not found!", 404));
                }

                const { categories } = req.body;

                await LayoutModel.findByIdAndUpdate(dbCategory._id, {
                    categories,
                });
            }

            return res.status(201).json({
                success: true,
                message: `${type} is updated`,
            });
        } catch (error: any) {
            console.log("ERROR IN EDIT LAYOUT :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
