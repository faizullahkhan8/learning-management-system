import Redis from "ioredis";
require("dotenv").config();

const redisClient = () => {
    // Ensure the REDIS_URL is defined in the environment variables
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error(
            "REDIS_URL is not defined in the environment variables"
        );
    }

    // Create a new Redis instance with options
    const redis = new Redis(redisUrl, {
        // Optional: Set a retry strategy for reconnecting
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000); // 50ms, 100ms, 150ms, etc. (max 2s)
            return delay;
        },
        // Optional: Set the connection timeout
        connectTimeout: 10000, // Timeout after 10 seconds
    });

    redis.on("connect", () => {
        console.log("Redis connected successfully");
    });

    redis.on("error", (error) => {
        console.error("Redis connection error:", error.message);
    });

    redis.on("close", () => {
        console.log("Redis connection closed");
    });

    return redis;
};

// Initialize the Redis client
export const redis = redisClient();
