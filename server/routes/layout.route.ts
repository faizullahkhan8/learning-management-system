import express from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    createLayout,
    deleteLayout,
    editLayout,
    getLayout,
} from "../controllers/layout.controller";

const router = express.Router();

/**
 * Route to create a new layout.
 * Only accessible by authenticated admin users.
 */
router.post(
    "/create",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    createLayout // Controller to handle layout creation
);

/**
 * Route to edit an existing layout.
 * Only accessible by authenticated admin users.
 */
router.put(
    "/edit",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    editLayout // Controller to handle layout editing
);

/**
 * Route to delete a layout.
 * Only accessible by authenticated admin users.
 */
router.delete(
    "/delete",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    deleteLayout // Controller to handle layout deletion
);

/**
 * Route to get layout information.
 * Only accessible by authenticated admin users.
 */
router.get(
    "/get",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    getLayout // Controller to handle layout retrieval
);

export default router;
