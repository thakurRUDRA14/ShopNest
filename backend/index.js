import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./db/db.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

dotenv.config({
    path: './.env'
});

// Connection state tracking
const serviceStatus = {
    db: {
        connected: false,
        retryCount: 0,
        maxRetries: 5
    },
    cloudinary: {
        connected: false
    }
};

// Cloudinary configuration with health check
const configureCloudinary = async () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error("Cloudinary configuration is missing");
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        await cloudinary.api.ping();
        serviceStatus.cloudinary.connected = true;
        console.log("Cloudinary connected successfully");
    } catch (error) {
        console.error("Cloudinary connection failed:", error.message);
        serviceStatus.cloudinary.connected = false;
    }
};

// database connection with retry logic
const connectDBWithRetry = async () => {
    try {
        await connectDB();
        serviceStatus.db.connected = true;
        serviceStatus.db.retryCount = 0;
        console.log("MongoDB connected successfully");

        // Monitor connection events
        mongoose.connection.on('connected', () => {
            serviceStatus.db.connected = true;
            console.log("MongoDB reconnected");
        });

        mongoose.connection.on('disconnected', () => {
            serviceStatus.db.connected = false;
            console.warn("MongoDB disconnected");
        });

    } catch (error) {
        serviceStatus.db.retryCount++;

        if (serviceStatus.db.retryCount <= serviceStatus.db.maxRetries) {
            console.error(`MongoDB connection failed (attempt ${serviceStatus.db.retryCount}/${serviceStatus.db.maxRetries}):`, error.message);
            console.log(`Retrying in 10 seconds...`);
            setTimeout(connectDBWithRetry, 10000);
        } else {
            console.error("Maximum MongoDB connection retries reached");
            process.exit(1);
        }
    }
};

// Initialize connections
(async () => {
    try {
        await configureCloudinary();
        await connectDBWithRetry();

        const server = app.listen(process.env.PORT || 8000, () => {
            const address = server.address();
            const host = process.env.NODE_ENV === 'production'
                ? 'https://shopnest-gw81.onrender.com'
                : 'localhost';
            const port = address.port;

            console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode`);
            console.log(`🌐 Access the server at: ${process.env.NODE_ENV === 'production'
                ? `https://${host}`
                : `http://${host}:${port}`}`);

            if (process.env.NODE_ENV !== 'production') {
                console.log(`🩺 Health check endpoint: http://localhost:${port}/api/v1/health`);
            } else {
                console.log(`🔒 Production health check available at /api/v1/health`);
            }
        });

        // Enhanced error handlers
        process.on('uncaughtException', (err) => {
            console.error('Uncaught Exception:', err.stack || err.message);
            server.close(() => process.exit(1));
        });

        process.on('unhandledRejection', (err) => {
            console.error('Unhandled Rejection:', err.stack || err.message);
            server.close(() => process.exit(1));
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Process terminated');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Initialization failed:', error.stack || error.message);
        process.exit(1);
    }
})();

// Export for testing purposes
export { serviceStatus };