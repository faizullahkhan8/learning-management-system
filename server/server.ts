// MODULE IMPORTS
require("dotenv").config();
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app";
import connectDB from "./utils/db";

// CLOUDINARY CONFIG
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });

// CREATE SERVER
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is connected with port ${process.env.PORT || 8000}`);
    connectDB();
});
