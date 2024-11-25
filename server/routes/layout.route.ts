import express from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import {
    createLayout,
    deleteLayout,
    editLayout,
    getLayout,
} from "../controllers/layout.controller";

const router = express.Router();

router.post("/create", isAuthenticated, authorizeRole("admin"), createLayout);
router.put("/edit", isAuthenticated, authorizeRole("admin"), editLayout);
router.delete("/delete", isAuthenticated, authorizeRole("admin"), deleteLayout);
router.get("/get", isAuthenticated, authorizeRole("admin"), getLayout);

export default router;
