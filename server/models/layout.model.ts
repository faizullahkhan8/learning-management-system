import { Schema, model, Document } from "mongoose";

interface FAQItems extends Document {
    question: string;
    answer: string;
}

interface Category extends Document {
    title: string;
}

interface BannerImage extends Document {
    public_url: string;
    url: string;
}

interface Layout extends Document {
    type: string;
    faq: FAQItems[];
    categories: Category[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    };
}

const faqSchema = new Schema<FAQItems>({
    question: {
        type: String,
        // required: true,
    },
    answer: {
        type: String,
        // required: true,
    },
});

const categorySchema = new Schema<Category>({
    title: {
        type: String,
        // required: true,
    },
});

const bannerImageSchema = new Schema<BannerImage>({
    public_url: {
        type: String,
        // required: true,
    },
    url: {
        type: String,
        // required: true,
    },
});

const layoutSchema = new Schema<Layout>({
    type: {
        type: String,
        required: true,
    },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
        image: bannerImageSchema,
        title: {
            type: String,
            // required: true,
        },
        subTitle: {
            type: String,
            // required: true,
        },
    },
});

// interface Layout extends Document {
//     type: String;
//     data: Array<object>;
// }

// const layoutSchema: Schema<Layout> = new Schema(
//     {
//         type: {
//             type: String,
//             enum: ["FAQ", "CATEGORY", "BANNER"],
//             required: true,
//         },
//         data: [Object],
//     },
//     { timestamps: true }
// );

const LayoutModel = model<Layout>("Layout", layoutSchema);

export default LayoutModel;
