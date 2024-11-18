import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middlewares/catchAsyncError";
import courseModel from "../../models/course.model";
import mongoose from "mongoose";
import ErrorHandler from "../../utils/ErrorHandler";
import userModel from "../../models/user.model";
import sendMail from "../../utils/sendMaills";
import NotificationModel from "../../models/notification.model";
import cron from "node-cron";

// ask question in course
interface IAskQuestion {
    question: string;
    courseId: string;
    contentId: string;
}

export const askQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { question, courseId, contentId }: IAskQuestion = req.body;
            const course = await courseModel.findById(courseId);

            if (
                !mongoose.Types.ObjectId.isValid(contentId) ||
                !mongoose.Types.ObjectId.isValid(courseId)
            ) {
                return next(
                    new ErrorHandler("Invalid course content id(s)", 404)
                );
            }

            if (!question) {
                return next(new ErrorHandler("Question is required", 400));
            }

            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            );

            if (!courseContent) {
                return next(new ErrorHandler("Invalid course content id", 404));
            }

            const newQuestion: any = {
                user: req.user._id,
                question,
                replies: [],
            };

            // push the asked question to the course content
            courseContent.questions.push(newQuestion);

            await NotificationModel.create({
                user: req.user._id,
                title: "New Question",
                message: `You have a new question in course:${course?.name} , course content:${courseContent.title}`,
            });

            // save the course model
            await course?.save();

            // send response to the client
            return res.status(201).json({
                sucess: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// delete question if admin or question user
interface IDeleteQuestion {
    questionId: string;
    courseId: string;
    contentId: string;
}

export const deleteQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { questionId, courseId, contentId }: IDeleteQuestion =
                req.body;

            if (
                !mongoose.Types.ObjectId.isValid(courseId) ||
                !mongoose.Types.ObjectId.isValid(contentId) ||
                !mongoose.Types.ObjectId.isValid(questionId)
            ) {
                return next(new ErrorHandler("Invalid mongoose id(s)", 500));
            }

            const course = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            );

            if (!courseContent) {
                return next(new ErrorHandler("Invalid course content id", 404));
            }

            const question = courseContent.questions.find((q: any) =>
                q._id.equals(questionId)
            );

            if (!question) {
                return next(new ErrorHandler("Question not found", 404));
            }

            // check if the user is admin or the question user

            const userId = req.user.id.toString();

            if (
                userId !== question?.user.toString() &&
                req.user.role !== "admin"
            ) {
                return next(
                    new ErrorHandler(
                        "You are not authorized to delete this question",
                        403
                    )
                );
            }

            const questionIndex = courseContent.questions.findIndex(
                (question: any) => question._id.toString() === questionId
            );

            courseContent.questions.splice(questionIndex, 1);

            await course.save();

            return res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// edit question
interface IEditQuestion {
    courseId: string;
    contentId: string;
    questionId: string;
    question: string;
}

export const editQuestion = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { contentId, courseId, question, questionId }: IEditQuestion =
                req.body;

            if (
                !mongoose.Types.ObjectId.isValid(courseId) ||
                !mongoose.Types.ObjectId.isValid(contentId) ||
                !mongoose.Types.ObjectId.isValid(questionId)
            ) {
                return next(new ErrorHandler("Invalid mongoose id(s)", 403));
            }

            if (!question) {
                return next(new ErrorHandler("Question is required", 403));
            }

            const course = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found!", 404));
            }

            const courseContent = course.courseData.find((item: any) =>
                item._id.equals(contentId)
            );

            if (!courseContent) {
                return next(new ErrorHandler("Course content not found!", 404));
            }

            const courseContentQuestion = courseContent?.questions.find(
                (item: any) => item._id.equals(questionId)
            );

            if (!courseContentQuestion) {
                return next(new ErrorHandler("Question not found!", 404));
            }

            const userId = req.user.id.toString();

            if (userId !== courseContentQuestion.user.toString()) {
                return next(
                    new ErrorHandler(
                        "You are not authorized to edit this question",
                        403
                    )
                );
            }

            courseContentQuestion.question = question;

            await course.save();

            return res.status(200).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Replies to the question
interface IQuestionReply {
    answer: string;
    contentId: string;
    questionId: string;
    courseId: string;
}

export const addQuestionReply = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { answer, contentId, questionId, courseId }: IQuestionReply =
                req.body;

            if (
                !mongoose.Types.ObjectId.isValid(courseId) ||
                !mongoose.Types.ObjectId.isValid(contentId) ||
                !mongoose.Types.ObjectId.isValid(questionId)
            ) {
                return next(new ErrorHandler("Invalid mongoose id", 500));
            }

            const course = await courseModel.findById(courseId);

            if (!course) {
                return next(new ErrorHandler("Course not found", 404));
            }

            const courseContent = course?.courseData?.find((item: any) =>
                item._id.equals(contentId)
            );

            if (!courseContent) {
                return next(new ErrorHandler("Content not found", 404));
            }

            const question = courseContent.questions.find((item: any) =>
                item?._id.equals(questionId)
            );

            if (!question) {
                return next(new ErrorHandler("Question not found", 404));
            }

            const newQuestionReply: any = {
                user: req.user._id,
                answer,
            };

            if (question.questionReplies) {
                question.questionReplies.push(newQuestionReply);
            }

            const questionUser = await userModel.findById(question.user);

            await course.save();

            if (req.user?._id === questionUser?._id) {
                await NotificationModel.create({
                    user: req.user._id,
                    title: "New Question Reply",
                    message: `You have a new question reply in course: ${course.name}, course content: ${courseContent.title}`,
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

            return res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// AUTO DELETE READ NOTIFICATIONS OF 30 DAYS OLD
cron.schedule(
    "0 0 0 * * *",
    CatchAsyncError(async () => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        await NotificationModel.deleteMany({
            status: "read",
            createdAt: { $lte: thirtyDaysAgo },
        });
    })
);
