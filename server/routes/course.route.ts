import express from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    deleteCourse,
    editCourse,
    getAllCourses,
    getAllCoursesForAdmin,
    getCourseByUser,
    getSingleCourse,
    uploadCourse,
} from "../controllers/CourseControllers/course.controller";
import {
    addQuestionReply,
    askQuestion,
    deleteQuestion,
    editQuestion,
} from "../controllers/CourseControllers/question.controller";
import {
    addCourseReview,
    addReviewReply,
} from "../controllers/CourseControllers/review.controller";

const router = express.Router();

/**
 * Route to create a new course. Only accessible to admin users.
 */
router.post("/create", isAuthenticated, authorizeRole("admin"), uploadCourse);

/**
 * Route to update an existing course. Only accessible to admin users.
 * Takes course ID as a URL parameter.
 */
router.put("/update/:id", isAuthenticated, authorizeRole("admin"), editCourse);

/**
 * Route to get a single course by its ID.
 * Accessible to all users (no authentication required).
 */
router.get("/get/:id", getSingleCourse);

/**
 * Route to get all available courses.
 * Accessible to all users (no authentication required).
 */
router.get("/get/all", getAllCourses);

/**
 * Route to get course content by the user.
 * Requires user authentication to ensure they are authorized.
 */
router.get("/get-content/valid/:id", isAuthenticated, getCourseByUser);

// [ QUESTIONS ROUTES ]

/**
 * Route to ask a question related to a course.
 * Accessible to authenticated users only.
 */
router.post("/question/create", isAuthenticated, askQuestion);

/**
 * Route to delete a question.
 * Accessible to authenticated users only.
 */
router.post("/question/delete", isAuthenticated, deleteQuestion);

/**
 * Route to edit a question.
 * Accessible to authenticated users only.
 */
router.put("/question/edit", isAuthenticated, editQuestion);

/**
 * Route to reply to a question.
 * Accessible to authenticated users only.
 */
router.post("/question/reply/create", isAuthenticated, addQuestionReply);

// [ REVIEW ROUTES ]

/**
 * Route to create a course review.
 * Accessible to authenticated users only.
 */
router.put("/review/create", isAuthenticated, addCourseReview);

/**
 * Route to reply to a course review.
 * Only accessible to admin users.
 */
router.put(
    "/review/reply/create",
    isAuthenticated,
    authorizeRole("admin"),
    addReviewReply
);

/**
 * Route to get all courses for admin users.
 * Accessible only by authenticated admin users.
 */
router.get(
    "/get-for-admin/all",
    isAuthenticated,
    authorizeRole("admin"),
    getAllCoursesForAdmin
);

/**
 * Route to delete a course by its ID.
 * Only accessible to admin users.
 */
router.delete(
    "/delete/:id",
    isAuthenticated,
    authorizeRole("admin"),
    deleteCourse
);

export default router;
