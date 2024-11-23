import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Interface for Question Options
 */
export interface IQuestionOptions extends Document {
    user: object; // Should ideally define a proper user type or reference
    question: string;
    questionReplies?: IQuestionOptions[];
}

/**
 * Interface for Link Options
 */
export interface ILinkOptions extends Document {
    title: string;
    url: string;
}

/**
 * Interface for Course Data Options
 */
export interface ICourseDataOptions extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object; // Consider replacing with a proper interface
    videoLength: number; // Length in seconds or a specific format
    videoSection: string;
    videoPlayer: string;
    links: ILinkOptions[];
    suggestion: string;
    questions: IQuestionOptions[];
}

/**
 * Interface for Review Options
 */
export interface IReviewOptions extends Document {
    user: object; // Should ideally define a proper user type or reference
    rating: number;
    review: string;
    reviewReplies?: IQuestionOptions[];
}

/**
 * Interface for Course Options
 */
export interface ICourseOptions extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: {
        publicId: string;
        url: string;
    };
    tags: string[];
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReviewOptions[];
    courseData: ICourseDataOptions[];
    ratings?: number; // Aggregate ratings
    purchased?: number; // Purchase count
}

// Schema Definitions

/**
 * Schema for Reviews
 */
const reviewSchema = new Schema<IReviewOptions>({
    user: { type: Object, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    review: { type: String, required: true },
    reviewReplies: [Object],
});

/**
 * Schema for Links
 */
const linkSchema = new Schema<ILinkOptions>({
    title: { type: String, required: true },
    url: { type: String, required: true },
});

/**
 * Schema for Questions
 */
const questionSchema = new Schema<IQuestionOptions>({
    user: { type: Object, required: true },
    question: { type: String, required: true },
    questionReplies: [Object], // Recursive schema reference
});

/**
 * Schema for Course Data
 */
const courseDataSchema = new Schema<ICourseDataOptions>({
    videoUrl: { type: String, required: true },
    title: { type: String, required: true },
    videoSection: { type: String, required: true },
    videoLength: { type: Number, required: true },
    description: { type: String, required: true },
    videoPlayer: { type: String, required: true },
    videoThumbnail: { type: Object, required: true },
    links: [linkSchema],
    suggestion: { type: String },
    questions: [questionSchema],
});

/**
 * Schema for Courses
 */
const courseSchema = new Schema<ICourseOptions>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatedPrice: { type: Number },
    thumbnail: {
        publicId: { type: String, required: true }, // Uncomment for Cloudinary integration
        url: { type: String, required: true }, // Uncomment for Cloudinary integration
    },
    tags: { type: [String], required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [{ title: { type: String, required: true } }],
    prerequisites: [{ title: { type: String, required: true } }], // Fixed typo
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
});

/**
 * Model for Courses
 */
const courseModel: Model<ICourseOptions> = mongoose.model(
    "Course",
    courseSchema
);

export default courseModel;
