import { Router } from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";

const router = Router();

router.post("/create-order", isAuthenticated, createOrder);
router.get(
    "/get-for-admin/all",
    isAuthenticated,
    authorizeRole("admin"),
    getAllOrders
);

export default router;
