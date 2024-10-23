// add course review

import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middlewares/catchAsyncError";
import ErrorHandler from "../../utils/ErrorHandler";
import courseModel, { IReviewOptions } from "../../models/course.model";
import mongoose from "mongoose";

interface IAddReview {
    review: string;
    rating: number;
}

export const addCourseReview = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { review, rating }: IAddReview = req.body;

            const courseId = req.params.courseId;

            // is user puchased the course
            const userCourseList = req?.user.courses;

            const isCourseExits = userCourseList.some(
                (course: any) => course._id.toString() === courseId.toString()
            );

            if (!isCourseExits) {
                return next(
                    new ErrorHandler(
                        "You are not eligible to add a review for this course",
                        403
                    )
                );
            }

            const course = await courseModel.findById(courseId);

            const newReview: IReviewOptions = {
                user: req.user._id as object,
                review: review,
                rating,
            };

            course?.reviews.push(newReview);

            let average = 0;

            if (course?.reviews) {
                if (course?.reviews.length > 0) {
                    course?.reviews.forEach((review: any) => {
                        average += review.rating;
                    });
                }

                average /= course?.reviews.length;

                course.rating = average;
            }

            let notification = {
                title: "New Review Notificaiton",
                message: `${req.user.name} has given a review on ${course?.name}`,
            };

            // create notification

            await course?.save();

            return res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// add reply to review

interface IAddReviewReply {
    courseId: string;
    reply: string;
}

export const addReviewReply = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { reply, courseId }: IAddReviewReply = req.body;

            const reviewId = req.params.reviewId;

            if (
                !mongoose.Types.ObjectId.isValid(courseId) ||
                !mongoose.Types.ObjectId.isValid(reviewId)
            ) {
                return next(new ErrorHandler("Invalid mongoose id", 500));
            }

            const course = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            const review = course?.reviews.find((item: any) =>
                item._id.equals(reviewId)
            );

            if (!review) {
                return next(new ErrorHandler("Review not found", 404));
            }

            if (!reply) {
                return next(new ErrorHandler("Reply cannot be empty", 400));
            }

            const newReviewReply: any = {
                user: req.user._id as mongoose.Types.ObjectId,
                commnet: reply,
            };

            review.reveiwReplies?.push(newReviewReply);

            await course.save();

            return res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
