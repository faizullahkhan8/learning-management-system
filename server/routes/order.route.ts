import { Router } from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const router = Router();

/**
 * Route to create a new order.
 * Accessible only to authenticated users.
 */
router.post(
    "/create-order",
    isAuthenticated, // Ensure user is authenticated
    createOrder // Controller to handle order creation
);

/**
 * Route to get all orders for admin users.
 * Accessible only to authenticated admin users.
 */
router.get(
    "/get-for-admin/all",
    isAuthenticated, // Ensure user is authenticated
    authorizeRole("admin"), // Ensure user has admin role
    getAllOrders // Controller to fetch all orders
);

export default router;
