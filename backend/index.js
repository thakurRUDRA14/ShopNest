import app from "./app.js";
import dotenv from 'dotenv'
import connectDB from "./db/db.js";

dotenv.config({
    path: './.env'
})



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