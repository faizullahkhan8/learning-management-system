import { Schema, model, Document } from "mongoose";

/**
 * Interface for FAQ items
 */
interface FAQItems extends Document {
    question: string;
    answer: string;
}

/**
 * Interface for Category items
 */
interface Category extends Document {
    title: string;
}

/**
 * Interface for Banner Image
 */
interface BannerImage extends Document {
    public_url: string; // Public URL for the image
    url: string; // Actual URL for the image
}

/**
 * Interface for Layout
 */
interface Layout extends Document {
    type: string; // Type of layout (e.g., "homepage", "about page")
    faq: FAQItems[]; // List of FAQ items
    categories: Category[]; // List of categories
    banner: {
        image: BannerImage; // Banner image details
        title: string; // Title for the banner
        subTitle: string; // Subtitle for the banner
    };
}

// Schema for FAQ items
const faqSchema = new Schema<FAQItems>({
    question: { type: String, required: true }, // Question text is required
    answer: { type: String, required: true }, // Answer text is required
});

// Schema for Categories
const categorySchema = new Schema<Category>({
    title: { type: String, required: true }, // Title of the category is required
});

// Schema for Banner Images
const bannerImageSchema = new Schema<BannerImage>({
    public_url: { type: String, required: true }, // Public URL is required
    url: { type: String, required: true }, // Actual URL is required
});

// Schema for Layout
const layoutSchema = new Schema<Layout>({
    type: { type: String, required: true }, // Type of layout is required
    faq: [faqSchema], // Array of FAQ items
    categories: [categorySchema], // Array of categories
    banner: {
        image: { type: bannerImageSchema, required: true }, // Banner image is required
        title: { type: String, required: true }, // Title of the banner is required
        subTitle: { type: String, required: true }, // Subtitle of the banner is required
    },
});

// Creating the Layout model
const LayoutModel = model<Layout>("Layout", layoutSchema);

export default LayoutModel;
