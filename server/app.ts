import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// FILE IMPORTS
import { ErrorMiddleware } from "./middlewares/error.middleware";
import userRouter from "./routes/user.route";
import courseRoute from "./routes/course.route";
import ErrorHandler from "./utils/ErrorHandler";

// INSTANCES
export const app = express();

// DOT ENV CONFIGURATION
require("dotenv").config();

// BODY PARSER
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// COOKIE PARSER
app.use(cookieParser());

// CORS COFIGURATION
app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["POST", "GET", "DELETE", "PUT"],
    })
);

// ROUTES
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRoute);

// TESTING API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    return res
        .status(200)
        .json({ success: true, message: "API working successfully" });
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    return next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404));
});

app.use(ErrorMiddleware);