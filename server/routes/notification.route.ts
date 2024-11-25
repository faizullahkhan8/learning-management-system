import { Router } from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    getAllNotification,
    updateNotification,
} from "../controllers/notification.controller";

const router = Router();

/**
 * Route to get all notifications.
 * Only accessible by authenticated admin users.
 */
router.get(
    "/get-all",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    getAllNotification // Controller to fetch all notifications
);

/**
 * Route to update a specific notification by its ID.
 * Only accessible by authenticated admin users.
 */
router.put(
    "/update/:id",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    updateNotification // Controller to update a notification
);

export default router;
