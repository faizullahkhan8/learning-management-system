import { Router } from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    getCourseAnalytics,
    getUserAnalytics,
    getOrderAnalytics,
} from "../controllers/analytics.controller";

const router = Router();

/**
 * Route to get user analytics.
 * This is only accessible by authenticated admins.
 */
router.get(
    "/users/get",
    isAuthenticated, // Ensure the user is authenticated
    authorizeRole("admin"), // Only allow users with "admin" role
    getUserAnalytics // Controller function to handle the request
);

/**
 * Route to get course analytics.
 * This is only accessible by authenticated admins.
 */
router.get(
    "/courses/get",
    isAuthenticated, // Ensure the user is authenticated
    authorizeRole("admin"), // Only allow users with "admin" role
    getCourseAnalytics // Controller function to handle the request
);

/**
 * Route to get order analytics.
 * This is only accessible by authenticated admins.
 */
router.get(
    "/orders/get",
    isAuthenticated, // Ensure the user is authenticated
    authorizeRole("admin"), // Only allow users with "admin" role
    getOrderAnalytics // Controller function to handle the request
);

export default router;
