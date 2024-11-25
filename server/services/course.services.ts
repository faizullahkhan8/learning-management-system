import { Response } from "express";
import CourseModel from "../models/course.model"; // Correct the redundant import of courseModel
import { CatchAsyncError } from "../middlewares/catchAsyncError";

/**
 * Controller to create a new course.
 * Wrapped with CatchAsyncError for automatic error handling.
 */
export const createCourse = CatchAsyncError(
    async (data: any, res: Response) => {
        // Create a new course in the database using the provided data
        const course = await CourseModel.create(data);

        // Respond with the newly created course
        return res.status(201).json({
            success: true,
            course,
        });
    }
);

/**
 * Service to fetch all courses from the database, sorted by creation date (latest first).
 * Provides pagination and response structure.
 */
export const allCoursesService = async (res: Response) => {
    try {
        // Fetch all courses and sort by creation date
        const allCourses = await CourseModel.find({}).sort({ createdAt: -1 });

        // Respond with the courses and total count
        return res.status(200).json({
            success: true,
            courseLen: allCourses.length,
            courses: allCourses,
        });
    } catch (error) {
        // Handle any unexpected errors (e.g., database connection issues)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
        });
    }
};
