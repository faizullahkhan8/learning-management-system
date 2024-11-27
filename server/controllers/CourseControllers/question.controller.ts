import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cron from "node-cron";

import { CatchAsyncError } from "../../middlewares/catchAsyncError";
import courseModel from "../../models/course.model";
import userModel from "../../models/user.model";
import NotificationModel from "../../models/notification.model";
import ErrorHandler from "../../utils/ErrorHandler";
import sendMail from "../../utils/sendMaills";

// Utility functions
const isValidObjectId = (id: string): boolean =>
    mongoose.Types.ObjectId.isValid(id);

const findCourseContent = async (
    courseId: string,
    contentId: string,
    next: NextFunction
) => {
    if (!isValidObjectId(courseId) || !isValidObjectId(contentId)) {
        return next(new ErrorHandler("Invalid course or content ID(s)", 400));
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    const courseContent = course.courseData?.find((item: any) =>
        item._id.equals(contentId)
    );
    if (!courseContent) {
        return next(new ErrorHandler("Course content not found", 404));
    }

    return { course, courseContent };
};

const isAuthorized = (userId: string, questionUserId: string, role: string) =>
    userId === questionUserId || role === "admin";

// Handlers

// Ask a Question
export const askQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                question,
                courseId,
                contentId,
            }: { question: string; courseId: string; contentId: string } =
                req.body;

            if (!question)
                return next(new ErrorHandler("Question is required", 400));

            const { course, courseContent }: any = await findCourseContent(
                courseId,
                contentId,
                next
            );

            const newQuestion: any = {
                user: req.user._id,
                question,
                replies: [],
            };

            courseContent.questions.push(newQuestion);

            await NotificationModel.create({
                user: req.user._id,
                title: "New Question",
                message: `You have a new question in course: ${course.name}, content: ${courseContent.title}`,
            });

            await course.save();

            return res.status(201).json({ success: true, course });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Delete a Question
export const deleteQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                questionId,
                courseId,
                contentId,
            }: { questionId: string; courseId: string; contentId: string } =
                req.body;

            if (!isValidObjectId(questionId))
                return next(new ErrorHandler("Invalid question ID", 400));

            const { course, courseContent }: any = await findCourseContent(
                courseId,
                contentId,
                next
            );

            const questionIndex = courseContent.questions.findIndex((q: any) =>
                q._id.equals(questionId)
            );

            if (questionIndex === -1) {
                return next(new ErrorHandler("Question not found", 404));
            }

            const question = courseContent.questions[questionIndex];
            const userId: any = req.user._id;

            if (
                !isAuthorized(userId, question.user.toString(), req.user.role)
            ) {
                return next(
                    new ErrorHandler(
                        "You are not authorized to delete this question",
                        403
                    )
                );
            }

            courseContent.questions.splice(questionIndex, 1);
            await course.save();

            return res.status(200).json({ success: true, course });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Edit a Question
export const editQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                questionId,
                courseId,
                contentId,
                question,
            }: {
                questionId: string;
                courseId: string;
                contentId: string;
                question: string;
            } = req.body;

            if (!question)
                return next(new ErrorHandler("Question is required", 400));

            const { course, courseContent }: any = await findCourseContent(
                courseId,
                contentId,
                next
            );

            const courseContentQuestion = courseContent.questions.find(
                (q: any) => q._id.equals(questionId)
            );

            if (!courseContentQuestion) {
                return next(new ErrorHandler("Question not found", 404));
            }

            const userId: any = req.user._id;

            if (
                !isAuthorized(
                    userId,
                    courseContentQuestion.user.toString(),
                    req.user.role
                )
            ) {
                return next(
                    new ErrorHandler(
                        "You are not authorized to edit this question",
                        403
                    )
                );
            }

            courseContentQuestion.question = question;
            await course.save();

            return res.status(200).json({ success: true, course });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Add a Reply
export const addQuestionReply = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                answer,
                courseId,
                contentId,
                questionId,
            }: {
                answer: string;
                courseId: string;
                contentId: string;
                questionId: string;
            } = req.body;

            if (!answer)
                return next(new ErrorHandler("Answer is required", 400));

            const { course, courseContent }: any = await findCourseContent(
                courseId,
                contentId,
                next
            );

            const question = courseContent.questions.find((q: any) =>
                q._id.equals(questionId)
            );

            if (!question) {
                return next(new ErrorHandler("Question not found", 404));
            }

            const newReply = { user: req.user._id, answer };
            question.replies.push(newReply);

            const questionUser = await userModel.findById(question.user);

            await course.save();

            if (req.user?._id === questionUser?._id) {
                await NotificationModel.create({
                    user: req.user._id,
                    title: "New Question Reply",
                    message: `You have a new question reply in course: ${course.name}, content: ${courseContent.title}`,
                });
            } else {
                const data = {
                    name: questionUser?.name,
                    title: courseContent.title,
                };

                try {
                    if (questionUser?.email) {
                        await sendMail({
                            data,
                            template: "questionReply.email.ejs",
                            subject: `New reply to your question in ${courseContent.title}`,
                            email: questionUser.email,
                        });
                    }
                } catch (error: any) {
                    return next(new ErrorHandler(error.message, 500));
                }
            }

            return res.status(201).json({ success: true, course });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Auto-delete Notifications
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await NotificationModel.deleteMany({
        status: "read",
        createdAt: { $lte: thirtyDaysAgo },
    });
});
