import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Validate Cloudinary config
// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//     throw new Error("Cloudinary configuration is missing");
// }

cloudinary.config({
    cloud_name: "rudra-backend",
    api_key: "235519899293992",
    api_secret: "bAzqeP_jdc2efQsNgi60TwgN3oM"
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("Invalid local file path");
        }

        // Upload file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "ShopNest/Avatar",
            width: 150,
            crop: "scale",
            resource_type: "auto"
        });

        // Remove the local file
        try {
            fs.unlinkSync(localFilePath);
        } catch (error) {
            console.error("Error removing local file:", error);
        }

        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        try {
            fs.unlinkSync(localFilePath);
        } catch (error) {
            console.error("Error removing local file:", error);
        }
        return null;
    }
};

export { uploadOnCloudinary };