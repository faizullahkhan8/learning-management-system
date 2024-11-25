import mongoose from "mongoose";
require("dotenv").config();

// Fetching DB URI from environment variables
const dbUrl: string = process.env.DB_URI || "";

if (!dbUrl) {
    console.error("Database URI is not defined in environment variables!");
    process.exit(1); // Exiting the process if the DB URI is not found
}

let retries = 5; // Set the number of retries if the DB connection fails

const connectDB = async () => {
    try {
        // Attempting to connect to the database
        await mongoose.connect(dbUrl).then(() => {
            console.log("Database connected successfully");
        });
    } catch (error: any) {
        console.error(`Database connection failed: ${error.message}`);

        if (retries > 0) {
            retries -= 1;
            console.log(`Retrying in 5 seconds... (${retries} attempts left)`);
            setTimeout(connectDB, 5000); // Retry connection after 5 seconds
        } else {
            console.error("Max retries reached. Exiting application.");
            process.exit(1); // Exit the process if maximum retries are reached
        }
    }
};

export default connectDB;
