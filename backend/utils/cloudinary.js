import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

const uploadOnCloudinary = async (localFilePath, folder) => {
    if (!localFilePath || typeof localFilePath !== "string") {
        throw new ApiError("Invalid or missing local file path");
    }

    if (!folder || typeof folder !== "string") {
        throw new ApiError("Invalid or missing folder name");
    }

    try {
        // Upload file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: `ShopNest/${folder}`,
            height: 150,
            width: 150,
            crop: "scale",
            resource_type: "auto",
        });

        // Remove the local file
        try {
            fs.unlinkSync(localFilePath);
        } catch (error) {
            console.error("Error removing local file:", error);
        }

        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return next(new ApiError("Failed to upload file to Cloudinary"));
    }
};

const deleteFromCloudinary = async (public_id) => {
    if (!public_id || typeof public_id !== "string") {
        return next(new ApiError("Invalid or missing public ID"));
    }

    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        return next(new ApiError("Failed to delete file from Cloudinary"));
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
