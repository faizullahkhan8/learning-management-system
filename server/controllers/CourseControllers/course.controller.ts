import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../../middlewares/catchAsyncError";
import cloudinary from "cloudinary";
import {
    allCoursesService,
    createCourse,
} from "../../services/course.services";
import ErrorHandler from "../../utils/ErrorHandler";
import courseModel from "../../models/course.model";
// import { redis } from "../../utils/redis";

// UPLOAD COURSE
export const uploadCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            // UNCOMMENT IT WHEN INTERNET CONNECTION IS AVAILIBLE
            // const thumbnail = data.thumbnail;
            // if (thumbnail) {
            //     const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
            //         folder: "courses",
            //     });

            //     data.thumbnail = {
            //         public_id: myCloud.public_id,
            //         url: myCloud.url,
            //     };
            // }

            createCourse(data, res, next);
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// EDIT COURSE
export const editCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;

            // UNCOMMENT IT WHEN INTERNET CONNECTION IS THERE
            const thumbnail = data.thumbnail;

            if (thumbnail) {
                await cloudinary.v2.uploader.destroy(thumbnail.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.url,
                };
            }

            const courseId = req.params.id;
            const course = await courseModel.findByIdAndUpdate(
                courseId,
                { $set: data },
                { new: true }
            );

            res.status(201).json({
                success: true,
                course,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// get single course --without purchase
export const getSingleCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = req.params.id;

            // const isCacheExits = await redis.get(courseId);
            // if (isCacheExits) {
            //     const course = JSON.parse(isCacheExits);
            //     return res.status(200).json({
            //         success: true,
            //         course,
            //     });
            // } else {
            const course = await courseModel
                .findById(courseId)
                .select(
                    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
                );

            if (!course) {
                return next(new ErrorHandler("Course not found !", 404));
            }

            return res.status(200).json({
                success: true,
                course,
            });
            // } // => UCOMMENT THIS WHEN INTERNET CONNECTION IS AVAILIBLE
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// GET ALL COURSES --WITHOUT PURCHASE
export const getAllCourses = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const isCacheExits = await redis.get("allCourses");
            // if (isCacheExits) {
            //     const allCourses = JSON.parse(isCacheExits);
            //     return res.status(200).json({
            //         success: true,
            //         allCourses,
            //     });
            // } else {
            const allCourses = await courseModel
                .find()
                .select(
                    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
                );

            // await redis.set("allCourses", JSON.stringify(allCourses)); //  =>   UNCOMMENT IT WHEN INTERNET CONNECTION IS AVAILIBLE

            return res.status(200).json({
                success: true,
                allCourses,
            });
            // } //  =>   UNCOMMENT IT WHEN INTERNET CONNECTION IS AVAILIBLE
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// GET COURSE CONTENT ==> ONLY FOR VALID USER
export const getCourseByUser = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userCourseList = req.user.courses;
            const courseId = req.params.id;

            const courseExists = userCourseList?.find(
                (course: any) => course._id.toString() === courseId
            );

            if (!courseExists) {
                return next(
                    new ErrorHandler(
                        "You are not eligible to access this course",
                        404
                    )
                );
            }

            const course = await courseModel.findById(courseId);

            const contents = course?.courseData;

            return res.status(200).json({
                success: true,
                contents,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 400));
        }
    }
);

// all courses only for admin
export const getAllCoursesForAdmin = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await allCoursesService(res);
        } catch (error: any) {
            console.log("[ERROR IN GET ALL USER] :", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const deleteCourse = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courseId = req.params.id;

            if (courseId) {
                const dbCourse = await courseModel.findById(courseId);

                if (!dbCourse) {
                    return next(new ErrorHandler("Course not found.", 404));
                }

                await dbCourse.deleteOne();

                return res.status(200).json({
                    success: true,
                    message: "course deleted successfully.",
                });
            } else {
                return next(new ErrorHandler("CourseId not found.", 400));
            }
        } catch (error: any) {
            console.log("[ERROR IN DELETE COURSE] : %d", error.message);
            return next(new ErrorHandler(error.message, 500));
        }
    }
);
