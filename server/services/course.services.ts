import { Response } from "express";
import CourseModel from "../models/course.model";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import courseModel from "../models/course.model";

export const createCourse = CatchAsyncError(
    async (data: any, res: Response) => {
        const course = await courseModel.create(data);
        res.status(201).json({
            success: true,
            course,
        });
    }
);

export const allCoursesService = async (res: Response) => {
    const allCourses = await CourseModel.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        courseLen: allCourses.length,
        courses: allCourses,
    });
};
