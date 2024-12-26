import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
    path: './.env'
})

// cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is missing");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to database
connectDB()
    .then(() => {
        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is working on http://localhost:${process.env.PORT}`);
        });

        // Global error handler for uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err.message);
            server.close(() => process.exit(1));
        });

        // Global error handler for unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err.message);
            server.close(() => process.exit(1));
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed!!", error);
    })