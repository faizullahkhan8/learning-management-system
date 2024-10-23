import { CatchAsyncError } from "../middlewares/catchAsyncError";
import { redis } from "../utils/redis";

// GET USER INFO
export const getUserById = CatchAsyncError(
    async (id: string, res: Response) => {
        const user = await redis.get(id);

        return res.status(200).json({
            success: true,
            user: JSON.stringify(user),
        });
    }
);
