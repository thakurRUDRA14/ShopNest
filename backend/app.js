import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { useCors } from "./middlewares/cors.middleware.js"
import { authorizedRoles, verifyJWT } from "./middlewares/auth.middleware.js"
import errorHandler from "./middlewares/errorHandler.middleware.js"

const app = express()

app.use(useCors);

// preparing server for receiving data from different source
app.use(express.json({ limit: "16kb" }))      // data recieving from form.
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // data recieving from URL.
app.use(express.static("public")) // data recieving from file folder (stored in local).
app.use(cookieParser())           // data recieving from cookies or performing CRUD operation on cookie.
app.use(bodyParser.urlencoded({ extended: true })) // like app.use(express.urlencoded({}) but with bodyParser

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🛍️ Welcome to ShopNest - Your Premium E-commerce API Service",
        description: "Powering seamless online shopping experiences",
        version: "1.0",
        healthCheck: "/api/v1/health",
        documentation: "https://github.com/thakurRUDRA14/ShopNest",
        availableRoutes: {
            products: "/api/v1/product",
            users: "/api/v1/user",
            orders: "/api/v1/order",
            reviews: "/api/v1/review",
            admin: "/api/v1/admin"
        },
        support: "temp.backend@gmail.com",
        social: {
            linkedIn: "@thakurrudra",
            twitter: "@thakur__rudra",
            instagram: "@thakur._.rudra"
        }
    })
})

// ShopNest Health Check Route
app.get("/api/v1/health", async (req, res) => {
    const healthData = {
        success: true,
        status: "Operational",
        message: "ShopNest API is running smoothly",
        timestamp: new Date().toISOString(),
        uptime: `${process.uptime().toFixed(2)} seconds`,
        services: {
            database: {
                status: "Connected",
                dbName: mongoose.connection?.name || "Unknown",
                dbHost: mongoose.connection?.host || "Unknown",
                readyState: mongoose.STATES[mongoose.connection?.readyState] || "Unknown"
            },
            cloudinary: {
                status: "Connected",
                cloudName: process.env.CLOUDINARY_CLOUD_NAME || "Unknown"
            }
        },
        system: {
            memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            platform: process.platform,
            nodeVersion: process.version
        }
    };

    try {
        // Verify MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            healthData.services.database.status = "Disconnected";
            healthData.status = "Degraded";
            healthData.message = "API is running but database is disconnected";
        }

        // Verify Cloudinary connection
        try {
            await cloudinary.api.ping();
        } catch (error) {
            healthData.services.cloudinary.status = "Disconnected";
            healthData.status = "Degraded";
            healthData.message = "API is running but Cloudinary is disconnected";
        }

        // If both services are down
        if (healthData.services.database.status === "Disconnected" &&
            healthData.services.cloudinary.status === "Disconnected") {
            healthData.status = "Critical";
            healthData.message = "API is running but critical services are down";
        }

        const statusCode = healthData.status === "Operational" ? 200 : 503;
        res.status(statusCode).json(healthData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Health check failed",
            error: error.message
        });
    }
});

// importing routes
import productRouter from './routes/product.route.js'
import userRouter from './routes/user.route.js'
import orderRouter from './routes/order.route.js'
import adminRouter from './routes/admin.route.js'
import reviewRouter from './routes/review.route.js'

//defining routes
app.use("/api/v1/product", productRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/review", reviewRouter)
app.use(verifyJWT, authorizedRoles("admin"))
app.use("/api/v1/admin", adminRouter)

//middleware for error
app.use(errorHandler)

export default app