import { Router } from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    getAllNotification,
    updateNotification,
} from "../controllers/notification.controller";

const router = Router();

router.get(
    "/get-all",
    isAuthenticated,
    authorizeRole("admin"),
    getAllNotification
);

router.put(
    "/update/:id",
    isAuthenticated,
    authorizeRole("admin"),
    updateNotification
);

export default router;
