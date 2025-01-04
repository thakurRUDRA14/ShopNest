import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (error, req, res, next) => {
    let response;

    // Handle custom ApiError
    if (error instanceof ApiError) {
        response = {
            statusCode: error.statusCode,
            message: error.message,
            success: error.success,
            errors: error.errors,
            data: error.data || null,
        };
        console.error(error.stack); // Log the stack for debugging
        return res.status(error.statusCode).json(response);
    }

    if (error instanceof multer.MulterError) {
        const message = err.message;
        error = new ApiError(400, message);
    }
    // Handle specific errors
    if (error.name === "CastError") {
        const message = `Resource not found. Invalid: ${error.path}`;
        error = new ApiError(400, message);
    }

    if (error.code === 11000) {
        const message = `Duplicate ${Object.keys(error.keyValue)} Entered`;
        error = new ApiError(400, message);
    }

    if (error.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid. Try again.`;
        error = new ApiError(400, message);
    }

    if (error.name === "TokenExpiredError") {
        const message = `Json Web Token is expired. Try again.`;
        error = new ApiError(400, message);
    }

    // Generic fallback for uncaught errors
    response = {
        statusCode: error.statusCode || 500,
        message: error.message || "Internal Server Error",
        success: false,
        errors: Array.isArray(error.errors) ? error.errors : [error.errors || "Unknown error occurred"],
        data: null,
    };

    console.error(error.stack || "No stack trace available"); // Log the stack trace
    return res.status(response.statusCode).json(response);
};

export default errorHandler;
