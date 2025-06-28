import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

const uploadOnCloudinary = async (localFilePath, folder, next) => {
    if (!localFilePath || typeof localFilePath !== "string") {
        return next(new ApiError(400, "Invalid or missing local file path"));
    }

    if (!folder || typeof folder !== "string") {
        return next(new ApiError(400, "Invalid or missing folder name"));
    }

    try {
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: `ShopNest/${folder}`,
            resource_type: "auto",
            transformation: [
                { quality: "auto:eco" }
            ]
        });
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return next(new ApiError(500, "Failed to upload file to Cloudinary"));
    } finally {
        // Clean up local file after upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
};

const deleteFromCloudinary = async (public_id, next) => {
    if (!public_id || typeof public_id !== "string") {
        return next(new ApiError(400, "Invalid or missing public ID"));
    }
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        return next(new ApiError(500, "Failed to delete file from Cloudinary"));
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
