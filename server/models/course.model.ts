import mongoose, { Document, Schema, Model } from "mongoose";

export interface IQuestionOptions extends Document {
    user: object;
    question: string;
    questionReplies?: IQuestionOptions[];
}

export interface ICourseOptions extends Document {
    user: object;
    rating: number;
    comment: string;
    commentReplies?: IQuestionOptions;
}

export interface IReviewOptions {
    user: object;
    rating: number;
    review: string;
    reveiwReplies?: IQuestionOptions[];
}

export interface ILinkOptions extends Document {
    title: string;
    url: string;
}

export interface ICourseDataOpitons extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoLength: number;
    videoSection: string;
    videoPlayer: string;
    links: ILinkOptions;
    suggestion: string;
    questions: IQuestionOptions[];
}

export interface ICourseOptions extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequiesites: { title: string }[];
    reviews: IReviewOptions[];
    courseData: ICourseDataOpitons[];
    ratings?: number;
    purchased?: number;
}

const reviewSchema = new Schema<IReviewOptions>({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    review: String,
    reveiwReplies: [Object],
});

const linkSchema = new Schema<ILinkOptions>({
    title: String,
    url: String,
});

const questionSchema = new Schema<IQuestionOptions>({
    user: Object,
    question: String,
    questionReplies: [Object],
});

const courseDataSchema = new Schema<ICourseDataOpitons>({
    videoUrl: String,
    title: String,
    videoSection: String,
    videoLength: Number,
    description: String,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [questionSchema],
});

const courseSchema = new Schema<ICourseOptions>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        publicId: {
            type: String,
            // required: true, UNCOMMENT WHEN START WORK WITH CLOUDIANRY
        },
        url: {
            type: String,
            // required: true, UNCOMMENT WHEN START WORK WITH CLOUDIANRY
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequiesites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
});

const courseModel: Model<ICourseOptions> = mongoose.model(
    "Course",
    courseSchema
);

export default courseModel;
