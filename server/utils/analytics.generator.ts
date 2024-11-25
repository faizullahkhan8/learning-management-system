import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: number;
}

/**
 * Generates the last 12 months' data based on the `createdAt` field.
 * @param model - The Mongoose model to query.
 * @returns The data for the last 12 months, including counts of documents per month.
 */
export async function generateLast12MonthsData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();

    // Loop through the last 12 months (from the current month)
    for (let i = 11; i >= 0; i--) {
        // Create a new date object for the start of the current month
        const endDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            0
        ); // 0 gets the last day of the previous month
        const startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1
        ); // 1 sets the first day of the month

        // Format the month and year for display (e.g., "Nov 2024")
        const monthYear = endDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });

        try {
            // Count documents created within the start and end dates
            const count = await model.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate,
                },
            });

            last12Months.push({ month: monthYear, count });
        } catch (error) {
            console.error("Error fetching document count:", error);
            // Optionally, you can return a failure object or an empty count
            last12Months.push({ month: monthYear, count: 0 });
        }
    }

    return { last12Months };
}
