require("dotenv").config();
import nodeMailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
    // Check if all required environment variables are loaded
    const requiredEnvVars = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_SERVICE",
        "SMTP_MAIL",
        "SMTP_PASSWORD",
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`${envVar} is missing from environment variables`);
        }
    }

    // Create the transporter for sending emails
    const transporter: Transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587", 10), // Default to 587 if not provided
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const { email, subject, template, data } = options;

    // Get the path to the email template file
    const templatePath = path.join(__dirname, "../emails", template);

    try {
        // Render the email template with data
        const html = await ejs.renderFile(templatePath, data);

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email} successfully.`);
    } catch (error: any) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendMail;
