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

                console.log(question, answer);

                await LayoutModel.findOneAndUpdate(
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

export const deleteLayout = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.query;

            if (type === "CATEGORY") {
                const clientCategory = req.query.category;

                const categoryDoc = await LayoutModel.findOne({
                    type: "CATEGORY",
                });

                if (!categoryDoc) {
                    return next(
                        new ErrorHandler("Category document not found", 404)
                    );
                }

                // is the deleting category exists or not
                const categoryExists = categoryDoc.categories.some(
                    (category: any) => category.title === clientCategory
                );

                if (!categoryExists) {
                    return next(
                        new ErrorHandler("Category does not exist", 404)
                    );
                }

                // delete the category
                categoryDoc.categories = categoryDoc.categories.filter(
                    (category: any) => category.title !== clientCategory
                );

                // save the category document
                await categoryDoc.save();
            }

            if (type === "FAQ") {
                const faqId = req.query.faqId;

                console.log(faqId);

                const faqDoc = await LayoutModel.findOne({ type });

                if (!faqDoc) {
                    return next(new ErrorHandler("FAQ not found", 404));
                }

                // Find the FAQ item within the array by its unique faqId
                const faqItemIdx = faqDoc.faq.findIndex(
                    (faqQuestion: any) => faqQuestion._id.toString() === faqId
                );

                if (faqItemIdx === -1) {
                    return next(
                        new ErrorHandler("FAQ Question not found", 404)
                    );
                }

                faqDoc.faq.splice(faqItemIdx, 1);

                await faqDoc.save();
            }

            return res.status(200).json({
                success: true,
                message: `${type} deleted`,
            });
        } catch (error: any) {
            console.log("ERROR IN DELETE LAYOUT :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
