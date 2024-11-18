import { Router } from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    getCourseAnalytics,
    getUserAnalytics,
    getOrderAnalytics,
} from "../controllers/analytics.controller";

const router = Router();

router.get(
    "/users/get",
    isAuthenticated,
    authorizeRole("admin"),
    getUserAnalytics
);

router.get(
    "/courses/get",
    isAuthenticated,
    authorizeRole("admin"),
    getCourseAnalytics
);

router.get(
    "/orders/get",
    isAuthenticated,
    authorizeRole("admin"),
    getOrderAnalytics
);

export default router;
