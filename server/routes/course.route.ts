import express from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    editCourse,
    getAllCourses,
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

// NOTE => here all routes will have additional endPoint " course " because it is spcified in app.ts file

router.post("/create", isAuthenticated, authorizeRole("admin"), uploadCourse);
router.put("/update/:id", isAuthenticated, authorizeRole("admin"), editCourse);
router.get("/get/:id", getSingleCourse);
router.get("/get/all", getAllCourses);
router.get("/get-content/valid/:id", isAuthenticated, getCourseByUser);
// [ QUESTIONS ]
router.post("/question/create", isAuthenticated, askQuestion);
router.post("/question/delete", isAuthenticated, deleteQuestion);
router.put("/question/edit", isAuthenticated, editQuestion);
router.post("/question/reply/create", isAuthenticated, addQuestionReply);
// [ REVIEW ]
router.put("/review/create", isAuthenticated, addCourseReview);
router.put(
    "/review/reply/create",
    isAuthenticated,
    authorizeRole("admin"),
    addReviewReply
);

export default router;
