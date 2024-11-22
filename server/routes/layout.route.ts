import express from "express";
import { authorizeRole, isAuthenticated } from "../middlewares/auth";
import { createLayout, editLayout } from "../controllers/layout.controller";

const router = express.Router();

router.post("/create", isAuthenticated, authorizeRole("admin"), createLayout);
router.put("/edit", isAuthenticated, authorizeRole("admin"), editLayout);

export default router;
